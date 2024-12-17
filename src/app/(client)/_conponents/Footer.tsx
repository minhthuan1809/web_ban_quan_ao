import React from "react";
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";
import Image from "next/image";

export default function PageFooter() {
  return (
    <footer className="bg-gradient-to-br from-gray-100 to-gray-200 py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand Section */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-4 mb-6">
              <Image 
                src="https://plus.unsplash.com/premium_photo-1687686676757-9d849a16e4ea?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGVyc2lvbnxlbnwwfHwwfHx8MA%3D%3D" 
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg" 
                alt="MINHTHUAN Logo" 
                height={80}
                width={80}
              />
              <div>
                <p className="text-3xl font-extrabold text-gray-800 tracking-wider">MINHTHUAN</p>
                <p className="text-sm text-gray-500 italic">Fashion & Style</p>
              </div>
            </div>
            <div className="flex space-x-6 mt-4">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-gray-600 hover:text-pink-600 transition-colors duration-300">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-800 transition-colors duration-300">
                <Linkedin size={24} />
              </a>
            </div>
          </div>

          {/* About Us Section */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800 mb-5 border-b-2 border-gray-300 pb-2">VỀ CHÚNG TÔI</h2>
            <p className="text-gray-600 leading-relaxed text-justify">
              &ldquo;MINHTHUAN&rdquo; là cửa hàng thời trang chuyên nghiệp, cam kết mang đến những sản phẩm chất lượng cao và dịch vụ xuất sắc. Chúng tôi tin rằng thời trang không chỉ là quần áo, mà còn là cách thể hiện cá tính riêng của mỗi người.
            </p>
          </div>

          {/* Contact Section */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800 mb-5 border-b-2 border-gray-300 pb-2">LIÊN HỆ</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-center md:justify-start space-x-3">
                <MapPin className="text-red-500" size={24} />
                <p className="text-gray-600">123 Đường Trần Phú, Quận 1, TP.HCM</p>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-3">
                <Mail className="text-blue-500" size={24} />
                <p className="text-gray-600">minhthuan@gmail.com</p>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-3">
                <Phone className="text-green-500" size={24} />
                <p className="text-gray-600">0987654321</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-300 mt-12 pt-6">
          <div className="container mx-auto text-center text-gray-600">
            <p className="text-sm">
              &copy; 2024 MINHTHUAN. Bản quyền được bảo lưu. 
              <span className="ml-4 text-gray-400">Thiết kế bởi MINHTHUAN Team</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}