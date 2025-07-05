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
import { useCartStore } from "@/app/_zustand/client/CartStore";
import ImageViewModal from "../../_modal/ImageViewModal";

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
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [showImageModal, setShowImageModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const resVariant = await getVariantDetail_API(id);
        console.log(resVariant);
        if (resVariant?.data) {
          setProduct(resVariant.data);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct({
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
      try {
        const productPrice = Math.round(product?.price || 0);
        const minPrice = Math.round(productPrice * 0.9); // Giá thấp hơn 10%
        const maxPrice = Math.round(productPrice * 1.1); // Giá cao hơn 10%
        
        const response = await getProducts_API('', 1, 10, {
          priceRange: [minPrice, maxPrice]
        });
        
        if (response?.data?.data) {
          setRelatedProducts(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching related products:', error);
        setRelatedProducts([]);
      }
    }
    fetchReviews();
  }, [product?.price]);

  // Group variants by size and color
  const sizes = React.useMemo(() => {
    if (!product?.variants) return [];
    const uniqueSizes = new Set();
    return product.variants
      .filter((v: any) => {
        if (!v?.size?.id) return false;
        const sizeId = v.size.id;
        if (uniqueSizes.has(sizeId)) return false;
        uniqueSizes.add(sizeId);
        return true;
      })
      .map((v: any) => v.size);
  }, [product?.variants]);

  const colors = React.useMemo(() => {
    if (!product?.variants) return [];
    const uniqueColors = new Set();
    return product.variants
      .filter((v: any) => {
        if (selectedSize && v?.size?.name !== selectedSize) return false;
        if (!v?.color?.id) return false;
        const colorId = v.color.id;
        if (uniqueColors.has(colorId)) return false;
        uniqueColors.add(colorId);
        return true;
      })
      .map((v: any) => v.color);
  }, [product?.variants, selectedSize]);

  useEffect(() => {
    if (product?.variants && selectedSize && selectedColor) {
      const variant = product.variants.find((v: any) => 
        v?.size?.name === selectedSize && v?.color?.id === selectedColor?.id
      );
      setSelectedVariant(variant || null);
    }
  }, [selectedSize, selectedColor, product?.variants]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  // Tính giá theo variant được chọn
  const getCurrentPrice = () => {
    if (!product?.variants?.length) return 0;
    
    // Tìm variant có priceAdjustment thấp nhất
    const minPriceVariant = product.variants.reduce((min: any, current: any) => {
      if (!min || current.priceAdjustment < min.priceAdjustment) {
        return current;
      }
      return min;
    }, null);

    return selectedVariant ? selectedVariant.priceAdjustment : minPriceVariant.priceAdjustment;
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
            <div className="space-y-2">
              <div className="h-6 bg-default-200 rounded w-1/4"></div>
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-10 w-20 bg-default-200 rounded"></div>
                ))}
              </div>
            </div>
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
                <GalleryImg 
                  productImageUrls={product?.imageUrls || []} 
                  onImageClick={(url) => {
                    setSelectedImage(url);
                    setShowImageModal(true);
                  }}
                />
              </div>
              <div className="flex justify-between items-center mt-6">
                <p className="text-sm font-medium text-foreground/60">Chia sẻ sản phẩm</p>
                <ShareSocial className="flex justify-end" size={22} />
              </div>
            </CardBody>
          </Card>

          <ImageViewModal 
            isOpen={showImageModal}
            onClose={() => setShowImageModal(false)}
            imageUrl={selectedImage}
          />

          {/* Product Info */}
          <div className="space-y-6">
            {/* Product title and rating */}
            <div className="bg-content1 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Chip color="primary" size="md" variant="flat">
                  {product?.code || 'N/A'}
                </Chip>
                <span className="text-sm text-foreground/60 bg-default-200 px-2 py-1 rounded-full">
                  {product?.category?.name || 'N/A'}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-3">
                {product?.name || 'N/A'}
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
            <div className="bg-content1 backdrop-blur-sm rounded-2xl p-4">
              {product.salePrice > 0 ? (
                <>
                  <div className="text-foreground/40 line-through text-lg mb-1">
                    {formatPrice(getCurrentPrice())}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-danger">
                    {formatPrice(getCurrentPrice())}
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
                    <img 
                      src={product?.team?.logoUrl} 
                      alt={product?.team?.name || 'Team logo'} 
                      className="w-10 h-10 rounded-full"
                    />
                    <span className="text-sm font-medium text-foreground">
                      {product?.team?.name || 'N/A'} - {product?.team?.league || 'N/A'}
                    </span>
                  </div>
                  <ChevronDown 
                    className={`transition-transform duration-200 text-foreground/60 ${showProductInfo ? 'rotate-180' : ''}`}
                  />
                </div>
                {showProductInfo && (
                  <div className="mt-4 space-y-3 text-sm text-foreground/60">
                    <p className="text-foreground font-semibold">Thông tin chi tiết về sản phẩm:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="bg-primary/10 p-2 rounded-lg">• Mùa giải: {product?.season || 'N/A'}</div>
                      <div className="bg-secondary/10 p-2 rounded-lg">• Loại: {product?.jerseyType || 'N/A'}</div>
                      <div className="bg-success/10 p-2 rounded-lg">• Chất liệu: {product?.material?.name || 'N/A'}</div>
                      <div className="bg-warning/10 p-2 rounded-lg">• Danh mục: {product?.category?.name || 'N/A'}</div>
                      <div className="bg-danger/10 p-2 rounded-lg">• Đội bóng: {product?.team?.name || 'N/A'}</div>
                      <div className="bg-default/10 p-2 rounded-lg">• Quốc gia: {product?.team?.country || 'N/A'}</div>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Size Selection */}
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground/80">Kích thước</label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size: any) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size.name)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedSize === size.name
                          ? "bg-primary text-white"
                          : "bg-default-100 hover:bg-default-200 text-foreground/80"
                      }`}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground/80">Màu sắc</label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color: any) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedColor?.id === color.id
                          ? "bg-primary text-white"
                          : "bg-default-100 hover:bg-default-200 text-foreground/80"
                      }`}
                    >
                      <div 
                        className="w-4 h-4 rounded-full border border-default-300" 
                        style={{ backgroundColor: color.hexColor }}
                      />
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground/80">Số lượng</label>
                <div className="inline-flex items-center h-11 rounded-lg border-2 border-default-200 bg-default-100/50 w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 h-full rounded-l-md hover:bg-default-200 text-foreground/80 transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center bg-transparent text-foreground font-medium"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 h-full rounded-r-md hover:bg-default-200 text-foreground/80 transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <Button
                size="lg"
                color="primary"
                variant="shadow"
                className="w-full"
                onClick={handleAddToCard}
                isDisabled={!selectedSize || !selectedColor}
              >
                <ShoppingCart className="mr-2" />
                Thêm vào giỏ hàng
              </Button>
            </div>

            {/* Stock Info */}
            {selectedVariant && (
              <div className="bg-success/10 border border-success/20 rounded-xl p-4">
                <span className="text-sm text-success">Còn lại: <span className="font-bold">{selectedVariant.stockQuantity}</span> sản phẩm</span>
              </div>
            )}

            {/* Features */}
            <div className="bg-content1 backdrop-blur-sm rounded-2xl p-4">
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
              <h2 className="text-2xl font-bold text-foreground mb-6">Mô tả sản phẩm</h2>
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
