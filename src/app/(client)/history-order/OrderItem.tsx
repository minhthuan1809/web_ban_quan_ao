"use client"
import Link from 'next/link';
import React, { useState } from 'react';
import { format } from 'date-fns';
import ModalEvaluate from '../_modal/ModalEvaluate';

interface OrderItemProps {
  order: any;
  statusMap: Record<string, { label: string; color: string }>;
}

export default function OrderItem({ order, statusMap }: OrderItemProps) {

  const formatDate = (timestamp: number) => format(new Date(timestamp), 'dd/MM/yyyy HH:mm');
  const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h3 className="font-semibold text-gray-900">#{order.code}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusMap[order.status as keyof typeof statusMap]?.color || 'bg-gray-100 text-gray-700'}`}>
                {statusMap[order.status as keyof typeof statusMap]?.label || order.status}
              </span>
            </div>
            <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
              order.paymentStatus === 'PAID' 
                ? 'bg-green-100 text-green-700 border-green-200' 
                : 'bg-yellow-100 text-yellow-700 border-yellow-200'
            }`}>
              {order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
            </span>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">{formatCurrency(order.totalAmount)}</p>
              <p className="text-sm text-gray-500">{order.orderItems.length} sản phẩm</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Order Items */}
      <div className="p-6">
        <div className="space-y-4">
          {order.orderItems.map((item: any) => (
            <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center border border-gray-200 flex-shrink-0">
                <span className="text-xs text-gray-500 font-mono">{item.variantInfo.productCode}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">{item.productName}</h4>
                <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    {item.variantInfo.colorName}
                  </span>
                  <span>Size: {item.variantInfo.sizeName}</span>
                  <span>SL: {item.quantity}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-semibold text-gray-900">{formatCurrency(item.unitPrice)}</p>
                {item.quantity > 1 && (
                  <p className="text-sm text-gray-500">x{item.quantity}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          <div className="flex-1 space-y-1 text-sm text-gray-600">
            <p><span className="font-medium">Thanh toán:</span> {order.paymentMethodName}</p>
            <p><span className="font-medium">Địa chỉ:</span> {order.shippingAddress}, {order.shippingWard}, {order.shippingDistrict}</p>
            {order.note && <p><span className="font-medium">Ghi chú:</span> {order.note}</p>}
          </div>
          <div className="lg:text-right space-y-1">
            <div className="flex justify-between lg:justify-end lg:gap-8 text-sm">
              <span className="text-gray-600">Tạm tính:</span>
              <span className="font-medium">{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between lg:justify-end lg:gap-8 text-sm">
                <span className="text-gray-600">Giảm giá:</span>
                <span className="font-medium text-red-600">-{formatCurrency(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between lg:justify-end lg:gap-8 text-base font-bold border-t pt-2">
              <span>Tổng cộng:</span>
              <span className="text-blue-600">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>
        {!order.isReviewed  && (
          <div className="mt-4 flex justify-end">
            <button 
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Đánh giá đơn hàng
            </button>
          </div>
        )}
      </div>
        <ModalEvaluate isOpen={isOpen} onClose={() => setIsOpen(false)} orderId={order.id} />
    </div>
  );
} 