"use client";
import { getProductDetail_API, getVariantDetail_API } from "@/app/_service/products";
import React, { useEffect, useState } from "react";
import {
  Star,
  Plus,
  Minus,
  ShoppingCart,
  Truck,
  RotateCcw,
  Phone,
  MapPin,
  MessageCircle,
  ChevronDown
} from "lucide-react";
import RenderTextEditer from "@/app/_util/ui/RenderTextEditer";
import GalleryImg from "@/app/components/GalleryImg";
import { toast } from "react-toastify";
import ShareSocial from "@/app/components/ShareSocial ";
import EvaluateComment from "@/app/components/EvaluateCommet";
import ProductCarousel from "@/app/components/category/ProductCarousel";
import InstructChooseSize from "@/app/(client)/_modal/InstructChooseSize";
import { CreateCard_API } from "@/app/_service/Card";
import useAuthInfor from "@/app/customHooks/AuthInfor";
import { Button, Card, CardBody } from "@nextui-org/react";

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const { userInfo } = useAuthInfor();
  const id = params.slug[1];
  const [product, setProduct] = useState<any>({
    name: '',
    price: 0,
    salePrice: 0,
    imageUrls: [],
    variants: [],
    team: {
      name: '',
      league: '',
      logoUrl: '',
      country: ''
    },
    season: '',
    jerseyType: '',
    material: { name: '' },
    category: { name: '' },
    description: ''
  });
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [showTeamInfo, setShowTeamInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const resVariant = await getVariantDetail_API(id);
        setProduct(resVariant.data);
        if (resVariant.data?.variants?.length > 0) {
          const firstVariant = resVariant.data.variants[0];
          setSelectedSize(firstVariant.size);
          setSelectedVariant(firstVariant);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    if (product && selectedSize) {
      const variant = product.variants.find((v: any) => v.size === selectedSize);
      setSelectedVariant(variant);
    }
  }, [selectedSize, product]);

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

  const handleAddToCard = async () => {
    if (!selectedVariant) {
      toast.error("Vui lòng chọn kích thước");
      return;
    }

    const data = {
      "cartId": userInfo.cartId,
      "variantId": selectedVariant.id,
      "quantity": quantity
    }
    
    try {
      const res = await CreateCard_API(data);
      if (res.status === 200) {
        toast.success("Thêm vào giỏ hàng thành công");
      }
    } catch (error) {
      toast.error("Thêm vào giỏ hàng thất bại");
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="aspect-square bg-default-200 rounded"></div>
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-16 h-16 bg-default-200 rounded"></div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-8 bg-default-200 rounded w-3/4"></div>
            <div className="h-6 bg-default-200 rounded w-1/2"></div>
            <div className="h-10 bg-default-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product || !product.name) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-center text-default-500">Không tìm thấy sản phẩm</p>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <Card className="shadow-medium">
            <CardBody className="p-4">
              <div className="max-h-[500px] overflow-hidden">
                <GalleryImg productImageUrls={product.imageUrls} />
              </div>
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-default-500">Chia sẻ</p>
                <ShareSocial className="flex justify-end" size={20} />
              </div>
            </CardBody>
          </Card>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Product title and rating */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        i < 4 ? "fill-warning text-warning" : "text-default-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-default-500">(4.9)</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-1">
              {product.price !== product.salePrice ? (
                <>
                  <div className="text-default-400 line-through text-lg">
                    {formatPrice(product.price)}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-foreground">
                      {formatPrice(product.salePrice)}
                    </span>
                    <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-medium">
                      -{calculateDiscount()}%
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-3xl font-bold text-foreground">
                  {formatPrice(product.price)}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-default-600">
                <Truck size={16} />
                <span>Freeship đơn trên 200K</span>
              </div>
            </div>

            {/* Team Info */}
            <Card 
              className="cursor-pointer" 
              isPressable
              onPress={() => setShowTeamInfo(!showTeamInfo)}
            >
              <CardBody className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={product.team.logoUrl} alt={product.team.name} className="w-8 h-8"/>
                    <span className="text-sm text-foreground">{product.team.name} - {product.team.league}</span>
                  </div>
                  <ChevronDown 
                    className={`transition-transform duration-200 text-default-500 ${showTeamInfo ? 'rotate-180' : ''}`}
                  />
                </div>
                {showTeamInfo && (
                  <div className="mt-4 space-y-2 text-sm text-default-600">
                    <p className="text-foreground font-medium">Thông tin chi tiết về sản phẩm:</p>
                    <ul className="space-y-2">
                      <li>• Mùa giải: {product.season}</li>
                      <li>• Loại áo: {product.jerseyType}</li>
                      <li>• Chất liệu: {product.material.name}</li>
                      <li>• Danh mục: {product.category.name}</li>
                      <li>• Đội bóng: {product.team.name}</li>
                      <li>• Giải đấu: {product.team.league}</li>
                      <li>• Quốc gia: {product.team.country}</li>
                    </ul>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Size */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Kích thước: <span className="font-normal">{selectedSize}</span>
                </span>
                <Button 
                  size="sm" 
                  variant="light" 
                  color="primary"
                  onPress={() => setIsOpen(true)}
                >
                  Hướng dẫn chọn size
                </Button>
              </div>
              <div className="flex gap-2">
                {product.variants.map((variant: any) => (
                  <Button
                    key={variant.size}
                    size="sm"
                    variant={selectedSize === variant.size ? "solid" : "bordered"}
                    color={selectedSize === variant.size ? "primary" : "default"}
                    onPress={() => setSelectedSize(variant.size)}
                  >
                    {variant.size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={() => setQuantity(Math.max(1, quantity - 1))}
                    isDisabled={!selectedVariant}
                  >
                    <Minus size={16} />
                  </Button>
                  <span className="px-4 py-2 min-w-[60px] text-center text-foreground">
                    {quantity}
                  </span>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={() => setQuantity(quantity + 1)}
                    isDisabled={!selectedVariant}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                <Button 
                  color="primary"
                  size="lg"
                  className="flex-1"
                  startContent={<ShoppingCart size={20} />}
                  onPress={handleAddToCard}
                  isDisabled={!selectedVariant}
                >
                  Thêm vào giỏ hàng
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                  <span className="text-primary font-bold text-xs">CB</span>
                </div>
                <span className="text-default-600">Được hoàn lên đến 12,000 CoolCash. Chi tiết</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-default-600">
                <MessageCircle size={16} className="text-primary" />
                <span>Chat để được Coolmate tư vấn ngay (8:30 - 22:00)</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-default-600">
                <Truck size={16} />
                <span>Free ship cho đơn từ 200k</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-default-600">
                <RotateCcw size={16} />
                <span>60 ngày đổi trả vì bất kỳ lý do gì</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-default-600">
                <Phone size={16} />
                <span>Hotline 1900 27 27 37 hỗ trợ từ 8h30 - 22h mỗi ngày</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-default-600">
                <MapPin size={16} />
                <span>Đến tận nơi nhận hàng trả, hoàn tiền trong 24h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-8">
          <Card className="shadow-small">
            <CardBody className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-semibold text-foreground">Mô tả sản phẩm</h2>
                <div className="flex-1 border-b border-border"></div>
              </div>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <RenderTextEditer value={product.description} type="sort" />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Reviews Section */}
        <div className="mt-8">
          <Card className="shadow-small">
            <CardBody className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-semibold text-foreground">Đánh giá sản phẩm</h2>
                <div className="flex-1 border-b border-border"></div>
              </div>
              <EvaluateComment />
            </CardBody>
          </Card>
        </div>

        {/* Sản phẩm liên quan */}
        <div className="mt-8">
          <Card className="shadow-small">
            <CardBody className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-semibold text-foreground">Sản phẩm liên quan</h2>
                <div className="flex-1 border-b border-border"></div>
              </div>
              <ProductCarousel />
            </CardBody>
          </Card>
        </div>
        <InstructChooseSize isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </div>
  );
}
