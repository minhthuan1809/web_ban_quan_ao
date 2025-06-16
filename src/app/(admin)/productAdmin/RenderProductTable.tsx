'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Trash2, Search, Plus, Edit, ChevronDown, ChevronRight, Filter, X, Pencil, Edit3 } from 'lucide-react';
import Loading from '@/app/_util/Loading';
import FormatPrice from '@/app/_util/FormatPrice';
import RenderTextEditer from '@/app/_util/ui/RenderTextEditer';
import { Pagination, Input, Button, Badge } from '@nextui-org/react';
import Modadescription from '../_modal/Modadescription';
import { DiscountPrice } from '@/app/_util/DiscountPrice';
import showConfirmDialog from '@/app/_util/Sweetalert2';

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

  console.log("products", products);
  

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
      <div className="mx-auto px-6 py-6">
        <div className="bg-card rounded-lg shadow-sm border border-border p-4 mb-6">
          <Loading />
        </div>
      </div>
    );
  }

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
                          <div className="text-danger font-semibold">
                            <FormatPrice
                              price={DiscountPrice(product.price || 0, product.salePrice || 0)}
                              className="text-danger font-semibold"
                            />
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
                          <div className="space-y-6">
                            {/* Variants */}
                            <div>
                              <h4 className="font-semibold text-foreground mb-3">Kích thước và màu sắc của sản phẩm</h4>
                              {product.variants && product.variants.length > 0 ? (
                                <div className="border border-border rounded-lg overflow-hidden">
                                  <div className="grid grid-cols-5 bg-muted p-2 text-xs font-medium text-foreground">
                                    <div>Kích cỡ</div>
                                    <div>Màu sắc</div>
                                    <div>Giá điều chỉnh</div>
                                    <div className="text-center">Số lượng</div>
                                    <div className="text-center">Trạng thái</div>
                                  </div>
                                  <div className="divide-y divide-border">
                                    {product.variants.map((variant: any, idx: number) => (
                                      <div key={idx} className="grid grid-cols-5 p-2 text-sm">
                                        <div>{typeof variant.size === 'object' ? variant.size.name : variant.size || variant.sizeId || ''}</div>
                                        <div className="flex items-center gap-2">
                                          {variant.color && (
                                            <>
                                              {typeof variant.color === 'object' ? (
                                                <>
                                                  <div 
                                                    className="w-4 h-4 rounded-full" 
                                                    style={{ backgroundColor: variant.color.hexColor || '#ccc' }}
                                                  ></div>
                                                  <span>{variant.color.name}</span>
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
                                        <div className="text-center">{variant.stockQuantity || 0}</div>
                                        <div className="text-center">
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

                            {/* Description Button */}
                            <div>
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
      {!loading && products.length > 0 && (
        <div className="flex justify-center mt-6">
          <Pagination
            isCompact
            showControls
            total={totalPage}
            initialPage={currentPage}
            onChange={(page) => onChangePage(page)}
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
