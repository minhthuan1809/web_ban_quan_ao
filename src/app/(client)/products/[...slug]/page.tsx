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
import { Button, Card, CardBody, Chip } from "@nextui-org/react";

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
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [showProductInfo, setShowProductInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentSalePrice, setCurrentSalePrice] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const resVariant = await getVariantDetail_API(id);
        
        setProduct(resVariant.data);
        setCurrentPrice(resVariant.data.price);
        setCurrentSalePrice(resVariant.data.salePrice);
        
        if (resVariant.data?.variants?.length > 0) {
          const firstVariant = resVariant.data.variants[0];
          setSelectedSize(firstVariant.size.name);
          setSelectedColor(firstVariant.color);
          setSelectedVariant(firstVariant);
          
          if (firstVariant.priceAdjustment) {
            setCurrentPrice(firstVariant.priceAdjustment);
            setCurrentSalePrice(firstVariant.priceAdjustment);
          }
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

  // Group variants by size and color
  const sizes = React.useMemo(() => {
    if (!product.variants) return [];
    const uniqueSizes = new Set();
    return product.variants
      .filter((v: any) => {
        const sizeId = v.size.id;
        if (uniqueSizes.has(sizeId)) return false;
        uniqueSizes.add(sizeId);
        return true;
      })
      .map((v: any) => v.size);
  }, [product.variants]);

  const colors = React.useMemo(() => {
    if (!product.variants) return [];
    const uniqueColors = new Set();
    return product.variants
      .filter((v: any) => {
        if (selectedSize && v.size.name !== selectedSize) return false;
        const colorId = v.color.id;
        if (uniqueColors.has(colorId)) return false;
        uniqueColors.add(colorId);
        return true;
      })
      .map((v: any) => v.color);
  }, [product.variants, selectedSize]);

  useEffect(() => {
    if (product.variants && selectedSize && selectedColor) {
      const variant = product.variants.find((v: any) => 
        v.size.name === selectedSize && v.color.id === selectedColor.id
      );
      setSelectedVariant(variant);
      
      if (variant?.priceAdjustment) {
        setCurrentPrice(variant.priceAdjustment);
        setCurrentSalePrice(variant.priceAdjustment);
      } else {
        setCurrentPrice(product.price);
        setCurrentSalePrice(product.salePrice);
      }
    }
  }, [selectedSize, selectedColor, product.variants, product.price, product.salePrice]);

  // When size changes, update color selection
  useEffect(() => {
    if (colors.length > 0 && (!selectedColor || !colors.some((c: any) => c.id === selectedColor.id))) {
      setSelectedColor(colors[0]);
    }
  }, [colors, selectedColor]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const calculateDiscount = () => {
    if (currentPrice !== currentSalePrice) {
      return Math.round(
        ((currentPrice - currentSalePrice) / currentPrice) * 100
      );
    }
    return 0;
  };

  const handleAddToCard = async () => {
    if (!selectedVariant) {
      toast.error("Vui lòng chọn kích thước và màu sắc");
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
              <div className="flex items-center gap-2 mb-1">
                <Chip color="primary" size="sm" variant="flat">
                  {product.code}
                </Chip>
                <span className="text-sm text-default-500">{product.category.name}</span>
              </div>
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
              {currentPrice !== currentSalePrice ? (
                <>
                  <div className="text-default-400 line-through text-lg">
                    {formatPrice(currentPrice)}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-foreground">
                      {formatPrice(currentSalePrice)}
                    </span>
                    <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-medium">
                      -{calculateDiscount()}%
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-3xl font-bold text-foreground">
                  {formatPrice(currentPrice)}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-default-600">
                <Truck size={16} />
                <span>Freeship đơn trên 200K</span>
              </div>
            </div>

            {/* Team/Product Info */}
            <Card 
              className="cursor-pointer" 
              isPressable
              onPress={() => setShowProductInfo(!showProductInfo)}
            >
              <CardBody className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={product.team.logoUrl} alt={product.team.name} className="w-8 h-8"/>
                    <span className="text-sm text-foreground">{product.team.name} - {product.team.league}</span>
                  </div>
                  <ChevronDown 
                    className={`transition-transform duration-200 text-default-500 ${showProductInfo ? 'rotate-180' : ''}`}
                  />
                </div>
                {showProductInfo && (
                  <div className="mt-4 space-y-2 text-sm text-default-600">
                    <p className="text-foreground font-medium">Thông tin chi tiết về sản phẩm:</p>
                    <ul className="space-y-2">
                      <li>• Mùa giải: {product.season}</li>
                      <li>• Loại sản phẩm: {product.jerseyType}</li>
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

            {/* Size Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Kích thước
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
              <div className="flex flex-wrap gap-2">
                {sizes.map((size: any) => (
                  <Button
                    key={size.id}
                    size="sm"
                    variant={selectedSize === size.name ? "solid" : "bordered"}
                    color={selectedSize === size.name ? "primary" : "default"}
                    onPress={() => setSelectedSize(size.name)}
                  >
                    {size.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            {colors.length > 0 && (
              <div className="space-y-3">
                <span className="text-sm font-medium text-foreground">
                  Màu sắc
                </span>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color: any) => (
                    <Button
                      key={color.id}
                      isIconOnly
                      className={`w-10 h-10 rounded-full p-0.5 ${selectedColor?.id === color.id ? 'ring-2 ring-primary' : ''}`}
                      style={{ background: color.hexColor }}
                      onPress={() => setSelectedColor(color)}
                    >
                      {selectedColor?.id === color.id && (
                        <div className="bg-white/30 rounded-full p-1">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12L10 17L20 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      )}
                    </Button>
                  ))}
                </div>
                {selectedColor && (
                  <p className="text-sm text-default-600">Đã chọn: {selectedColor.name}</p>
                )}
              </div>
            )}

            {/* Stock Info */}
            {selectedVariant && (
              <div className="text-sm text-default-600">
                <span>Còn lại: <span className="font-medium">{selectedVariant.stockQuantity}</span> sản phẩm</span>
              </div>
            )}

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
                    isDisabled={!selectedVariant || quantity >= selectedVariant?.stockQuantity}
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
                <span>Chat để được tư vấn ngay (8:30 - 22:00)</span>
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
