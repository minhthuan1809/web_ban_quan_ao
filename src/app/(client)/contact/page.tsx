import React from "react";
import * as Icon from "lucide-react";
import GetIconComponent from "@/app/_util/Icon";
import FormContact from "./FormContact";
import Link from "next/link";

export default function ContactPage() {
  const contact = [
    {
      icon: "Phone",
      title: "Điện thoại",
      value: "0909090909",
    },
    {
      icon: "Mail",
      title: "Email",
      value: "minhthuan@gmail.com",
    },
    {
      icon: "MapPin",
      title: "Địa chỉ",
      value: "Số 123, Đường ABC, Quận XYZ, Thành phố Hồ Chí Minh",
    },
    {
      icon: "Clock",
      title: "Thời gian làm việc",
      value: "8:00 - 18:00",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 mb-8">
          <Link
            href="/"
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <GetIconComponent icon="Home" size={20} />
            <span className="ml-1 text-sm font-medium">Trang chủ</span>
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-sm text-gray-600">Liên hệ</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Map Container */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="h-[600px] lg:h-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.5118067091507!2d105.78673797465657!3d21.04773198735363!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab3f1b5d9e47%3A0x6f4ae1c1a3aa87e4!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2jhu4cgxJDDtG5nIMOB!5e0!3m2!1svi!2s!4v1704811122297!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Contact Info Container */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
              Liên hệ với chúng tôi
            </h1>
            <div className="grid sm:grid-cols-2 gap-6">
              {contact.map((item, index) => (
                <div
                  key={index}
                  className="group p-4 rounded-xl border border-gray-100 hover:border-blue-500 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                      <GetIconComponent
                        icon={item.icon as keyof typeof Icon}
                        className="text-blue-600"
                        size={24}
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {item.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <FormContact />
          </div>
        </div>
      </div>
    </div>
  );
}
