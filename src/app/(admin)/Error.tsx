import React from "react";
import Link from "next/link";

export default function Error() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 h-screen flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 animate-pulse">
            404
          </h1>
          <h2 className="text-4xl font-semibold text-card-foreground mt-6">
            Trang không tồn tại
          </h2>
          <p className="text-muted-foreground mt-4 mb-8 max-w-lg mx-auto">
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc bạn không đủ
            quyền truy cập.
          </p>
          <Link
            href="/"
            className="btn-primary px-8 py-3"
          >
            Trở về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
