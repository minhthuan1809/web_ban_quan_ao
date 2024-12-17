"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ShoppingCart, User, Search, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navLinks = [
    { label: "Trang chủ", href: "/" },
    { label: "Tất cả sản phẩm", href: "/products" },
    { label: "Khuyến mãi", href: "/promotions" },
    { label: "Tin tức", href: "/news" },
    { label: "Liên hệ", href: "/contact" },
  ];
  const Urlparams = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const handleLogin = () => {
    console.log("login");

    return (
      <>
        <button className="absolute top-0 right-0">
          <div>
            <ul>
              <li>
                <button>
                  <User size={24} />
                  <Link href="/login">Đăng nhập</Link>
                </button>
              </li>
              <li>
                <Link href="/register">Đăng ký</Link>
              </li>
            </ul>
          </div>
        </button>
      </>
    );
  };
  return (
    <nav className="bg-white shadow-md relative">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center space-x-3">
          <img
            className="rounded-full w-16 h-16 object-cover"
            src="/logo.png"
            alt="MINHTHUAN Logo"
          />
          <span className="text-2xl font-bold text-gray-800 transition-colors">
            MINHTHUAN
          </span>
        </Link>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Navigation Links - Desktop */}
        <ul className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-gray-700 
                hover:text-blue-600 transition-colors ${
                  Urlparams === link.href ? "text-blue-600" : ""
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Icons and Search - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="pl-10 pr-4 py-2 border rounded-full 
              focus:outline-none focus:ring-2 focus:ring-blue-500 
              focus:border-transparent transition-all w-64"
            />
            <Search size={20} className="absolute left-3 top-3 text-gray-400" />
          </div>
          <div className="flex space-x-4">
            <button className="text-gray-600 hover:text-blue-600 transition-colors">
              <ShoppingCart size={24} />
            </button>
            <button className="text-gray-600 hover:text-blue-600 transition-colors">
              <User size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Slide-in Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white md:hidden">
          <div className="container mx-auto px-4 py-6">
            {/* Mobile Menu Header */}
            <div className="flex justify-between items-center mb-6">
              <Link href="/" className="flex items-center space-x-3">
                <img
                  className="rounded-full w-12 h-12 object-cover"
                  src="/logo.png"
                  alt="MINHTHUAN Logo"
                />
                <span className="text-xl font-bold text-gray-800">
                  MINHTHUAN
                </span>
              </Link>
              <button
                onClick={toggleMobileMenu}
                className="text-gray-600 hover:text-blue-600"
              >
                <X size={24} />
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={toggleMobileMenu}
                    className={`block py-3 text-lg text-center 
                    text-gray-700 hover:bg-blue-50 
                    hover:text-blue-600 transition-colors ${
                      Urlparams === link.href ? "text-blue-600" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex justify-between">
              {" "}
              <div className="mt-6 relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="w-full pl-10 pr-4 py-3 border rounded-full 
                focus:outline-none focus:ring-2 focus:ring-blue-500 
                focus:border-transparent transition-all"
                />
                <Search
                  size={20}
                  className="absolute left-3 top-4 text-gray-400"
                />
              </div>
              <div className="flex justify-center space-x-6 mt-6">
                <button className="text-gray-600 hover:text-blue-600 transition-colors">
                  <ShoppingCart size={28} />
                </button>
                <button className="text-gray-600 hover:text-blue-600 transition-colors">
                  <User size={28} onClick={handleLogin} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
