"use client";
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useUserStore } from '@/app/_zustand/client/InForUser';
import { cn } from '@nextui-org/react';
import { deleteCookie } from 'cookies-next';
import { authGetUserInfo_API, authLogout_API } from '@/app/_service/authClient';
import useAuthInfor from '@/app/customHooks/AuthInfor';
import Loading from '@/app/_util/Loading';
import { ThemeToggle } from './_conponents/ThemeToggle';
import Link from 'next/link';
import GetIconComponent from '@/app/_util/Icon';

export default function Layout({children}: {children: React.ReactNode}) {
    const pathname = usePathname();
    const router = useRouter();
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user_Zustand, setUser_Zustand } = useUserStore();
    const { accessToken } = useAuthInfor() || { accessToken: null };
    const [isLoadingBtnLogout, setIsLoadingBtnLogout] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Check mobile screen size on mount and window resize
    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
        if (window.innerWidth >= 768) {
          setIsMobileMenuOpen(false);
        }
      };
      
      checkMobile();
      window.addEventListener('resize', checkMobile);
      
      return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Auto-expand menu items that contain current path
    useEffect(() => {
      const currentMenuItem = menuItems.find(item => 
        item.submenu?.some(sub => pathname.startsWith(sub.href))
      );
      if (currentMenuItem && currentMenuItem.submenu) {
        setActiveMenu(currentMenuItem.name);
      }
    }, [pathname]);

    // Toggle submenu
    const toggleSubmenu = (name: string) => {
      setActiveMenu(activeMenu === name ? null : name);
    };

    // Menu items configuration
    const menuItems = [
        {
          name: "Tổng quan",
          href: "/dashboard", 
          icon: "Home",
        },
        {
          name: "Thông Kê",
          href: "/statistical",
          icon: "LayoutDashboard",
          submenu: [
            {
              name: "Doanh thu",
              href: "/statistical/stats",
              icon: "LineChart",
            },
          ],
        },
        {
          name: "Đơn Hàng",
          href: "/orders",
          icon: "Package",
          submenu: [
            {
              name: "Xác nhận đơn hàng",
              href: "/orders/confirm",
              icon: "CheckCircle", 
            },
            {
              name: "Lịch Sử Đơn Hàng",
              href: "/orders/history",
              icon: "History",
            },
            {
              name: "Lịch Sử Thanh Toán",
              href: "/orders/payments",
              icon: "History",
            },
          ],
        },
        {
          name: "Mã Giảm Giá",
          href: "/discount",
          icon: "DollarSign",
          submenu: [
            {
              name: "Tạo Mã Giảm Giá",
              href: "/discount/code",
              icon: "DollarSign",
            },
            {
              name: "Lịch Sử Sử Dụng",
              href: "/discount/history",
              icon: "Calendar",
            },
          ],
        },
        {
          name: "Sản Phẩm",
          href: "/productAdmin",
          icon: "ShoppingBag",
        },
        {
          name: "Khách Hàng",
          href: "/customers",
          icon: "Users",
        },
        {
          name: "Danh mục",
          icon: "FolderMinus",
          submenu: [
            {
              name: "Danh mục",
              href: "/category",
              icon: "LayoutGrid",
            },
            {
              name: "Đội Bóng",
              href: "/team",
              icon: "Users",
            },
            {
              name: "Chất liệu",
              href: "/material",
              icon: "AirVent",
            },
            {
              name: "Màu",
              href: "/color",
              icon: "Palette",
            },
            {
              name: "Kích cỡ",
              href: "/size",
              icon: "Ruler",
            },
          ],
        },
        {
          name: "Liên Hệ",
          href: "/contacts",
          icon: "PhoneCall",
          submenu: [
            {
              name: "Liên Hệ",
              href: "/contacts/contacts",
              icon: "PhoneCall",
            },
            {
              name: "Lịch Sử Liên Hệ",
              href: "/contacts/history",
              icon: "History",
            },
          ],
        },
        {
          name: "Quản Lý Đánh Giá",
          href: "/evaluate",
          icon: "MessageCircle",
        },
    ];

    // Get user info
    useEffect(() => {
        setIsLoading(true);
        try {
            if (!accessToken) {
                setUser_Zustand(null);
                deleteCookie("token");
                router.push("/login");
                return;
            }
            authGetUserInfo_API(accessToken).then((res: any) => {
                if (res) {
                    setUser_Zustand(res);
                }
                else {
                    setUser_Zustand(null);
                    deleteCookie("token");
                    router.push("/login");
                }
            });
        } catch (error) {
            console.error("Error getting user info:", error);
            setUser_Zustand(null);
            deleteCookie("token");
            router.push("/login");
        } finally {
            setIsLoading(false);
        }
    }, [accessToken]);

    // Handle logout
    const handleLogout = async () => {
        setIsLoadingBtnLogout(true);
        try {
            router.push("/login");
            deleteCookie("token");
            setUser_Zustand(null);
            await authLogout_API(accessToken);
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setIsLoadingBtnLogout(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile overlay */}
            {isMobile && isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile header */}
            {isMobile && (
                <header className="sticky top-0 z-30 flex items-center justify-between p-4 bg-card shadow-md">
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 rounded-lg hover:bg-primary/10"
                    >
                        <GetIconComponent icon="Menu" className="w-6 h-6" />
                    </button>
                    
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <div 
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => router.push("/settings")}
                        >
                            {user_Zustand?.avatarUrl ? (
                                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary/20">
                                    <img
                                        src={user_Zustand.avatarUrl}
                                        alt="avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
                                    {user_Zustand?.fullName?.charAt(0) || 'A'}
                                </div>
                            )}
                        </div>
                    </div>
                </header>
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 bg-card shadow-lg transition-all duration-300 flex flex-col",
                    isMobile
                        ? isMobileMenuOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                        : "translate-x-0",
                    isMobile ? "w-80" : isCollapsed ? "w-20" : "w-80"
                )}
            >
                {/* Header */}
                <div className="h-20 border-b border-border flex items-center justify-between px-6 bg-gradient-to-r from-primary to-primary-600">
                    {(!isCollapsed || isMobile) && (
                        <div
                            className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => router.push("/settings")}
                        >
                            {user_Zustand?.avatarUrl ? (
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
                                    <img
                                        src={user_Zustand.avatarUrl}
                                        alt="avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-bold border-2 border-white/20">
                                    {user_Zustand?.fullName?.charAt(0) || 'A'}
                                </div>
                            )}
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-white">{user_Zustand?.fullName}</span>
                                <span className="text-xs text-primary-100">
                                    {user_Zustand?.roleName}
                                </span>
                                <span className="text-xs text-primary-200 truncate max-w-40">
                                    {user_Zustand?.email}
                                </span>
                            </div>
                        </div>
                    )}

                    {!isMobile && (
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        >
                            <div
                                className={`transform transition-transform ${
                                    isCollapsed ? "rotate-180" : ""
                                }`}
                            >
                                <GetIconComponent icon="ChevronLeft" className="w-5 h-5 text-white" />
                            </div>
                        </button>
                    )}

                    {/* Close button for mobile */}
                    {isMobile && (
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        >
                            <GetIconComponent icon="X" className="w-5 h-5 text-white" />
                        </button>
                    )}
                </div>
                
                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => (
                        <div key={item.name}>
                            {item.submenu ? (
                                <div className="space-y-1">
                                    <button
                                        onClick={() => toggleSubmenu(item.name)}
                                        className={cn(
                                            "w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group",
                                            item.href && (pathname.startsWith(item.href) ||
                                            item.submenu.some((sub) => pathname.startsWith(sub.href)))
                                                ? "bg-primary/10 text-primary"
                                                : "text-foreground hover:bg-primary/10 hover:text-primary"
                                        )}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div
                                                className={cn(
                                                    "flex-shrink-0 w-6 h-6 transition-colors",
                                                    item.href && (pathname.startsWith(item.href) ||
                                                    item.submenu.some((sub) => pathname.startsWith(sub.href)))
                                                        ? "text-primary"
                                                        : "text-muted-foreground group-hover:text-primary"
                                                )}
                                            >
                                                <GetIconComponent icon={item.icon as any} />
                                            </div>
                                            {(!isCollapsed || isMobile) && (
                                                <span className="text-sm font-medium">
                                                    {item.name}
                                                </span>
                                            )}
                                        </div>
                                        {(!isCollapsed || isMobile) && (
                                            <div
                                                className={cn(
                                                    "transform transition-transform duration-200",
                                                    activeMenu === item.name ? "rotate-180" : ""
                                                )}
                                            >
                                                <GetIconComponent
                                                    icon="ChevronDown"
                                                    className="w-4 h-4 text-muted-foreground"   
                                                />
                                            </div>
                                        )}
                                    </button>

                                    {activeMenu === item.name && (!isCollapsed || isMobile) && (
                                        <div className="ml-6 space-y-1 border-l-2 border-border pl-4">
                                            {item.submenu.map((subitem) => (
                                                <Link
                                                    key={subitem.name}
                                                    href={subitem.href}
                                                    className={cn(
                                                        "flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 group",
                                                        pathname.startsWith(subitem.href)
                                                            ? "bg-primary/10 text-primary font-medium"
                                                            : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                                                    )}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    <div
                                                        className={cn(
                                                            "w-5 h-5 mr-3 transition-colors",
                                                            pathname.startsWith(subitem.href)
                                                                ? "text-primary"
                                                                : "text-muted-foreground group-hover:text-primary"
                                                        )}
                                                    >
                                                        <GetIconComponent icon={subitem.icon as any} />
                                                    </div>
                                                    {subitem.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center px-4 py-3 rounded-lg transition-all duration-200 group",
                                        pathname === item.href || pathname.startsWith(item.href + "/")
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "text-foreground hover:bg-primary/10 hover:text-primary"
                                    )}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <div
                                        className={cn(
                                            "flex-shrink-0 w-6 h-6 transition-colors",
                                            pathname === item.href || pathname.startsWith(item.href + "/")
                                                ? "text-primary"
                                                : "text-muted-foreground group-hover:text-primary"
                                        )}
                                    >
                                        <GetIconComponent icon={item.icon as any} />
                                    </div>
                                    {(!isCollapsed || isMobile) && (
                                        <span className="ml-3 text-sm">
                                            {item.name}
                                        </span>
                                    )}
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-border">
                    <div className="flex items-center gap-2 mb-3">
                        {!isMobile && <ThemeToggle />}
                        <span className="text-sm text-muted-foreground">
                            {(!isCollapsed || isMobile) && !isMobile && "Giao diện"}
                        </span>
                    </div>
                    <button
                        onClick={handleLogout}
                        disabled={isLoadingBtnLogout}
                        className={cn(
                            "w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg p-3 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5",
                            isCollapsed && !isMobile ? "px-2" : "px-4"
                        )}
                    >
                        {(!isCollapsed || isMobile) ? (
                            <>
                                {isLoadingBtnLogout ? (
                                    <div className="animate-spin">
                                        <GetIconComponent icon="Loader2" className="w-5 h-5" />
                                    </div>
                                ) : (
                                    <GetIconComponent icon="LogOut" className="w-5 h-5" />
                                )}
                                <span className="font-medium text-sm">
                                    {isLoadingBtnLogout ? "Đang đăng xuất..." : "Đăng Xuất"}
                                </span>
                            </>
                        ) : (
                            <GetIconComponent icon={isLoadingBtnLogout ? "Loader2" : "LogOut"} className={cn("w-5 h-5", isLoadingBtnLogout && "animate-spin")} />
                        )}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={cn(
                "transition-all duration-300",
                isMobile ? "ml-0 pt-16" : isCollapsed ? "ml-20" : "ml-80"
            )}>
                <div className="p-4">
                    {isLoading ? <Loading /> : children}
                </div>
            </main>
        </div>
    );
}