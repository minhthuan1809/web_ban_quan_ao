"use client";
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState, useCallback } from 'react';
import { useUserStore } from '@/app/_zustand/client/InForUser';
import { cn } from '@/app/_lib/utils';
import useAuthInfor from '@/app/customHooks/AuthInfor';
import Loading from '@/app/_util/Loading';
import { ThemeToggle } from './_conponents/ThemeToggle';
import Link from 'next/link';
import { 
  Home, 
  Package, 
  CheckCircle, 
  History, 
  DollarSign, 
  Users, 
  FolderOpen, 
  LayoutGrid, 
  Palette, 
  Ruler, 
  PhoneCall, 
  Menu,
  X,
  ChevronRight,
  LogOut,
  Settings,
  Bell,
  Search,
  Shield,
  UserCheck,
  Package2,
  CreditCard,
  Gift,
  Star,
  Mail,
  AirVent
} from 'lucide-react';
import { Avatar, Button, Tooltip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { toast } from 'react-toastify';
import { useAdminSearchStore } from '@/app/_zustand/admin/SearchStore';

interface MenuItem {
  name: string;
  href?: string;
  icon: React.ComponentType<any>;
  submenu?: SubMenuItem[];
  badge?: number;
  color?: string;
}

interface SubMenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
}

const MENU_ITEMS: MenuItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard", 
    icon: Home,
    color: "bg-blue-500"
  },
  {
    name: "Đơn Hàng",
    icon: Package,
    color: "bg-purple-500",
    submenu: [
      {
        name: "Chờ Xác Nhận",
        href: "/orders/confirm",
        icon: CheckCircle,
      },
      {
        name: "Lịch Sử",
        href: "/orders/history",
        icon: History,
      },
      {
        name: "Thanh Toán",
        href: "/orders/payments",
        icon: CreditCard,
      },
    ],
  },
  {
    name: "Sản Phẩm",
    href: "/productAdmin",
    icon: Package2,
    color: "bg-orange-500"
  },
  {
    name: "Khách Hàng",
    href: "/customers",
    icon: Users,
    color: "bg-pink-500"
  },
  {
    name: "Khuyến Mãi",
    icon: Gift,
    color: "bg-red-500",
    submenu: [
      {
        name: "Mã Giảm Giá",
        href: "/discount/code",
        icon: DollarSign,
      },
    ],
  },
  {
    name: "Danh Mục",
    icon: FolderOpen,
    color: "bg-indigo-500",
    submenu: [
      {
        name: "Phân Loại",
        href: "/category",
        icon: LayoutGrid,
      },
      {
        name: "Đội Bóng",
        href: "/team",
        icon: Shield,
      },
      {
        name: "Chất Liệu",
        href: "/material",
        icon: AirVent,
      },
      {
        name: "Màu Sắc",
        href: "/color",
        icon: Palette,
      },
      {
        name: "Kích Cỡ",
        href: "/size",
        icon: Ruler,
      },
    ],
  },
  {
    name: "Liên Hệ",
    icon: PhoneCall,
    color: "bg-cyan-500",
    submenu: [
      {
        name: "Tin Nhắn Mới",
        href: "/contacts/contacts",
        icon: Mail,
      },
      {
        name: "Lịch Sử",
        href: "/contacts/history",
        icon: History,
      },
    ],
  },
  {
    name: "Đánh Giá",
    href: "/evaluate",
    icon: Star,
    color: "bg-yellow-500"
  },
];

export default function AdminLayout({children}: {children: React.ReactNode}) {
    const pathname = usePathname();
    const router = useRouter();
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user_Zustand, setUser_Zustand, clearUser } = useUserStore();
    const { accessToken, user, clearAuthData } = useAuthInfor();
    const [isLoading, setIsLoading] = useState(true);
    const [title, setTitle] = useState('Dashboard');

   

    // Map tiếng Anh sang tiếng Việt cho tiêu đề
    const titleMap: Record<string, string> = {
      'Dashboard': 'Bảng điều khiển',
      'Contacts': 'Liên hệ',
      'Customers': 'Khách hàng',
      'Products': 'Sản phẩm',
      'Orders': 'Đơn hàng',
      'Discount': 'Khuyến mãi',
      'Category': 'Danh mục',
      'Team': 'Đội bóng',
      'Material': 'Chất liệu',
      'Color': 'Màu sắc',
      'Size': 'Kích cỡ',
      'Evaluate': 'Đánh giá',
      'Chờ Xác Nhận': 'Chờ xác nhận',
      'Lịch Sử': 'Lịch sử',
      'Thanh Toán': 'Thanh toán',
      'Mã Giảm Giá': 'Mã giảm giá',
      'Phân Loại': 'Phân loại',
      'Tin Nhắn Mới': 'Tin nhắn mới',
      'Sửa': 'Sửa',
      'Thêm': 'Thêm',
      'Sản Phẩm': 'Sản phẩm',
      'Khách Hàng': 'Khách hàng',
      'Đánh Giá': 'Đánh giá',
      'Khuyến Mãi': 'Khuyến mãi',
      'Danh Mục': 'Danh mục',
      'Liên Hệ': 'Liên hệ',
    };

    // Check mobile screen size
    useEffect(() => {
      const checkMobile = () => {
        const mobile = window.innerWidth < 1024;
        setIsMobile(mobile);
        if (!mobile) setIsMobileMenuOpen(false);
      };
      
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Auto-expand menu items that contain current path
    useEffect(() => {
      const currentMenuItem = MENU_ITEMS.find(item => 
        item.submenu?.some(sub => pathname.startsWith(sub.href))
      );
      if (currentMenuItem?.submenu) {
        setActiveMenu(currentMenuItem.name);
      }
    }, [pathname]);

    // Toggle submenu
    const toggleSubmenu = useCallback((name: string) => {
      setActiveMenu(activeMenu === name ? null : name);
    }, [activeMenu]);

    // Auth check
    useEffect(() => {
    

      if (accessToken && user) {
        if (user.role?.name?.trim().toLowerCase() !== 'admin') {
          setIsLoading(false);
          return;
        }

        setUser_Zustand(user);
      }
      
      setIsLoading(false);
    }, [accessToken, user, setUser_Zustand]);

    // Handle logout
    const handleLogout = useCallback(async () => {
      try {
        clearAuthData();
        clearUser(); // Clear Zustand user data
        toast.success('Đăng xuất thành công');
        router.push('/login');
      } catch (error) {
        console.error('Logout error:', error);
        toast.error('Có lỗi xảy ra khi đăng xuất');
      }
    }, [clearAuthData, clearUser, router]);

    // Set title on mount or pathname change
    useEffect(() => {
      // Tìm menu hoặc submenu khớp với pathname
      let found = false;
      for (const item of MENU_ITEMS) {
        if (item.href && pathname.startsWith(item.href)) {
          setTitle(item.name);
          found = true;
          break;
        }
        if (item.submenu) {
          for (const sub of item.submenu) {
            if (pathname.startsWith(sub.href)) {
              setTitle(sub.name);
              found = true;
              break;
            }
          }
        }
        if (found) break;
      }
      if (!found) setTitle('Dashboard');
    }, [pathname, setTitle]);

    // Hook search Zustand ở đầu component
    const search = useAdminSearchStore(state => state.search);
    const setSearch = useAdminSearchStore(state => state.setSearch);

    // Loading state
    if (isLoading) {
      return <Loading />;
    }

    // Render menu item
    const renderMenuItem = (item: MenuItem) => {
      const isActive = item.href ? pathname.startsWith(item.href) : false;
      const hasSubmenu = item.submenu && item.submenu.length > 0;
      const isSubmenuOpen = activeMenu === item.name;

      return (
        <div key={item.name} className="mb-1">
          {hasSubmenu ? (
            <button
              onClick={() => toggleSubmenu(item.name)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group hover:bg-gray-100 dark:hover:bg-gray-800",
                isSubmenuOpen ? "bg-primary/10 text-primary" : "text-gray-600 dark:text-gray-300"
              )}
            >
              <div className="flex items-center space-x-3">
                <div className={cn(
                  "p-2.5 rounded-lg transition-colors",
                  isSubmenuOpen ? "bg-primary/20" : "bg-gray-100 dark:bg-gray-700",
                  item.color && !isSubmenuOpen ? item.color + " text-white" : ""
                )}>
                  <item.icon size={20} />
                </div>
                {!isCollapsed && (
                  <span className="font-medium text-sm">{item.name}</span>
                )}
              </div>
              {!isCollapsed && (
                <ChevronRight 
                  size={16} 
                  className={cn(
                    "transition-transform duration-200",
                    isSubmenuOpen ? "rotate-90" : ""
                  )} 
                />
              )}
            </button>
          ) : (
            <Link href={item.href || '#'}>
              <div className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group hover:bg-gray-100 dark:hover:bg-gray-800 relative",
                isActive ? "bg-primary text-white shadow-lg" : "text-gray-600 dark:text-gray-300"
              )}>
                <div className={cn(
                  "p-2.5 rounded-lg transition-colors",
                  isActive ? "bg-white/20" : "bg-gray-100 dark:bg-gray-700",
                  item.color && !isActive ? item.color + " text-white" : ""
                )}>
                  <item.icon size={20} />
                </div>
                {!isCollapsed && (
                  <span className="font-medium text-sm">{item.name}</span>
                )}
                {isActive && (
                  <div className="absolute right-2 w-1 h-8 bg-white rounded-l-full" />
                )}
              </div>
            </Link>
          )}

          {/* Submenu */}
          {hasSubmenu && isSubmenuOpen && !isCollapsed && (
            <div className="mt-2 ml-6 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
              {item.submenu?.map((subItem) => {
                const isSubActive = pathname.startsWith(subItem.href);
                return (
                  <Link key={subItem.href} href={subItem.href}>
                    <div className={cn(
                      "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800",
                      isSubActive 
                        ? "bg-primary/10 text-primary border-l-2 border-primary" 
                        : "text-gray-500 dark:text-gray-400"
                    )}>
                      <subItem.icon size={16} />
                      <span className="text-sm">{subItem.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Mobile Overlay */}
            {isMobile && isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col shadow-xl",
                    isMobile
                        ? isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                        : "translate-x-0",
                    isCollapsed ? "w-20" : "w-80"
                )}
            >
                {/* Header */}
                <div className="h-16 border-b border-divider flex items-center justify-between px-6 bg-content1">
                    {!isCollapsed && (
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center ">
                                <Package2 className="" size={24} />
                            </div>
                            <div>
                              <Link href="/">
                                <h1 className="text-xl font-bold ">
                                    KICKSTYLE
                                </h1>
                                </Link>
                                <p className="text-xs ">Admin Panel</p>
                            </div>
                        </div>
                    )}

                    {!isMobile && (
                        <Button
                            isIconOnly
                            variant="light"
                            size="sm"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="text-white hover:bg-white/10"
                        >
                            <Menu size={18} />
                        </Button>
                    )}

                    {isMobile && (
                        <Button
                            isIconOnly
                            variant="light"
                            size="sm"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-white hover:bg-white/10"
                        >
                            <X size={18} />
                        </Button>
                    )}
                </div>
                
                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
                        Menu Chính
                    </div>
                    {MENU_ITEMS.map(renderMenuItem)}
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    {!isCollapsed ? (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Avatar
                                    src={user_Zustand?.avatarUrl || undefined}
                                    name={user_Zustand?.fullName?.charAt(0)}
                                    size="sm"
                                    className="bg-primary text-white border-2 border-white shadow-lg"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {user_Zustand?.fullName}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {user_Zustand?.role?.name}
                                    </p>
                                </div>
                            </div>
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button 
                                        isIconOnly 
                                        variant="light" 
                                        size="sm"
                                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    >
                                        <Settings size={16} />
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu>
                                    <DropdownItem key="profile" startContent={<UserCheck size={16} />}>
                                        Hồ sơ
                                    </DropdownItem>
                                    <DropdownItem key="settings" startContent={<Settings size={16} />}>
                                        Cài đặt
                                    </DropdownItem>
                                    <DropdownItem 
                                        key="logout" 
                                        color="danger"
                                        startContent={<LogOut size={16} />}
                                        onClick={handleLogout}
                                    >
                                        Đăng xuất
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <Tooltip content={user_Zustand?.fullName}>
                                <Avatar
                                    src={user_Zustand?.avatarUrl || undefined}
                                    name={user_Zustand?.fullName?.charAt(0)}
                                    size="sm"
                                    className="bg-primary text-white cursor-pointer border-2 border-white shadow-lg"
                                />
                            </Tooltip>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className={cn(
                "transition-all duration-300",
                isCollapsed ? "lg:ml-20" : "lg:ml-80"
            )}>
                {/* Top Bar */}
                <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 shadow-sm">
                    {/* Mobile Menu Button */}
                    <Button
                        isIconOnly
                        variant="light"
                        size="sm"
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="lg:hidden"
                    >
                        <Menu size={20} />
                    </Button>

                    {/* Breadcrumb */}
                    <div className="hidden lg:block">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                            {titleMap[title] || title}
                        </h2>
                        <p className="text-sm text-gray-500">
                            Quản lý và điều hành hệ thống
                        </p>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-4">
                        <div className="relative w-48">
                          <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                          />
                          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        </div>
                        
                        <div className="relative">
                            <Button isIconOnly variant="light" size="sm">
                                <Bell size={18} />
                            </Button>
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white"></span>
                        </div>

                        <ThemeToggle />

                        <div className="hidden lg:flex items-center space-x-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                            <Avatar
                                src={user_Zustand?.avatarUrl || undefined}
                                name={user_Zustand?.fullName?.charAt(0)}
                                size="sm"
                                className="bg-primary text-white"
                            />
                            <div className="text-sm">
                                <p className="font-medium text-gray-700 dark:text-gray-300">
                                    {user_Zustand?.fullName}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {user_Zustand?.role?.name}
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="">
                    <div className=" mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
} 