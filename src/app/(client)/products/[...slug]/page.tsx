"use client";
import { getProductDetail_API } from "@/app/_service/products";
import React, { useEffect, useState } from "react";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  ShoppingCart,
  Share2,
  Truck,
  RotateCcw,
  Phone,
  MapPin,
  MessageCircle,
} from "lucide-react";
import RenderTextEditer from "@/app/_util/ui/RenderTextEditer";
import GalleryImg from "@/app/components/GalleryImg";
import { toast } from "react-toastify";
import ShareSocial from "@/app/components/ShareSocial ";
import EvaluateComment from "@/app/components/EvaluateCommet";
import ProductCarousel from "@/app/components/category/ProductCarousel";
export default function ProductDetailPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const id = params.slug[1];
  const productName = params.slug[0];
  const [product, setProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Mock data for sizes and colors (since not in original data)
  const sizes = ["S", "M", "L", "XL", "2XL", "3XL"];
  const colors = [
    { name: "Xanh Forest Night", value: "#4a5d23" },
    { name: "Nâu", value: "#8B4513" },
    { name: "Xanh lá", value: "#228B22" },
    { name: "Đỏ", value: "#DC143C" },
    { name: "Tím", value: "#800080" },
    { name: "Cam", value: "#FF4500" },
    { name: "Xanh dương", value: "#1E90FF" },
    { name: "Xám", value: "#808080" },
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await getProductDetail_API(id);
      setProduct(res.data);
      if (sizes.length > 0) setSelectedSize(sizes[2]); // Default to L
    };
    fetchProduct();
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const calculateDiscount = () => {
    if (product && product.price !== product.salePrice) {
      return Math.round(
        ((product.price - product.salePrice) / product.price) * 100
      );
    }
    return 0;
  };

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded"></div>
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-16 h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="flex flex-col gap-2 shadow-lg rounded-lg p-4">
            <GalleryImg productImageUrls={product.imageUrls} />
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">Chia sẻ</p>
              <ShareSocial className="flex justify-end" size={20} />
            </div>
          </div>
          {/* Product Info */}
          <div className="space-y-6">
            {/* Product title and rating */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        i < 4 ? "fill-yellow-500 text-yellow-500" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(4.9)</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-1">
              {product.price !== product.salePrice ? (
                <>
                  <div className="text-gray-400 line-through text-lg">
                    {formatPrice(product.price)}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-black">
                      {formatPrice(product.salePrice)}
                    </span>
                    <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-medium">
                      -{calculateDiscount()}%
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-3xl font-bold text-black">
                  {formatPrice(product.price)}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Truck size={16} />
                <span>Freeship đơn trên 200K</span>
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Màu sắc:</span>
                <span className="text-sm text-gray-600">Xanh Forest Night</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {colors.map((color, idx) => (
                  <div
                    key={idx}
                    className={`w-8 h-8 rounded border-2 cursor-pointer ${
                      idx === 0 ? "border-black" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Kích thước:{" "}
                  <span className="font-normal">
                    2XL (lm77 - lm83 | 78kg - 84kg)
                  </span>
                </span>
                <button className="text-sm text-blue-600 hover:underline">
                  Hướng dẫn chọn size
                </button>
              </div>
              <div className="flex gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded text-sm font-medium ${
                      selectedSize === size
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                    }`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100">
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-100">
                    <Plus size={16} />
                  </button>
                </div>
                <button className="flex-1 bg-black text-white py-3 px-6 rounded font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                  <ShoppingCart size={20} />
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-xs">CB</span>
                </div>
                <span>Được hoàn lên đến 12,000 CoolCash. Chi tiết</span>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <MessageCircle size={16} className="text-blue-600" />
                <span>Chat để được Coolmate tư vấn ngay (8:30 - 22:00)</span>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Truck size={16} className="text-black" />
                <span>Free ship cho đơn từ 200k</span>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <RotateCcw size={16} className="text-black" />
                <span>60 ngày đổi trả vì bất kỳ lý do gì</span>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-black" />
                <span>Hotline 1900 27 27 37 hỗ trợ từ 8h30 - 22h mỗi ngày</span>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <MapPin size={16} className="text-black" />
                <span>Đến tận nơi nhận hàng trả, hoàn tiền trong 24h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
  
        <div className="mt-4">
          <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-100">
            <RenderTextEditer value={product.description} type="sort" />
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-4">
          <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-100">
            <EvaluateComment />
          </div>
        </div>
        {/* Sản phẩm liên quan */}
        <div className="mt-4">
          <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-100">
            <ProductCarousel />
          </div>
        </div>
        
      </div>
    </div>
  );
}
