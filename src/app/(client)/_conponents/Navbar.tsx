"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  Settings,
  Home,
  Package,
  Tag,
  Phone,
  History
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import useAuthInfor from "@/app/customHooks/AuthInfor";
import { authGetUserInfo_API, authLogout_API } from "@/app/_service/authClient";
import { useUserStore } from "@/app/_zustand/client/InForUser";
import { useCartStore } from "@/app/_zustand/client/CartStore";
import { deleteCookie, setCookie } from "cookies-next";
import ThemeToggle from "@/app/components/ThemeToggle";
import { Button, Avatar } from "@nextui-org/react";

type User = {
  user: {
    avatar?: string | null;
    name?: string | null;
    email?: string | null;
  };
};

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  
  const navLinks = [
    { label: "Trang chủ", href: "/", icon: Home },
    { label: "Sản phẩm", href: "/products", icon: Package },
    { label: "Khuyến mãi", href: "/promotions", icon: Tag },
    { label: "Liên hệ", href: "/contact", icon: Phone },
  ];
  
  const [user, setUser] = useState<any | null>();
  const Urlparams = usePathname();
  
  // zustand
  const {setUser_Zustand} = useUserStore()
  const { cartCount, clearCart } = useCartStore();
  // hook
  const { accessToken, user: hookUser, refreshFromCookies, clearAuthData } = useAuthInfor() 
  const router = useRouter();

  const toggleMobileMenu = () => {
    if (isMobileMenuOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsMobileMenuOpen(false);
        setIsClosing(false);
        document.body.classList.remove('mobile-menu-open');
      }, 300);
    } else {
      setIsMobileMenuOpen(true);
      document.body.classList.add('mobile-menu-open');
    }
  };

  const closeMobileMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsClosing(false);
      document.body.classList.remove('mobile-menu-open');
    }, 300);
  };

  // Close mobile menu on route change
  useEffect(() => {
    const handleRouteChange = () => {
      if (isMobileMenuOpen) {
        closeMobileMenu();
      }
    };

    handleRouteChange();
  }, [Urlparams]);

  // Close mobile menu on window resize  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        setIsClosing(false);
        document.body.classList.remove('mobile-menu-open');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    
    // Nếu có user từ hook, sử dụng luôn
    if (hookUser) {
      setUser(hookUser);
      setUser_Zustand(hookUser);
      return;
    }

    // Nếu không có user nhưng có accessToken, gọi API
    if (accessToken && !hookUser) {
      authGetUserInfo_API(accessToken).then((res: any) => {
        if (res) {
          setUser(res);
          setCookie("user", JSON.stringify(res));
          setUser_Zustand(res);
        }
      });
    }

    // Nếu không có gì, thử force refresh cookies
    if (!accessToken && !hookUser) {
      refreshFromCookies();
    }
  }, [accessToken, hookUser, refreshFromCookies]);

  const handleLogout = async () => {
    if (!accessToken) return;
    
    try {
      // Gọi API logout nếu có accessToken
      await authLogout_API(accessToken);
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Luôn clear tất cả auth data bất kể API có lỗi hay không
      clearAuthData(); // Clear tất cả auth data
      clearCart(); // Clear giỏ hàng
      router.push("/login");
    }
  };

  const handleMobileLinkClick = () => {
    closeMobileMenu();
  };

  return (
    <>
      <nav className="bg-background/95 backdrop-blur-md shadow-sm sticky top-0 z-40 transition-all duration-300 hover:shadow-lg border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-screen-xl">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-3 group" onClick={handleMobileLinkClick}>
            <Image
              className="rounded-full w-12 h-12 md:w-14 md:h-14 object-cover transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
              src="https://plus.unsplash.com/premium_photo-1687686676757-9d849a16e4ea?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGVyc2lvbnxlbnwwfHwwfHx8MA%3D%3D"
              alt="KICKSTYLE Logo"
              width={56}
              height={56}
            />
            <span className="text-xl md:text-2xl font-bold text-primary group-hover:text-primary/80 transition-colors duration-300">
              KICKSTYLE
            </span>
          </Link>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Mobile Cart Icon */}
            <Link href="/cart" className="relative text-muted-foreground hover:text-primary transition-colors p-2">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            
            <Button
              isIconOnly
              variant="light"
              onPress={toggleMobileMenu}
              className="text-primary hover:text-primary/80 w-12 h-12"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </Button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Navigation Links */}
            <ul className="flex items-center space-x-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-foreground/80 font-medium hover:text-primary transition-colors relative group`}
                  >
                    {link.label}
                    <span
                      className={`absolute bottom-[-4px] left-0 h-0.5 bg-primary transition-all duration-300 ${
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
              <ThemeToggle />

              {/* Icons */}
              <div className="flex items-center space-x-4">
                {/* Shopping Cart */}
                <Link href="/cart" className="relative group text-muted-foreground hover:text-primary transition-colors">
                  <ShoppingCart size={24} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full px-1.5 min-w-[20px] h-5 flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* User/Auth Button */}
                <div className="relative group">
                  <Button
                    isIconOnly
                    variant="light"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <User size={24} />
                  </Button>

                  {/* Auth Dropdown */}
                  <div
                    className="absolute right-0 mt-2 w-72 bg-background rounded-lg shadow-xl border border-border overflow-hidden z-50 
                    opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                  >
                    {user ? (
                      <div className="p-4">
                        {/* User Profile Section */}
                        <div className="flex items-center space-x-4 border-b border-border pb-3 mb-2">
                          {user?.avatarUrl ? (
                            <Avatar
                              src={user.avatarUrl}
                              alt={`${user.fullName}'s avatar`}
                              className="w-14 h-14"
                            />
                          ) : (
                            <Avatar
                              name={user?.fullName?.charAt(0).toUpperCase()}
                              className="w-14 h-14 bg-primary/10 text-primary"
                            />
                          )}
                          <div>
                            <p className="font-semibold text-foreground text-lg">
                              {user?.fullName}
                            </p>
                            <p className="text-sm text-default-500">
                              {user?.email}
                            </p>
                          </div>
                        </div>

                        {/* User Actions */}
                        <div className="space-y-2">
                          <Link
                            href="/profile"
                            className="flex items-center space-x-3 px-3 py-2 hover:bg-default-100 rounded-md transition-colors text-foreground"
                          >
                            <Settings size={20} className="text-primary" />
                            <span>Cài đặt tài khoản</span>
                          </Link>
                          <Link
                            href="/history-order"
                            className="flex items-center space-x-3 px-3 py-2 hover:bg-default-100 rounded-md transition-colors text-foreground"
                          >
                            <History size={20} className="text-primary" />
                            <span>Lịch sử đơn hàng</span>
                          </Link>
                          <Button
                            variant="light"
                            color="danger"
                            className="w-full justify-start"
                            startContent={<LogOut size={20} />}
                            onPress={handleLogout}
                          >
                            Đăng xuất
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-2 space-y-2">
                         <Button
                          as={Link}
                          href="/login"
                          color="primary"
                          variant="light"
                          className="w-full justify-start"
                        >
                          Đăng nhập
                        </Button>
                        <Button
                          as={Link}
                          href="/register"
                          color="primary"
                          variant="light"
                          className="w-full justify-start"
                        >
                          Đăng ký
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className={`fixed inset-0 z-50 md:hidden ${
            isClosing ? 'animate-fadeOut' : 'animate-fadeIn'
          }`}
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 mobile-menu-overlay"
            onClick={closeMobileMenu}
          />
          
          {/* Mobile Menu Panel */}
          <div 
            className={`absolute inset-y-0 right-0 w-full max-w-sm bg-background shadow-2xl ${
              isClosing ? 'animate-slideOutRight' : 'animate-slideInRight'
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur-md">
                <div className="flex items-center space-x-3">
                  <Image
                    className="rounded-full w-10 h-10 object-cover"
                    src="https://plus.unsplash.com/premium_photo-1687686676757-9d849a16e4ea?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGVyc2lvbnxlbnwwfHwwfHx8MA%3D%3D"
                    alt="KICKSTYLE"
                    width={40}
                    height={40}
                  />
                  <span className="text-lg font-bold text-primary">
                    KICKSTYLE
                  </span>
                </div>
                <Button
                  isIconOnly
                  variant="light"
                  onPress={closeMobileMenu}
                  className="w-10 h-10"
                >
                  <X size={24} className="text-default-500" />
                </Button>
              </div>

              {/* User Section */}
              <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-primary/10">
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      {user?.avatarUrl ? (
                        <Avatar
                          src={user.avatarUrl}
                          alt={`${user.fullName}'s avatar`}
                          className="w-16 h-16"
                        />
                      ) : (
                        <Avatar
                          name={user?.fullName?.charAt(0).toUpperCase()}
                          className="w-16 h-16 bg-primary/20 text-primary text-xl"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-lg truncate">
                          {user?.fullName}
                        </p>
                        <p className="text-sm text-default-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        as={Link}
                        href="/profile"
                        variant="flat"
                        color="primary"
                        startContent={<Settings size={18} />}
                        onClick={handleMobileLinkClick}
                        size="sm"
                      >
                        Cài đặt
                      </Button>
                      <Button
                        color="danger"
                        variant="flat"
                        startContent={<LogOut size={18} />}
                        onClick={() => {
                          handleLogout();
                          handleMobileLinkClick();
                        }}
                        size="sm"
                      >
                        Đăng xuất
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button
                      as={Link}
                      href="/login"
                      color="primary"
                      className="w-full"
                      onClick={handleMobileLinkClick}
                      size="lg"
                    >
                      Đăng nhập
                    </Button>
                    <Button
                      as={Link}
                      href="/register"
                      variant="bordered"
                      color="primary"
                      className="w-full"
                      onClick={handleMobileLinkClick}
                      size="lg"
                    >
                      Đăng ký mới
                    </Button>
                  </div>
                )}
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto px-4 py-6">
                <nav className="space-y-2">
                  {navLinks.map((link) => {
                    const isActive = Urlparams === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={handleMobileLinkClick}
                        className={`flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-300 ${
                          isActive
                            ? "bg-primary/15 text-primary border-l-4 border-primary shadow-sm"
                            : "text-foreground hover:bg-default-100 hover:text-primary active:bg-default-200"
                        }`}
                      >
                        <link.icon 
                          size={24} 
                          className={`${isActive ? "text-primary" : "text-default-500"} transition-colors`} 
                        />
                        <span className="font-medium text-lg">{link.label}</span>
                      </Link>
                    );
                  })}
                </nav>

                {/* Additional Mobile Options */}
                <div className="mt-8 pt-6 border-t border-border">
                  <div className="space-y-3">
                    <Link
                      href="/history-order"
                      onClick={handleMobileLinkClick}
                      className="flex items-center space-x-4 px-4 py-3 rounded-xl text-foreground hover:bg-default-100 hover:text-primary transition-all duration-300"
                    >
                      <History size={22} className="text-default-500" />
                      <span className="font-medium">Lịch sử đơn hàng</span>
                    </Link>
                    
                    <div className="px-4 py-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-default-600">Giao diện</span>
                        <ThemeToggle />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
