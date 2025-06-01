import type { Metadata } from "next";
import React from "react";
import UserProfile from "@/app/components/SidebarProfile";

export const metadata: Metadata = {
  title: "Profile",
  description: "Profile",
};

export default function LayoutProfile({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="  bg-gray-50 min-h-[100vh]">
        <div className="w-[90%] m-auto flex flex-col md:flex-row">

      <UserProfile />

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-10">
          {children}
        </div>
      </main>
        </div>
    </div>
  );
}
