import React, { useState } from 'react';
import { Eye, Trash2, Search, Plus, Edit, ChevronDown, ChevronRight, Filter, X } from 'lucide-react';
import Loading from '@/app/_util/Loading';
import FormatPrice from '@/app/_util/FormatPrice';
import RenderTextEditer from '@/app/_util/ui/RenderTextEditer';
import { Pagination, Input, Button, Badge } from '@nextui-org/react';
import Modadescription from '../_modal/Modadescription';
import { DiscountPrice } from '@/app/_util/DiscountPrice';

interface RenderProductTableProps {
  products: any[];
  loading: boolean;
  handleDeleteProduct: (product: any) => void;
  setIsOpen: (isOpen: boolean) => void;
  setEdit: (product: any) => void;
  setSearchTerm: (searchTerm: string) => void;
  searchTerm: string;
  totalPage: number;
  currentPage: number;
  onChangePage: (onChangePage: number) => void;
}

export default function RenderProductTable({
  products,
  loading,
  handleDeleteProduct,
  setIsOpen,
  setEdit,
  setSearchTerm,
  searchTerm,
  totalPage = 0,
  currentPage = 1,
  onChangePage
}: RenderProductTableProps) {
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [description, setDescription] = useState<any>(null);

  const toggleRowExpansion = (productId: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedRows(newExpanded);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('vi-VN');
  };

  return (
    <div className="mx-auto px-6 py-6">
      {/* Search Bar */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-4 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md flex-1">
              <Input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startContent={<Search className="text-default-400" size={20} />}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Hiển thị {products.length} sản phẩm
            </span>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
        {/* Table Header */}
        <div className="bg-muted border-b border-border">
          <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium text-foreground">
            <div className="col-span-0.5"></div>
            <div className="col-span-4">Tên Sản Phẩm</div>
            <div className="col-span-2 text-center">Giá</div>
            <div className="col-span-2 text-center">Số Lượng</div>
            <div className="col-span-2 text-center">Trạng Thái</div>
            <div className="col-span-1 text-center">Hành Động</div>
          </div>
        </div>

        {/* Product Rows */}
        <div className="divide-y divide-border">
          {loading ? (
            <Loading />
          ) : products.length > 0 ? (
            products.map((product: any, index: number) => (
              <React.Fragment key={index}>
                {/* Main Row */}
                <div className="grid grid-cols-12 gap-4 p-4 hover:bg-muted/50 transition-colors">
                  {/* Expand Button */}
                  <div className="col-span-0.5 flex items-center">
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      onClick={() => toggleRowExpansion(product.id)}
                    >
                      {expandedRows.has(product.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  {/* Product Info */}
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-16 h-16 relative flex-shrink-0 overflow-hidden rounded-lg border border-border">
                      <img
                        src={product.imageUrls[0]}
                        alt={product.name}
                        className="object-cover rounded-lg w-full h-full"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="flat" color="primary" size="sm">
                          {product?.category?.name}
                        </Badge>
                        <span className="text-xs text-muted-foreground">Mã: {product.code}</span>
                      </div>
                      <h3 className="font-bold p-2 text-foreground mb-1 truncate">
                        {product?.name}
                      </h3>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-2 flex items-center justify-center">
                    <div className="text-center">
                      {product?.salePrice ? (
                        <div>
                          <div className="line-through text-muted-foreground text-sm">
                            {product.price.toLocaleString()} đ
                          </div>
                          <div className="text-danger font-semibold">
                            <FormatPrice
                              price={DiscountPrice(product.price, product.salePrice)}
                              className="text-danger font-semibold"
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="font-semibold text-foreground">
                          {product.price.toLocaleString()} đ
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="col-span-2 flex items-center justify-center">
                    <span className="font-medium text-foreground">
                      {product.variants.reduce((total: number, variant: any) => total + variant.stockQuantity, 0)}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-2 flex items-center justify-center">
                    <Badge
                      color={product.isDeleted ? "danger" : "success"}
                      variant="flat"
                      size="sm"
                    >
                      {product.isDeleted ? "Ngừng bán" : "Hoạt động"}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex items-center justify-center">
                    <div className="flex gap-1">
                      <Button
                        isIconOnly
                        variant="light"
                        size="sm"
                        color="primary"
                        onClick={() => {
                          setIsOpen(true)
                          setEdit(product)
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        isIconOnly
                        variant="light"
                        size="sm"
                        color="danger"
                        onClick={() => handleDeleteProduct(product)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Row */}
                  {expandedRows.has(product.id) && (
                    <div className="col-span-12 px-4 pb-4">
                      <div className="bg-card rounded-lg border border-border p-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Thông tin chi tiết */}
                          <div className="space-y-4">
                            <h4 className="font-semibold text-foreground mb-3">Thông tin chi tiết</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Slug:</span>
                                <div className="font-medium text-foreground">{product.slug}</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Đội bóng:</span>
                                <div className="font-medium text-foreground">
                                  {product.team?.name} ({product.team?.league})
                                </div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Chất liệu:</span>
                                <div className="font-medium text-foreground">{product.material?.name}</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Mùa giải:</span>
                                <div className="font-medium text-foreground">{product.season}</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Loại áo:</span>
                                <div className="font-medium text-foreground">{product.jerseyType}</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Sản phẩm nổi bật:</span>
                                <div className="font-medium text-foreground">
                                  <Badge
                                    color={product.isFeatured ? "warning" : "default"}
                                    variant="flat"
                                    size="sm"
                                  >
                                    {product.isFeatured ? "Có" : "Không"}
                                  </Badge>
                                </div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Ngày tạo:</span>
                                <div className="font-medium text-foreground">
                                  {formatDate(product.createdAt)}
                                </div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Cập nhật lần cuối:</span>
                                <div className="font-medium text-foreground">
                                  {formatDate(product.updatedAt)}
                                </div>
                              </div>
                              <div className="col-span-2">
                                <span className="text-muted-foreground">Mô tả:</span>
                                <Button
                                  size="sm"
                                  variant="flat"
                                  color="primary"
                                  className="ml-2"
                                  onClick={() => setDescription(product)}
                                >
                                  Xem chi tiết
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* Biến thể và hình ảnh */}
                          <div className="space-y-4">
                            {/* Variants */}
                            <div>
                              <h4 className="font-semibold text-foreground mb-3">Biến thể sản phẩm</h4>
                              <div className="space-y-2">
                                {product.variants.map((variant: any) => (
                                  <div key={variant.id} className="bg-content1 p-3 rounded-lg border border-border">
                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                      <div>
                                        <span className="text-muted-foreground">Size:</span>
                                        <div className="font-medium text-foreground">{variant.size}</div>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Điều chỉnh giá:</span>
                                        <div className="font-medium text-foreground">
                                          <FormatPrice price={variant.priceAdjustment} />
                                        </div>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Tồn kho:</span>
                                        <div className="font-medium text-foreground">{variant.stockQuantity}</div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Images */}
                            <div>
                              <h4 className="font-semibold text-foreground mb-3">
                                Hình ảnh ({product.imageUrls.length})
                              </h4>
                              <div className="grid grid-cols-4 gap-2">
                                {product.imageUrls.map((url: string, index: number) => (
                                  <div
                                    key={index}
                                    className="aspect-square relative overflow-hidden rounded-lg border border-border"
                                  >
                                    <img
                                      src={url}
                                      alt={`${product.name} - ${index + 1}`}
                                      className="object-cover w-full h-full"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </React.Fragment>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <div className="mb-4">
                <Search className="w-12 h-12 mx-auto text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Không tìm thấy sản phẩm nào
              </h3>
              <p className="text-muted-foreground mb-4">
                Thử thay đổi từ khóa tìm kiếm hoặc thêm sản phẩm mới
              </p>
              <Button
                color="primary"
                onClick={() => setIsOpen(true)}
                startContent={<Plus className="w-4 h-4" />}
              >
                Thêm Sản Phẩm
              </Button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPage > 1 && (
          <div className="flex justify-center py-4 border-t border-border">
            <Pagination
              total={totalPage}
              initialPage={currentPage}
              onChange={onChangePage}
              showControls
            />
          </div>
        )}
      </div>

      {/* Description Modal */}
      {description && (
        <Modadescription
          onClose={() => setDescription(null)}
          description={description.description}
        />
      )}
    </div>
  );
}
