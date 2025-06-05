import React from "react";

export default function FormatPrice({
  price,
  className = "text-blue-600 text-lg font-semibold tracking-tight",
  currency = "₫",
}) {
  return (
    <div className={`${className} flex items-center gap-1`}>
      <span className="flex items-center gap-1">
        {new Intl.NumberFormat("vi-VN", {
          maximumFractionDigits: 0,
          minimumFractionDigits: 0
        }).format(price)}
        <span className="text-md">{currency}</span>
      </span>
    </div>
  );
}
