"use client"
import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '@nextui-org/react';

const categories = [
  { id: 1, name: "Áo Bóng Đá", icon: "👕", url: "/products/ao-bong-da" },
  { id: 2, name: "Quần Bóng Đá", icon: "👖", url: "/products/quan-bong-da" },
  { id: 3, name: "Giày Bóng Đá", icon: "⚽", url: "/products/giay-bong-da" },
  { id: 4, name: "Phụ Kiện", icon: "🧦", url: "/products/phu-kien" },
  { id: 5, name: "Áo Thủ Môn", icon: "🧤", url: "/products/ao-thu-mon" },
  { id: 6, name: "Đồ Tập Luyện", icon: "🎽", url: "/products/do-tap" },
  { id: 7, name: "Áo Đội Tuyển", icon: "🏆", url: "/products/ao-doi-tuyen" },
  { id: 8, name: "Áo Câu Lạc Bộ", icon: "⭐", url: "/products/ao-cau-lac-bo" }
];

export default function ChooseCategoryHeader() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if(search.trim() === "") return;
    router.push(`/products?search=${search}`);
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if(e.key === 'Enter') {
      handleSearch();
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-blue-500 mb-2">DANH MỤC SẢN PHẨM</h2>
        <div className="w-[3rem] mx-auto h-[2px] bg-blue-500"></div>
      </div>

      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg focus:border-transparent outline-none"
          />
          <button 
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-[10rem] h-[2.4rem] ${search.trim() === "" ? "bg-gray-500" : "bg-blue-500"} text-white rounded-lg hover:bg-blue-600 transition-colors`}
            onClick={handleSearch}
            disabled={search.trim() === ""}
          >
            Tìm kiếm
          </button>
        </div>
      </div>

      <p className="text-gray-600 mb-3 text-center">Chọn danh mục sản phẩm bạn quan tâm</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white border-dashed border-2 border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
            onClick={() => router.push(category.url)}
          >
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                <span className="text-2xl">{category.icon}</span>
              </div>
              <h3 className="font-medium text-gray-800 text-sm">{category.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}