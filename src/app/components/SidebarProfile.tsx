"use client";
import React from "react";
import { UserIcon, LockIcon, User, Mail, Shield, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import useAuthInfor from "@/app/customHooks/AuthInfor";
import { authLogout_API } from "@/app/_service/authClient";
import { toast } from "react-toastify";
import { Button, Card, CardBody, Divider } from "@nextui-org/react";

const data = [
  {
    title: "Thông tin tài khoản",
    href: "/profile",
    icon: UserIcon,
    color: "blue",
    description: "Cập nhật thông tin cá nhân"
  },
  {
    title: "Đổi mật khẩu",
    href: "/profile/password",
    icon: LockIcon,
    color: "purple",
    description: "Thay đổi mật khẩu bảo mật"
  },
];

const getBackgroundColor = (color: string, isActive: boolean) => {
  if (!isActive) return "";
  switch (color) {
    case "blue":
      return "bg-blue-50 border-blue-200";
    case "green":
      return "bg-green-50 border-green-200";
    case "purple":
      return "bg-purple-50 border-purple-200";
    default:
      return "";
  }
};

const getIconColor = (color: string, isActive: boolean) => {
  const baseClass = isActive ? "" : "group-hover:scale-105 transition-transform";
  switch (color) {
    case "blue":
      return `${baseClass} ${isActive ? 'text-blue-600' : 'text-blue-500 group-hover:text-blue-600'}`;
    case "green":
      return `${baseClass} ${isActive ? 'text-green-600' : 'text-green-500 group-hover:text-green-600'}`;
    case "purple":
      return `${baseClass} ${isActive ? 'text-purple-600' : 'text-purple-500 group-hover:text-purple-600'}`;
    default:
      return baseClass;
  }
};

const getTextColor = (color: string, isActive: boolean) => {
  if (isActive) return "text-gray-800 font-semibold";
  switch (color) {
    case "blue":
      return "group-hover:text-blue-600 text-gray-700";
    case "green":
      return "group-hover:text-green-600 text-gray-700";
    case "purple":
      return "group-hover:text-purple-600 text-gray-700";
    default:
      return "text-gray-700";
  }
};

export default function UserProfile() {
  const pathname = usePathname();
  const router = useRouter();
  const { user: userInfo, accessToken, clearAuthData } = useAuthInfor();

  const handleLogout = async () => {
    try {
      if (accessToken) {
        await authLogout_API(accessToken);
      }
      clearAuthData();
      toast.success('Đăng xuất thành công');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      clearAuthData(); // Logout anyway
      router.push('/login');
    }
  };


  return (
    <div className="w-full md:max-w-80 space-y-4">

      {/* Navigation Menu */}
      <Card className="shadow-lg">
        <CardBody className="p-4">
          <nav className="space-y-2">
            {data.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <div key={index}>
                  <Link
                    href={item.href}
                    className={`group flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-all duration-300 border-2 border-transparent ${
                      isActive ? getBackgroundColor(item.color, true) : "hover:border-gray-200"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg bg-${item.color}-100 flex items-center justify-center ${
                      isActive ? `bg-${item.color}-200` : `group-hover:bg-${item.color}-200`
                    }`}>
                      <item.icon className={`w-5 h-5 ${getIconColor(item.color, isActive)}`} />
                    </div>
                    <div className="flex-1">
                      <span className={`font-medium ${getTextColor(item.color, isActive)}`}>
                        {item.title}
                      </span>
                      <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                    </div>
                    {isActive && (
                      <div className={`w-2 h-2 rounded-full bg-${item.color}-600`}></div>
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>

          <Divider className="my-4" />

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            color="danger"
            variant="flat"
            className="w-full justify-start"
            startContent={<LogOut size={18} />}
          >
            Đăng xuất
          </Button>
        </CardBody>
      </Card>

      {/* Quick Stats */}
      <Card className="shadow-lg">
        <CardBody className="p-4">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <User size={16} className="text-blue-600" />
            Thống kê nhanh
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Thành viên từ</span>
              <span className="text-sm font-medium text-gray-800">
                {userInfo?.createdAt ? new Date(userInfo.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Trạng thái</span>
              <span className="text-sm font-medium text-green-600">Hoạt động</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Bảo mật</span>
              <span className="text-sm font-medium text-blue-600">Đã xác thực</span>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
