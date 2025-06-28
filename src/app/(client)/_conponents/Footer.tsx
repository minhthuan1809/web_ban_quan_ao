import React from "react";
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";
import Image from "next/image";

export default function PageFooter() {
  return (
    <footer className="bg-muted py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand Section */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-4 mb-6">
              <Image 
                src="https://plus.unsplash.com/premium_photo-1687686676757-9d849a16e4ea?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGVyc2lvbnxlbnwwfHwwfHx8MA%3D%3D" 
                className="w-20 h-20 rounded-full border-4 border-card shadow-lg" 
                alt="KICKSTYLE Logo" 
                height={80}
                width={80}
              />
              <div>
                <p className="text-3xl font-extrabold text-card-foreground tracking-wider">KICKSTYLE</p>
                <p className="text-sm text-muted-foreground italic">Fashion & Style</p>
              </div>
            </div>
            <div className="flex space-x-6 mt-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                <Linkedin size={24} />
              </a>
            </div>
          </div>

          {/* About Us Section */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Về Chúng Tôi</h3>
            <p className="text-muted-foreground leading-relaxed">
              KICKSTYLE là thương hiệu thời trang hàng đầu, mang đến những sản phẩm chất lượng và phong cách độc đáo cho khách hàng.
            </p>
          </div>

          {/* Contact Section */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Liên Hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-center justify-center md:justify-start text-muted-foreground">
                <MapPin size={20} className="mr-2" />
                123 Đường ABC, Quận XYZ, TP.HCM
              </li>
              <li className="flex items-center justify-center md:justify-start text-muted-foreground">
                <Phone size={20} className="mr-2" />
                0123 456 789
              </li>
              <li className="flex items-center justify-center md:justify-start text-muted-foreground">
                <Mail size={20} className="mr-2" />
                contact@KICKSTYLE.com
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} KICKSTYLE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}