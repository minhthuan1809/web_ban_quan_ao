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
  Home,
  Package,
  Tag,
  Newspaper,
  Phone
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import useAuthInfor from "@/app/customHooks/AuthInfor";
import { authGetUserInfo_API, authLogout_API } from "@/app/_service/authClient";
import { useUserStore } from "@/app/_zustand/client/InForUser";
import { deleteCookie, setCookie } from "cookies-next";

type User = {
  user: {
    avatar?: string | null;
    name?: string | null;
    email?: string | null;
  };
};

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navLinks = [
    { label: "Trang chủ", href: "/", icon: Home },
    { label: "Sản phẩm", href: "/products", icon: Package },
    { label: "Khuyến mãi", href: "/promotions", icon: Tag },
    { label: "Tin tức", href: "/news", icon: Newspaper },
    { label: "Liên hệ", href: "/contact", icon: Phone },
  ];
  const [user, setUser] = useState<any | null>();
  const Urlparams = usePathname();
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  // zustand
  const {setUser_Zustand} = useUserStore()
  // hook
  const { accessToken } = useAuthInfor() || { accessToken: null }; // Add null check
  const router = useRouter();
  

  useEffect(() => {
    if (!accessToken) {
      setUser(null);
      setUser_Zustand(null);
      deleteCookie("token");
      return;
    }

    authGetUserInfo_API(accessToken).then((res: any) => {
      if (res) {
        setUser(res);
        setCookie("token", JSON.stringify({"accessToken": accessToken, "userInfo": res}));
        //đẩy về admin nếu là admin
        if (res.role.name.trim().toLowerCase() === 'admin') {
          router.push("/admin");
        }
        else {
          router.push("/");
        }
        setUser_Zustand(res);
      }
      else {
        setUser(null);
        setUser_Zustand(null);
        deleteCookie("token");
        router.push("/login");
      }
    });
  }, [accessToken]);

  const handleLogout = () => {
    if (!accessToken) return;
    router.push("/login");
    deleteCookie("token");
    authLogout_API(accessToken).then((res: any) => {

    });
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 transition-shadow duration-300 hover:shapadow-xl">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-screen-xl">
        {/* Logo Section */}
        <Link href="/" className="flex items-center space-x-3 group">
          <Image
            className="rounded-full w-14 h-14 object-cover transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
            src="https://plus.unsplash.com/premium_photo-1687686676757-9d849a16e4ea?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGVyc2lvbnxlbnwwfHwwfHx8MA%3D%3D"
            alt="KICKSTYLE Logo"
            width={56}
            height={56}
          />
          <span className="text-2xl font-bold text-blue-800 group-hover:text-blue-600 transition-colors duration-300">
            KICKSTYLE
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
          
            

            {/* Icons */}
            <div className="flex items-center space-x-4">
              {/* Shopping Cart */}
              <Link href="/cart" className="relative group text-gray-600 hover:text-blue-600 transition-colors">
                <ShoppingCart size={24} />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  0
                </span>
              </Link>

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
                        {user?.avatarUrl ? (
                          <Image
                            src={user.avatarUrl}
                            alt={`${user.fullName}'s avatar`}
                            width={56}
                            height={56}
                            className="w-14 h-14 rounded-full border-2 border-blue-200 object-cover"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full border-2 border-blue-200 bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">
                            {user?.fullName?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-800 text-lg">
                            {user?.fullName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {user?.email}
                          </p>
                         
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
                  
                          className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-red-50 rounded-md transition-colors text-red-600"
                          onClick={handleLogout}
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
    {/* Mobile Menu Overlay */}
    {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 md:hidden">
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl animate-slideInRight">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b bg-blue-50">
                <div className="flex items-center space-x-3">
                  <Image
                    className="rounded-full w-10 h-10 object-cover shadow-md"
                    src="https://plus.unsplash.com/premium_photo-1687686676757-9d849a16e4ea?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGVyc2lvbnxlbnwwfHwwfHx8MA%3D%3D"
                    alt="KICKSTYLE"
                    width={40}
                    height={40}
                  />
                  <span className="text-lg font-bold text-blue-600">
                    KICKSTYLE
                  </span>
                </div>
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-lg hover:bg-white/50 transition-colors"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>

              {/* User Section */}
              <div className="p-6 border-b">
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      {user?.avatarUrl ? (
                        <Image
                          src={user.avatarUrl}
                          alt={`${user.fullName}'s avatar`}
                          width={56}
                          height={56}
                          className="w-14 h-14 rounded-full border-2 border-blue-200 object-cover shadow-lg"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                          {user?.fullName?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-800 text-lg">{user?.fullName}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        href="/profile"
                        onClick={toggleMobileMenu}
                        className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl transition-colors hover:bg-blue-100"
                      >
                        <Settings size={18} />
                        <span className="font-medium">Cài đặt</span>
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          toggleMobileMenu();
                        }}
                        className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl transition-colors hover:bg-red-100"
                      >
                        <LogOut size={18} />
                        <span className="font-medium">Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      href="/login"
                      onClick={toggleMobileMenu}
                      className="block w-full py-3 text-center bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 font-medium shadow-lg"
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      href="/register"
                      onClick={toggleMobileMenu}
                      className="block w-full py-3 text-center border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors font-medium"
                    >
                      Đăng ký mới
                    </Link>
                  </div>
                )}
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <nav className="space-y-2">
                  {navLinks.map((link) => {
                    const isActive = Urlparams === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={toggleMobileMenu}
                        className={`flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-300 ${
                          isActive
                            ? "bg-blue-50 text-blue-600 border-l-4 border-blue-500"
                            : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                        }`}
                      >
                        <link.icon 
                          size={22} 
                          className={`${isActive ? "text-blue-600" : "text-gray-500"} transition-colors`} 
                        />
                        <span className="font-medium text-lg">{link.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
