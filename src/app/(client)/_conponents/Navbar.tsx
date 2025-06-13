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
  Newspaper,
  Phone,
  History
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import useAuthInfor from "@/app/customHooks/AuthInfor";
import { authGetUserInfo_API, authLogout_API } from "@/app/_service/authClient";
import { useUserStore } from "@/app/_zustand/client/InForUser";
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
  const navLinks = [
    { label: "Trang chủ", href: "/", icon: Home },
    { label: "Sản phẩm", href: "/products", icon: Package },
    { label: "Khuyến mãi", href: "/promotions", icon: Tag },
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
    <nav className="bg-background/80 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-all duration-300 hover:shadow-lg border-b border-border">
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
          <span className="text-2xl font-bold text-primary group-hover:text-primary/80 transition-colors duration-300">
            KICKSTYLE
          </span>
        </Link>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <Button
            isIconOnly
            variant="light"
            onPress={toggleMobileMenu}
            className="text-primary hover:text-primary/80"
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
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full px-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  0
                </span>
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
                        variant="flat"
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden">
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-background shadow-2xl animate-slideInRight">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
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
                  onPress={toggleMobileMenu}
                >
                  <X size={24} className="text-default-500" />
                </Button>
              </div>

              {/* User Section */}
              <div className="p-6 border-b border-border">
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
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
                        <p className="font-semibold text-foreground text-lg">{user?.fullName}</p>
                        <p className="text-sm text-default-500">{user?.email}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        as={Link}
                        href="/profile"
                        variant="flat"
                        color="primary"
                        startContent={<Settings size={18} />}
                        onClick={toggleMobileMenu}
                      >
                        Cài đặt
                      </Button>
                      <Button
                        color="danger"
                        variant="flat"
                        startContent={<LogOut size={18} />}
                        onClick={() => {
                          handleLogout();
                          toggleMobileMenu();
                        }}
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
                      onClick={toggleMobileMenu}
                    >
                      Đăng nhập
                    </Button>
                    <Button
                      as={Link}
                      href="/register"
                      variant="bordered"
                      color="primary"
                      className="w-full"
                      onClick={toggleMobileMenu}
                    >
                      Đăng ký mới
                    </Button>
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
                            ? "bg-primary/10 text-primary border-l-4 border-primary"
                            : "text-foreground hover:bg-default-100 hover:text-primary"
                        }`}
                      >
                        <link.icon 
                          size={22} 
                          className={`${isActive ? "text-primary" : "text-default-500"} transition-colors`} 
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
