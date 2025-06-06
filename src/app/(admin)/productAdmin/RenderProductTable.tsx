import React, { useState } from 'react';
import { Eye, Trash2, Search, Plus, Edit, ChevronDown, ChevronRight, Filter, X } from 'lucide-react';
import Loading from '@/app/_util/Loading';
import FormatPrice from '@/app/_util/FormatPrice';
import RenderTextEditer from '@/app/_util/ui/RenderTextEditer';
import { Pagination } from '@nextui-org/react';
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Hiển thị {products.length} sản phẩm
            </span>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium text-gray-700">
            <div className="col-span-0.5"></div>
            <div className="col-span-4">Tên Sản Phẩm</div>
            <div className="col-span-2 text-center">Giá</div>
            <div className="col-span-2 text-center">Số Lượng</div>
            <div className="col-span-2 text-center">Trạng Thái</div>
            <div className="col-span-1 text-center">Hành Động</div>
          </div>
        </div>

        {/* Product Rows */}
        <div className="divide-y divide-gray-100">
          {loading ? (
            <Loading />
          ) : products.length > 0 ? (
            products.map((product: any, index: number) => (
              <React.Fragment key={index}>
                {/* Main Row */}
                <div className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors">
                  {/* Expand Button */}
                  <div className="col-span-0.5 flex items-center">
                    <button
                      onClick={() => toggleRowExpansion(product.id)}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {expandedRows.has(product.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-16 h-16 relative flex-shrink-0 overflow-hidden rounded-lg border border-gray-200">
                      <img
                        src={product.imageUrls[0]}
                        alt={product.name}
                        className="object-cover rounded-lg w-full h-full"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                          {product?.category?.name}
                        </span>
                        <span className="text-xs text-gray-500">Mã: {product.code}</span>
                      </div>
                      <h3 className="font-bold p-2 text-gray-900 mb-1 truncate">
                        {product?.name}
                      </h3>
                   
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-2 flex items-center justify-center">
                    <div className="text-center">
                      {product?.salePrice ? (
                        <div>
                          <div className="line-through text-gray-400 text-sm">
                            {product.price.toLocaleString()} đ
                          </div>
                          <div className="text-red-600 font-semibold">
                            <FormatPrice
                              price={DiscountPrice(product.price, product.salePrice)}
                              className="text-red-600 font-semibold"
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="font-semibold text-gray-900">
                          {product.price.toLocaleString()} đ
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="col-span-2 flex items-center justify-center">
                    <span className="font-medium text-gray-900">
                      {product.variants.reduce((total: number, variant: any) => total + variant.stockQuantity, 0)}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-2 flex items-center justify-center">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${product.isDeleted
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${product.isDeleted ? 'bg-red-400' : 'bg-green-400'
                        }`}></span>
                      {product.isDeleted ? "Ngừng bán" : "Hoạt động"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex items-center justify-center">
                    <div className="flex gap-1">
                      <div className="relative group">
                        <button className="w-8 h-8 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" onClick={() => {
                          setIsOpen(true)
                          setEdit(product)
                        }}>
                          <Edit className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                          Chỉnh sửa
                        </div>
                      </div>
                      <div className="relative group">
                        <button
                          onClick={() => handleDeleteProduct(product)}
                          className="w-8 h-8 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                          Xóa
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedRows.has(product.id) && (
                  <div className="bg-gray-50 border-t border-gray-200">
                    <div className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Thông tin chi tiết */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-900 mb-3">Thông tin chi tiết</h4>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                          
                            <div>
                              <span className="text-gray-600">Slug:</span>
                              <div className="font-medium text-gray-900">{product.slug}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Đội bóng:</span>
                              <div className="font-medium text-gray-900">{product.team?.name} ({product.team?.league})</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Chất liệu:</span>
                              <div className="font-medium text-gray-900">{product.material?.name}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Mùa giải:</span>
                              <div className="font-medium text-gray-900">{product.season}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Loại áo:</span>
                              <div className="font-medium text-gray-900">{product.jerseyType}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Sản phẩm nổi bật:</span>
                              <div className="font-medium text-gray-900">
                                {product.isFeatured ? (
                                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                    Có
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                                    Không
                                  </span>
                                )}
                              </div>
                            </div>
                            <div >
                              <p className="text-gray-600">Mô tả:</p>
                              <button className="text-blue-600 hover:text-blue-800 hover:underline" onClick={() => setDescription(product.description)}>Xem chi tiết</button>
                            </div>
                            <div>
                              <span className="text-gray-600">Ngày tạo:</span>
                              <div className="font-medium text-gray-900">{formatDate(product.createdAt)}</div>
                            </div>
                          </div>
                        </div>

                        {/* Biến thể và hình ảnh */}
                        <div className="space-y-4">
                          {/* Variants */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Biến thể sản phẩm</h4>
                            <div className="space-y-2">
                              {product.variants.map((variant: any) => (
                                <div key={variant.id} className="bg-white p-3 rounded-lg border border-gray-200">
                                  <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                      <span className="text-gray-600">Size:</span>
                                      <div className="font-medium text-gray-900">{variant.size}</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Điều chỉnh giá:</span>
                                      <div className="font-medium text-gray-900">
                                        <FormatPrice
                                          price={variant.priceAdjustment}
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Tồn kho:</span>
                                      <div className="font-medium text-gray-900">{variant.stockQuantity}</div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Images */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Hình ảnh ({product.imageUrls.length})</h4>
                            <div className="grid grid-cols-4 gap-2">
                              {product.imageUrls.map((url: string, index: number) => (
                                <div key={index} className="aspect-square relative overflow-hidden rounded-lg border border-gray-200">
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
              </React.Fragment>
            ))
          ) : (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Search className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không tìm thấy sản phẩm nào
              </h3>
              <p className="text-gray-600 mb-4">
                Thử thay đổi từ khóa tìm kiếm hoặc thêm sản phẩm mới
              </p>
              <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Thêm Sản Phẩm
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Modal mô tả sản phẩm */}
      <Modadescription description={description} onClose={() => setDescription(null)} />
      {/* Pagination */}
       <div className="flex justify-center mt-4">
        {totalPage > 1 && (
          <Pagination
            total={totalPage}
            page={currentPage}
            onChange={onChangePage}
            showControls
            variant="bordered"
            classNames={{
            wrapper: "gap-2",
            item: "w-8 h-8 text-sm rounded-lg",
            cursor: "bg-blue-500 text-white font-bold",
            }}
          />
        )}
      </div>
    </div>
  );
}
