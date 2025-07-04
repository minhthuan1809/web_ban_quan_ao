'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Trash2, Search, Plus, Edit, ChevronDown, ChevronRight, Filter, X, Pencil, Edit3 } from 'lucide-react';
import Loading from '@/app/_util/Loading';
import FormatPrice from '@/app/_util/FormatPrice';
import RenderTextEditer from '@/app/_util/ui/RenderTextEditer';
import { Pagination, Input, Button, Badge, Chip } from '@nextui-org/react';
import Modadescription from '../_modal/Modadescription';
import showConfirmDialog from '@/app/_util/Sweetalert2';
import { calculateDiscountedPrice } from '@/app/_util/CalculateCartPrice';

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  

  

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
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleDateString('vi-VN');
  };

  // Function to safely get a property from an object or return a default value
  const getSafeProperty = (obj: any, property: string, defaultValue: string = ''): string => {
    if (!obj) return defaultValue;
    return typeof obj[property] === 'string' ? obj[property] : defaultValue;
  };

  if (!mounted) {
    return (
      <div className="mx-auto px-2 sm:px-6 py-4 sm:py-6">
        <div className="bg-card rounded-lg shadow-sm border border-border p-4 mb-6">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-2 sm:px-6 py-4 sm:py-6">
     

      {/* Products Table */}
      <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
        {/* Table Header - Hidden on mobile */}
        <div className="bg-muted border-b border-border hidden sm:block">
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
                <div className="p-3 sm:p-4 hover:bg-muted/50 transition-colors">
                  {/* Desktop View */}
                  <div className="hidden sm:grid sm:grid-cols-12 sm:gap-4">
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
                        {product.imageUrls && product.imageUrls.length > 0 && (
                          <img
                            src={product.imageUrls[0]}
                            alt={product.name || "Product Image"}
                            className="object-cover rounded-lg w-full h-full"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="flat" color="primary" size="sm">
                            {product?.category ? (
                              typeof product.category === 'object'
                                ? getSafeProperty(product.category, 'name', 'Không có danh mục')
                                : product.category
                            ) : 'Không có danh mục'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">Mã: {product.code || ''}</span>
                        </div>
                        <h3 className="font-bold p-2 text-foreground mb-1 truncate">
                          {product?.name || "Không có tên"}
                        </h3>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="col-span-2 flex items-center justify-center">
                      <div className="text-center">
                        {product?.salePrice ? (
                          <div>
                            <div className="line-through text-muted-foreground text-sm">
                              {(product.price || 0).toLocaleString()} đ
                            </div>
                            <div className="text-danger font-semibold flex flex-col">
                              <FormatPrice
                                price={calculateDiscountedPrice(product.price, product.salePrice)}
                                className="text-danger font-semibold"
                              />
                              <span className="text-xs bg-danger/10 text-danger px-2 py-0.5 rounded-full mt-1">
                                Giảm {product.salePrice}%
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="font-semibold text-foreground">
                            {(product.price || 0).toLocaleString()} đ
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="col-span-2 flex items-center justify-center">
                      <span className="font-medium text-foreground">
                        {product.variants ? product.variants.reduce((total: number, variant: any) => total + (variant.stockQuantity || 0), 0) : 0}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="col-span-2 flex items-center justify-center   ">
                      <Chip
                        color={product.status === "ACTIVE" ? "success" : "danger"}
                        variant="solid"
                        size="sm"
                        radius="sm"
                        className="text-xs text-white"
                      >
                        {product.status === "ACTIVE" ? "Hoạt động" : "Ngừng bán"}
                      </Chip>
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 flex items-center justify-center">
                      <div className="flex gap-1">
                        <Button
                          className="bg-blue-500 text-white rounded-md min-w-10 h-10 flex items-center justify-center"
                          isIconOnly
                          size="sm"
                          onClick={() => {
                            setIsOpen(true)
                            setEdit(product)
                          }}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          className="bg-red-500 text-white rounded-md min-w-10 h-10 flex items-center justify-center"
                          isIconOnly
                          size="sm"
                          onClick={async () => {
                            const result = await showConfirmDialog({
                              title: 'Xác nhận xóa?',
                              text: `Bạn có chắc chắn muốn xóa sản phẩm "${product.name}"?`,
                              icon: 'warning',
                              showCancelButton: true,
                              confirmButtonText: 'Xóa',
                              cancelButtonText: 'Hủy'
                            });
                            
                            if (result.isConfirmed) {
                              handleDeleteProduct(product);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Mobile View */}
                  <div className="sm:hidden">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-20 h-20 relative flex-shrink-0 overflow-hidden rounded-lg border border-border">
                          {product.imageUrls && product.imageUrls.length > 0 && (
                            <img
                              src={product.imageUrls[0]}
                              alt={product.name || "Product Image"}
                              className="object-cover rounded-lg w-full h-full"
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <Badge variant="flat" color="primary" size="sm">
                              {product?.category ? (
                                typeof product.category === 'object'
                                  ? getSafeProperty(product.category, 'name', 'Không có danh mục')
                                  : product.category
                              ) : 'Không có danh mục'}
                            </Badge>
                            <span className="text-xs text-muted-foreground">Mã: {product.code || ''}</span>
                          </div>
                          <h3 className="font-bold text-foreground mb-1">
                            {product?.name || "Không có tên"}
                          </h3>
                          <div className="flex items-center gap-3 mt-1">
                            <div>
                              {product?.salePrice ? (
                                <div>
                                  <div className="line-through text-muted-foreground text-xs">
                                    {(product.price || 0).toLocaleString()} đ
                                  </div>
                                  <div className="text-danger font-semibold text-sm">
                                    
                                    <FormatPrice
                                      price={calculateDiscountedPrice(product.price, product.salePrice)}
                                      className="text-danger font-semibold"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <span className="font-semibold text-foreground text-sm">
                                  {(product.price || 0).toLocaleString()} đ
                                </span>
                              )}
                            </div>
                            <div className="text-xs">
                              <span className="text-muted-foreground">SL: </span>
                              <span className="font-medium">
                                {product.variants ? product.variants.reduce((total: number, variant: any) => total + (variant.stockQuantity || 0), 0) : 0}
                              </span>
                            </div>
                            <Badge
                              color={product.isDeleted ? "danger" : "success"}
                              variant="flat"
                              size="sm"
                            >
                              {product.isDeleted ? "Ngừng bán" : "Hoạt động"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          className="bg-blue-500 text-white rounded-md min-w-8 h-8 flex items-center justify-center"
                          isIconOnly
                          size="sm"
                          onClick={() => {
                            setIsOpen(true)
                            setEdit(product)
                          }}
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        <Button
                          className="bg-red-500 text-white rounded-md min-w-8 h-8 flex items-center justify-center"
                          isIconOnly
                          size="sm"
                          onClick={async () => {
                            const result = await showConfirmDialog({
                              title: 'Xác nhận xóa?',
                              text: `Bạn có chắc chắn muốn xóa sản phẩm "${product.name}"?`,
                              icon: 'warning',
                              showCancelButton: true,
                              confirmButtonText: 'Xóa',
                              cancelButtonText: 'Hủy'
                            });
                            
                            if (result.isConfirmed) {
                              handleDeleteProduct(product);
                            }
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <Button
                        variant="light"
                        size="sm"
                        onClick={() => toggleRowExpansion(product.id)}
                        className="text-xs flex items-center gap-1"
                      >
                        {expandedRows.has(product.id) ? (
                          <>
                            <ChevronDown className="w-3 h-3" />
                            Ẩn chi tiết
                          </>
                        ) : (
                          <>
                            <ChevronRight className="w-3 h-3" />
                            Xem chi tiết
                          </>
                        )}
                      </Button>
                      <Button
                        variant="flat"
                        color="primary"
                        size="sm"
                        onClick={() => setDescription(product)}
                        className="text-xs"
                      >
                        Xem mô tả
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Row */}
                  {expandedRows.has(product.id) && (
                    <div className="mt-3 px-2 sm:px-4 pb-2 sm:pb-4">
                      <div className="bg-card rounded-lg border border-border p-3 sm:p-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                          {/* Thông tin chi tiết */}
                          <div className="space-y-3 sm:space-y-4">
                            <h4 className="font-semibold text-foreground mb-2 sm:mb-3">Thông tin chi tiết</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Slug:</span>
                                <div className="font-medium text-foreground">{product.slug || ''}</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Đội bóng:</span>
                                <div className="font-medium text-foreground">
                                  {product.team ? (
                                    typeof product.team === 'object' 
                                      ? `${getSafeProperty(product.team, 'name')} (${getSafeProperty(product.team, 'league')})`
                                      : product.team
                                  ) : 'Không có'}
                                </div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Chất liệu:</span>
                                <div className="font-medium text-foreground">
                                  {product.material ? (
                                    typeof product.material === 'object'
                                      ? getSafeProperty(product.material, 'name', 'Không có')
                                      : product.material
                                  ) : 'Không có'}
                                </div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Mùa giải:</span>
                                <div className="font-medium text-foreground">{product.season || ''}</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Loại áo:</span>
                                <div className="font-medium text-foreground">{product.jerseyType || ''}</div>
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
                            </div>
                          </div>

                          {/* Biến thể và Mô tả */}
                          <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-0">
                            {/* Variants */}
                            <div>
                              <h4 className="font-semibold text-foreground mb-2 sm:mb-3">Kích thước và màu sắc của sản phẩm</h4>
                              {product.variants && product.variants.length > 0 ? (
                                <div className="border border-border rounded-lg overflow-hidden">
                                  <div className="grid grid-cols-3 sm:grid-cols-5 bg-muted p-2 text-xs font-medium text-foreground">
                                    <div>Kích cỡ</div>
                                    <div>Màu sắc</div>
                                    <div>Giá điều chỉnh</div>
                                    <div className="hidden sm:block text-center">Số lượng</div>
                                    <div className="hidden sm:block text-center">Trạng thái</div>
                                  </div>
                                  <div className="divide-y divide-border">
                                    {product.variants.map((variant: any, idx: number) => (
                                      <div key={idx} className="grid grid-cols-3 sm:grid-cols-5 p-2 text-xs sm:text-sm">
                                        <div>{typeof variant.size === 'object' ? variant.size.name : variant.size || variant.sizeId || ''}</div>
                                        <div className="flex items-center gap-1 sm:gap-2">
                                          {variant.color && (
                                            <>
                                              {typeof variant.color === 'object' ? (
                                                <>
                                                  <div 
                                                    className="w-3 h-3 sm:w-4 sm:h-4 rounded-full" 
                                                    style={{ backgroundColor: variant.color.hexColor || '#ccc' }}
                                                  ></div>
                                                  <span className="truncate">{variant.color.name}</span>
                                                </>
                                              ) : (
                                                <span>{variant.color}</span>
                                              )}
                                            </>
                                          )}
                                        </div>
                                        <div>
                                          <FormatPrice price={variant.priceAdjustment || 0} />
                                        </div>
                                        <div className="hidden sm:block text-center">{variant.stockQuantity || 0}</div>
                                        <div className="hidden sm:block text-center">
                                          <Badge
                                            color={variant.isDeleted ? "danger" : "success"}
                                            variant="flat"
                                            size="sm"
                                          >
                                            {variant.isDeleted ? "Ngừng bán" : "Còn hàng"}
                                          </Badge>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <p className="text-muted-foreground text-sm">Chưa có biến thể</p>
                              )}
                            </div>

                            {/* Description Button - Only visible on desktop since mobile has it above */}
                            <div className="hidden sm:block">
                              <h4 className="font-semibold text-foreground mb-3">Mô tả sản phẩm</h4>
                              <Button
                                variant="flat"
                                color="primary"
                                size="sm"
                                onClick={() => setDescription(product)}
                              >
                                Xem mô tả
                              </Button>
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
            <div className="p-8 text-center text-muted-foreground">
              Không tìm thấy sản phẩm nào
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {!loading && totalPage > 1 && (
        <div className="flex justify-center mt-4 sm:mt-6">
          <Pagination
            isCompact
            total={totalPage}
            initialPage={currentPage + 1}
            onChange={(page) => onChangePage(page - 1)}
            classNames={{
              wrapper: "gap-0 sm:gap-2",
              item: "w-8 h-8 sm:w-10 sm:h-10",
              cursor: "w-8 h-8 sm:w-10 sm:h-10"
            }}
          />
        </div>
      )}

      {/* Description Modal */}
      {description && (
        <Modadescription
          onClose={() => setDescription(null)}
          description={typeof description === 'object' ? description.description || '' : description || ''}
        />
      )}
    </div>
  );
}
