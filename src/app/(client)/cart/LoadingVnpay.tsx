"use client"
import React from 'react';
import { Modal, ModalContent, ModalBody } from '@nextui-org/react';
import { CreditCard, Loader2, CheckCircle, XCircle } from 'lucide-react';

interface LoadingVnpayProps {
  isOpen: boolean;
  onClose: () => void;
  status: 'loading' | 'success' | 'error';
  message?: string;
}

export default function LoadingVnpay({ isOpen, onClose, status, message }: LoadingVnpayProps) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={status === 'error' ? onClose : undefined}
      isDismissable={status === 'error'}
      hideCloseButton={status !== 'error'}
      backdrop="blur"
      placement="center"
      className="mx-4"
      classNames={{
        backdrop: "bg-black/80",
        base: "border-2 border-white/20 dark:border-gray-700/30 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md",
        body: "py-8"
      }}
    >
      <ModalContent>
        <ModalBody>
          <div className="flex flex-col items-center justify-center text-center space-y-6">
            {/* Icon & Animation */}
            <div className="relative">
              {status === 'loading' && (
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                    <CreditCard className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute inset-0 w-20 h-20 border-4 border-blue-300 rounded-full animate-spin border-t-transparent"></div>
                </div>
              )}
              
              {status === 'success' && (
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center animate-bounce">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
              )}
              
              {status === 'error' && (
                <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center animate-pulse">
                  <XCircle className="w-10 h-10 text-white" />
                </div>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              {status === 'loading' && (
                <>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Đang chuyển hướng thanh toán
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Vui lòng chờ trong giây lát...
                  </p>
                </>
              )}
              
              {status === 'success' && (
                <>
                  <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">
                    Chuyển hướng thành công
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Đang tải trang thanh toán VNPay
                  </p>
                </>
              )}
              
              {status === 'error' && (
                <>
                  <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">
                    Có lỗi xảy ra
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {message || "Không thể kết nối đến VNPay"}
                  </p>
                </>
              )}
            </div>

            {/* Loading dots */}
            {status === 'loading' && (
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            )}

            {/* VNPay Branding */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl p-4 border border-blue-200 dark:border-blue-700 w-full">
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">VNPay</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Thanh toán an toàn</p>
                </div>
              </div>
            </div>

            {/* Action Button for Error */}
            {status === 'error' && (
              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Đóng và thử lại
              </button>
            )}

            {/* Warning text */}
            {status === 'loading' && (
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm">
                Đừng đóng trang này. Bạn sẽ được chuyển hướng đến VNPay để thanh toán.
              </p>
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
