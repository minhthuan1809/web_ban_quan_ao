"use client";
import { getProductDetail_API, getProducts_API, getVariantDetail_API } from "@/app/_service/products";
import React, { useEffect, useState, Suspense, lazy } from "react";
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
import { CreateCard_API } from "@/app/_service/Card";
import useAuthInfor from "@/app/customHooks/AuthInfor";
import { Button, Card, CardBody, Chip } from "@nextui-org/react";
import { calculateDiscountedPrice } from "@/app/_util/CalculateCartPrice";
import { useCartStore } from "@/app/_zustand/client/CartStore";

// Lazy load heavy components
const EvaluateComment = lazy(() => import("@/app/components/EvaluateCommet"));
const ProductCarousel = lazy(() => import("@/app/components/category/ProductCarousel"));
const InstructChooseSize = lazy(() => import("@/app/(client)/_modal/InstructChooseSize"));

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const { user } = useAuthInfor();
  const { addToCart } = useCartStore();
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
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const resVariant = await getVariantDetail_API(id);
        setProduct(resVariant.data);
        
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

  // Sản phẩm liên quan
  useEffect(() => {
    const fetchReviews = async () => {
      const productPrice = Math.round(product.price);
      const minPrice = Math.round(productPrice * 0.9); // Giá thấp hơn 10%
      const maxPrice = Math.round(productPrice * 1.1); // Giá cao hơn 10%
      
      const response = await getProducts_API('', 1, 10, {
        priceRange: [minPrice, maxPrice]
      });
    
      setRelatedProducts(response.data.data);
    }
    fetchReviews();
  }, [product]);

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
    }
  }, [selectedSize, selectedColor, product.variants]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  // Tính giá theo variant được chọn
  const getCurrentPrice = () => {
    return selectedVariant?.priceAdjustment || product.price || 0;
  };

  const getCurrentSalePrice = () => {
    const currentPrice = getCurrentPrice();
    const salePercent = product.salePrice || 0;
    return currentPrice * (1 - salePercent/100);
  };

  

  const handleAddToCard = async () => {
if(user){
    const data = {
      "cartId": user.cartId,
      "variantId": selectedVariant.id,
      "quantity": quantity
    }
    
    try {
      const res = await CreateCard_API(data);
      if (res.status === 200) {
        toast.success("Thêm vào giỏ hàng thành công");
        // Cập nhật Zustand store
        const cartItem = {
          id: res.data?.id || Date.now(), // Sử dụng ID từ response hoặc timestamp
          quantity: quantity,
          variant: selectedVariant
        };
        addToCart(cartItem);
      }
    } catch (error) {
      toast.error("Thêm vào giỏ hàng thất bại");
    }
  }else{
    toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <Card className="shadow-lg bg-content1 backdrop-blur-sm border border-divider">
            <CardBody className="p-6">
              <div className="max-h-[500px] overflow-hidden rounded-xl">
                <GalleryImg productImageUrls={product.imageUrls} />
              </div>
              <div className="flex justify-between items-center mt-6">
                <p className="text-sm font-medium text-foreground/60">Chia sẻ sản phẩm</p>
                <ShareSocial className="flex justify-end" size={22} />
              </div>
            </CardBody>
          </Card>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Product title and rating */}
            <div className="bg-content1 backdrop-blur-sm rounded-2xl px-6 border border-divider">
              <div className="flex items-center gap-2 mb-3">
                <Chip color="primary" size="md" variant="flat">
                  {product.code}
                </Chip>
                <span className="text-sm text-foreground/60 bg-default-200 px-2 py-1 rounded-full">{product.category.name}</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-3">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        i < 4 ? "fill-yellow-400 text-yellow-400" : "text-default-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-foreground/60">(4.9)</span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-content1 backdrop-blur-sm rounded-2xl px-6 border border-divider">
              {product.salePrice > 0 ? (
                <>
                  <div className="text-foreground/40 line-through text-lg mb-1">
                    {formatPrice(getCurrentPrice())}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-danger">
                      {formatPrice(getCurrentSalePrice())}
                    </span>
                    <span className="bg-danger text-danger-foreground px-3 py-1 rounded-full text-sm font-bold">
                      -{product.salePrice}%
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-3xl font-bold text-danger">
                  {formatPrice(getCurrentPrice())}
                </div>
              )}

            </div>

            {/* Team/Product Info */}
            <Card 
              className="cursor-pointer bg-content1 backdrop-blur-sm border border-divider hover:shadow-lg transition-all duration-200" 
              isPressable
              onPress={() => setShowProductInfo(!showProductInfo)}
            >
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={product.team.logoUrl} alt={product.team.name} className="w-10 h-10 rounded-full"/>
                    <span className="text-sm font-medium text-foreground">{product.team.name} - {product.team.league}</span>
                  </div>
                  <ChevronDown 
                    className={`transition-transform duration-200 text-foreground/60 ${showProductInfo ? 'rotate-180' : ''}`}
                  />
                </div>
                {showProductInfo && (
                  <div className="mt-4 space-y-3 text-sm text-foreground/60">
                    <p className="text-foreground font-semibold">Thông tin chi tiết về sản phẩm:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="bg-primary/10 p-2 rounded-lg">• Mùa giải: {product.season}</div>
                      <div className="bg-secondary/10 p-2 rounded-lg">• Loại: {product.jerseyType}</div>
                      <div className="bg-success/10 p-2 rounded-lg">• Chất liệu: {product.material.name}</div>
                      <div className="bg-warning/10 p-2 rounded-lg">• Danh mục: {product.category.name}</div>
                      <div className="bg-danger/10 p-2 rounded-lg">• Đội bóng: {product.team.name}</div>
                      <div className="bg-default/10 p-2 rounded-lg">• Quốc gia: {product.team.country}</div>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Size Selection */}
            <div className="bg-content1 backdrop-blur-sm rounded-2xl px-6 border border-divider">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-foreground">
                  Kích thước
                </span>
                <Button 
                  size="sm" 
                  variant="flat" 
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
                    size="md"
                    variant={selectedSize === size.name ? "solid" : "bordered"}
                    color={selectedSize === size.name ? "primary" : "default"}
                    onPress={() => setSelectedSize(size.name)}
                    className={selectedSize === size.name ? 
                      "bg-primary text-primary-foreground" : 
                      "border-divider text-foreground/80 hover:border-primary"
                    }
                  >
                    {size.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            {colors.length > 0 && selectedSize && (
              <div className="bg-content1 backdrop-blur-sm rounded-2xl p-2 border border-divider">
                <span className="text-sm font-semibold text-foreground mb-4 block">
                  Màu sắc
                </span>
                <div className="flex flex-wrap gap-3 mb-4">
                  {colors.map((color: any) => (
                    <Button
                      key={color.id}
                      isIconOnly
                      className={`w-12 h-12 rounded-full p-0.5 border-2 ${selectedColor?.id === color.id ? 'border-primary' : 'border-divider'}`}
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
                  <p className="text-sm text-foreground/60 bg-content2 p-2 rounded-lg">Đã chọn: <span className="font-medium">{selectedColor.name}</span></p>
                )}
              </div>
            )}

            {/* Stock Info */}
            {selectedVariant && (
              <div className="bg-success/10 border border-success/20 rounded-xl p-4">
                <span className="text-sm text-success">Còn lại: <span className="font-bold">{selectedVariant.stockQuantity}</span> sản phẩm</span>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="bg-content1 backdrop-blur-sm rounded-2xl px-6 border border-divider">
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-divider rounded-xl overflow-hidden">
                  <Button
                    isIconOnly
                    size="md"
                    variant="light"
                    onPress={() => setQuantity(Math.max(1, quantity - 1))}
                    isDisabled={!selectedVariant}
                    className="text-foreground/60 hover:bg-content2"
                  >
                    <Minus size={16} />
                  </Button>
                  <span className="px-6 py-3 min-w-[80px] text-center text-foreground font-medium bg-content2">
                    {quantity}
                  </span>
                  <Button
                    isIconOnly
                    size="md"
                    variant="light"
                    onPress={() => setQuantity(quantity + 1)}
                    isDisabled={!selectedVariant || quantity >= selectedVariant?.stockQuantity}
                    className="text-foreground/60 hover:bg-content2"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                <Button 
                  color="primary"
                  size="lg"
                  className="flex-1 bg-primary text-primary-foreground font-semibold"
                  startContent={<ShoppingCart size={20} />}
                  onPress={handleAddToCard}
                  isDisabled={!selectedVariant}
                >
                  Thêm vào giỏ hàng
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="bg-content1 backdrop-blur-sm rounded-2xl px-6 border border-divider">
              <h3 className="text-lg font-semibold text-foreground mb-4">Chính sách & Ưu đãi</h3>
              <div className="space-y-4">
            

                <div className="flex items-center gap-3 text-sm p-3 bg-success/10 rounded-lg">
                  <MessageCircle size={16} className="text-success" />
                  <span className="text-foreground/80">Chat để được tư vấn ngay (8:30 - 22:00)</span>
                </div>

                <div className="flex items-center gap-3 text-sm p-3 bg-secondary/10 rounded-lg">
                  <Truck size={16} className="text-secondary" />
                  <span className="text-foreground/80">Free ship cho đơn từ 200k</span>
                </div>

                <div className="flex items-center gap-3 text-sm p-3 bg-warning/10 rounded-lg">
                  <RotateCcw size={16} className="text-warning" />
                  <span className="text-foreground/80">60 ngày đổi trả vì bất kỳ lý do gì</span>
                </div>

                <div className="flex items-center gap-3 text-sm p-3 bg-primary/10 rounded-lg">
                  <Phone size={16} className="text-primary" />
                  <span className="text-foreground/80">Hotline 1900 27 27 37 hỗ trợ từ 8h30 - 22h mỗi ngày</span>
                </div>

              
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-8">
          <Card className="shadow-lg bg-content1 backdrop-blur-sm border border-divider">
            <CardBody className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-primary rounded-full"></div>
                <h2 className="text-2xl font-bold text-foreground">Mô tả sản phẩm</h2>
                <div className="flex-1 border-b border-divider"></div>
              </div>
              <div className="prose prose-sm max-w-none text-foreground/80 dark:prose-invert">
                <RenderTextEditer value={product.description} type="sort" />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Reviews Section */}
        <div className="mt-8">
          <Card className="shadow-small">
            <CardBody className="p-6">
              <Suspense fallback={<div className="h-32 flex items-center justify-center">Đang tải đánh giá...</div>}>
              <EvaluateComment />
              </Suspense>
            </CardBody>
          </Card>
        </div>

        {/* Sản phẩm liên quan */}
        <div className="mt-8">
          <Card className="shadow-small">
            <CardBody className="p-6">
              <Suspense fallback={<div className="h-48 flex items-center justify-center">Đang tải sản phẩm liên quan...</div>}>
              <ProductCarousel title="Sản phẩm liên quan" data={relatedProducts} />
              </Suspense>
            </CardBody>
          </Card>
        </div>
        
        <Suspense fallback={null}>
        <InstructChooseSize isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </Suspense>
      </div>
    </div>
  );
}
