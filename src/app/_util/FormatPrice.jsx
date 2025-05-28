import React from 'react'

export default function FormatPrice({
    price,
    className = "text-blue-600 text-lg font-semibold tracking-tight",
    currency = "₫",
}) {
  return (
    <div className={`${className} flex items-center gap-1`}>
      <span>{new Intl.NumberFormat('vi-VN').format(price)}</span>
      <span className={currency}></span>
    </div>
  )
}
