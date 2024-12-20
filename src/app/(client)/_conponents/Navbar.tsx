"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
  LogOut,
  Settings,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Image from "next/image";

type User = {
  picture?: string | null;
  name?: string | null;
  email?: string | null;
};

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navLinks = [
    { label: "Trang chủ", href: "/" },
    { label: "Sản phẩm", href: "/products" },
    { label: "Khuyến mãi", href: "/promotions" },
    { label: "Tin tức", href: "/news" },
    { label: "Liên hệ", href: "/contact" },
  ];
  const [user, setUser] = useState<User | null>();
  const Urlparams = usePathname();
  const { data: session, status } = useSession();
  console.log("session", session);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    if (status === "authenticated" && session) {
      setUser(session as User);
    } else {
      setUser(null);
    }
  }, [session, status]);

  if (status === "loading") {
    return (
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="animate-pulse h-14 bg-gray-200 rounded"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 transition-shadow duration-300 hover:shadow-xl">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-screen-xl">
        {/* Logo Section */}
        <Link href="/" className="flex items-center space-x-3 group">
          <Image
            className="rounded-full w-14 h-14 object-cover transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
            src="https://plus.unsplash.com/premium_photo-1687686676757-9d849a16e4ea?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGVyc2lvbnxlbnwwfHwwfHx8MA%3D%3D"
            alt="MINHTHUAN Logo"
            width={56}
            height={56}
          />
          <span className="text-2xl font-bold text-blue-800 group-hover:text-blue-600 transition-colors duration-300">
            MINHTHUAN
          </span>
        </Link>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-blue-600 hover:text-blue-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-full p-1"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {/* Navigation Links */}
          <ul className="flex items-center space-x-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-gray-700 font-medium hover:text-blue-600 transition-colors relative group`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-[-4px] left-0 h-0.5 bg-blue-600 transition-all duration-300 ${
                      Urlparams === link.href
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              </li>
            ))}
          </ul>

          {/* Search and Icons */}
          <div className="flex items-center space-x-4">
            {/* Search Input */}
            <div className="relative group">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="pl-10 pr-4 py-2 w-64 border border-blue-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300 group-hover:shadow-md"
              />
              <Search
                size={20}
                className="absolute left-3 top-3 text-blue-400 group-hover:text-blue-600 transition-colors"
              />
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              {/* Shopping Cart */}
              <button className="relative group text-gray-600 hover:text-blue-600 transition-colors">
                <ShoppingCart size={24} />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  0
                </span>
              </button>

              {/* User/Auth Button */}
              <div className="relative group">
                <button className="text-gray-600 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-full p-1">
                  <User size={24} />
                </button>

                {/* Auth Dropdown */}
                <div
                  className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-blue-100 overflow-hidden z-50 
                  opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                >
                  {user ? (
                    <div className="p-4">
                      {/* User Profile Section */}
                      <div className="flex items-center space-x-4 border-b pb-3 mb-2">
                        <Image
                          src={user.picture || "/default-avatar.png"}
                          alt={`${user.name}'s avatar`}
                          width={56}
                          height={56}
                          className="w-14 h-14 rounded-full border-2 border-blue-200 object-cover"
                        />
                        <div>
                          <p className="font-semibold text-gray-800 text-lg">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>

                      {/* User Actions */}
                      <div className="space-y-2">
                        <Link
                          href="/profile"
                          className="flex items-center space-x-3 px-3 py-2 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <Settings size={20} className="text-blue-600" />
                          <span>Cài đặt tài khoản</span>
                        </Link>
                        <button
                          onClick={() => signOut()}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-red-50 rounded-md transition-colors text-red-600"
                        >
                          <LogOut size={20} />
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2">
                      <Link
                        href="/login"
                        className="block px-4 py-2 hover:bg-blue-50 rounded-md transition-colors text-blue-600"
                      >
                        Đăng nhập
                      </Link>
                      <Link
                        href="/register"
                        className="block px-4 py-2 hover:bg-blue-50 rounded-md transition-colors text-blue-600"
                      >
                        Đăng ký
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white/95 z-50 md:hidden animate-slideIn overflow-y-auto">
          <div className="container mx-auto px-4 py-6 max-w-md">
            {/* Mobile Menu Header */}
            <div className="flex justify-between items-center mb-8">
              <Link href="/" className="flex items-center space-x-3">
                <Image
                  className="rounded-full w-14 h-14 object-cover"
                  src="https://plus.unsplash.com/premium_photo-1687686676757-9d849a16e4ea?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGVyc2lvbnxlbnwwfHwwfHx8MA%3D%3D"
                  alt="MINHTHUAN Logo"
                  width={56}
                  height={56}
                />
                <span className="text-2xl font-bold text-blue-800">
                  MINHTHUAN
                </span>
              </Link>
              <button
                onClick={toggleMobileMenu}
                className="text-blue-600 hover:text-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-full p-1"
              >
                <X size={28} />
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={toggleMobileMenu}
                    className={`block py-3 text-lg text-center rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                      Urlparams === link.href
                        ? "bg-blue-100 text-blue-600 font-semibold"
                        : "text-gray-700 hover:bg-blue-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mobile Search and Icons */}
            <div className="mt-8 space-y-6">
              {/* Mobile Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="w-full pl-10 pr-4 py-3 border border-blue-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                />
                <Search
                  size={20}
                  className="absolute left-3 top-4 text-blue-400"
                />
              </div>

              {/* Mobile Icons */}
              <div className="flex justify-center space-x-8">
                <button className="text-gray-600 hover:text-blue-600 relative group transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-full p-2">
                  <ShoppingCart size={28} />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    0
                  </span>
                </button>
                <button className="text-gray-600 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-full p-2">
                  <User size={28} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
