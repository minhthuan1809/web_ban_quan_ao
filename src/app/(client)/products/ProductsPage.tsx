"use client"
import React, { useEffect, useState } from 'react';
import { Filter, Grid, List, Search } from 'lucide-react';
import { getProducts_API } from '@/app/_service/products';
import Loading from '@/app/_util/Loading';
import { Input } from '@nextui-org/react';
import CardProduct from '@/app/(admin)/_conponents/CardProduct';

export default function ProductsPage({filter} : {filter: any}) {
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(16);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Ensure filter has default values if undefined
        const defaultFilter = {
          categories: [],
          sizes: [],
          priceRange: [0, 5000000]
        };
        
        const currentFilter = {
          ...defaultFilter,
          ...filter
        };

        const res = await getProducts_API(searchTerm, page, limit, currentFilter);
        console.log(res);
        
        if (res.status === 200) {
          setProducts(res.data.data);
          setTotal(res.data.metadata.total_page);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(timeout);
  }, [page, limit, filter, searchTerm]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen ">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
         <div>
         <Input
              placeholder="Tìm kiếm sản phẩm"
              size="sm"
              variant="bordered"
              radius="sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startContent={<Search size={16} />}
              className="w-full sm:w-auto"
            />
         </div>
            {/* Right side - Sort options */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 hidden sm:inline">Sắp xếp</span>
              <select 
                className="px-2 sm:px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer shadow-sm w-full sm:w-auto"
                // value={sort}
                // onChange={(e) => setSort(e.target.value)}
              >
                <option value="name">Phổ biến</option>
                <option value="createdAt">Mới nhất</option>
                <option value="price">Giá thấp → cao</option>
                <option value="-price">Giá cao → thấp</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Results info */}
        <div className="mb-4 sm:mb-6">
          <p className="text-sm text-gray-600">
            Hiển thị <span className="font-semibold">{products.length}</span> sản phẩm
          </p>
        </div>

        {/* Compact Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
          {products.map((product: any) => (
            <CardProduct key={product.id} product={product} />
          ))}
        </div>

 
      </div>
    </div>
  );
}