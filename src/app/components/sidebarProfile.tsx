"use client"
import React from "react";
import { UserIcon, MapPinIcon, LockIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const data = [
  {
    title: "Cập nhật tài khoản",
    href: "/profile",
    icon: UserIcon,
    color: "blue",
  },
  {
    title: "Cập nhật địa chỉ",
    href: "/profile/address",
    icon: MapPinIcon,
    color: "green",
  },
  {
    title: "Cập nhật mật khẩu",
    href: "/profile/password",
    icon: LockIcon,
    color: "purple",
  },
];

const getBackgroundColor = (color: string) => {
  switch (color) {
    case 'blue':
      return 'bg-blue-50';
    case 'green':
      return 'bg-green-50';
    case 'purple':
      return 'bg-purple-50';
    default:
      return '';
  }
};

const getIconColor = (color: string) => {
  switch (color) {
    case 'blue':
      return 'text-blue-500 group-hover:text-blue-600';
    case 'green':
      return 'text-green-500 group-hover:text-green-600';
    case 'purple':
      return 'text-purple-500 group-hover:text-purple-600';
    default:
      return '';
  }
};

const getTextColor = (color: string) => {
  switch (color) {
    case 'blue':
      return 'group-hover:text-blue-600';
    case 'green':
      return 'group-hover:text-green-600';
    case 'purple':
      return 'group-hover:text-purple-600';
    default:
      return '';
  }
};

export default function UserProfile() {
  const pathname = usePathname();

  return (
    <div>
      <div className="w-full md:max-w-96 bg-white p-6 md:p-8 m-4 rounded-lg">
        <div className="flex items-center space-x-4 mb-8">
          <img
            src="https://i.pravatar.cc/150?img=1"
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-50"
          />
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Nguyễn Minh Em
            </h1>
            <p className="text-gray-500 text-sm">Thành viên</p>
          </div>
        </div>

        <nav className="space-y-4">
          {data.map((item, index) => (
            <div key={index}>
              <Link
                href={item.href}
                className={`group flex items-center space-x-4 p-4 hover:bg-blue-50 rounded-lg transition-colors duration-300 ${
                  pathname === item.href ? getBackgroundColor(item.color) : ''
                }`}
              >
                <item.icon className={`w-6 h-6 ${getIconColor(item.color)}`} />
                <span className={`text-gray-700 ${getTextColor(item.color)} font-medium`}>
                  {item.title}
                </span>
              </Link>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}