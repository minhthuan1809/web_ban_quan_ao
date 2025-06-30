import type { Metadata } from "next";
import React from "react";
import UserProfile from "@/app/components/SidebarProfile";

export const metadata: Metadata = {
  title: "Hồ sơ cá nhân - Profile",
  description: "Quản lý thông tin cá nhân và cài đặt tài khoản",
};

export default function LayoutProfile({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="sticky top-6">
              <UserProfile />
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            <div className="bg-content1 backdrop-blur-sm rounded-2xl shadow-xl border border-divider p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-success/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
}
