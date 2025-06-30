'use client'
import { DeleteCard_API, GetCard_API, UpdateCard_API } from '@/app/_service/Card';
import useAuthInfor from '@/app/customHooks/AuthInfor';
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { toast } from 'react-toastify';
import { calculateCartItemPrice, calculateCartItemTotal, getOriginalPrice, hasDiscount } from '@/app/_util/CalculateCartPrice';
import FormatPrice from '@/app/_util/FormatPrice';
import CardPay from './cardPay';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@nextui-org/react';
import { ShoppingBag } from 'lucide-react';
import showConfirmDialog from '@/app/_util/Sweetalert2';
import { useCartStore } from '@/app/_zustand/client/CartStore';
import { createOrder_API } from '@/app/_service/Oder';
import { formatProductImageUrl } from '@/app/_util/formatImageUrl';

export default function Page() {
    const { user : userInfo, accessToken, syncFromLocalStorage } = useAuthInfor();
    const { setCartItems: setStoreCartItems, removeFromCart, updateQuantity } = useCartStore();
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [cartData, setCartData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    
    // Debug user state
    useEffect(() => {
        const createOrder = async () => {
        // User state tracking removed
        const data = sessionStorage.getItem('tempOrderData');
        if(data){
                const res = await createOrder_API(JSON.parse(data), Number(userInfo?.id), accessToken);     
                sessionStorage.removeItem('tempOrderData'); 
            }   
        }
        createOrder();
    }, [userInfo, accessToken]);
    
    // Force sync nếu cần thiết
    useEffect(() => {
        if (!userInfo && !accessToken && typeof window !== 'undefined') {
            const hasTokenInStorage = localStorage.getItem('accessToken');
            const hasUserInStorage = localStorage.getItem('user');
            
            if (hasTokenInStorage && hasUserInStorage) {
                syncFromLocalStorage();
                return;
            }
        }
        
        // Sau 2 giây nếu vẫn không có user thì redirect
        const timer = setTimeout(() => {
            if (!userInfo && !accessToken) {
                router.push('/login');
            }
        }, 2000);
        
        return () => clearTimeout(timer);
    }, [userInfo, accessToken, syncFromLocalStorage, router]);
    
    useEffect(() => {
        const fetchCard = async () => {
            try {
                if (!userInfo?.id) {
                    setLoading(false);
                    return;
                }
                
                const res = await GetCard_API(userInfo.id);
                if (res.data) {
                    setCartData(res.data);
                    if (res.data.cartItems) {
                        setCartItems(res.data.cartItems);
                        // Đồng bộ với Zustand store
                        setStoreCartItems(res.data.cartItems);
                    }
                }
            } catch (error) {
                // Error handling removed
            } finally {
                setLoading(false);
            }
        }   
        
        // Chỉ fetch khi có userInfo
        if (userInfo?.id) {
            fetchCard();
        } else {
            setLoading(false);
        }
    }, [userInfo])

    const handleQuantityChange = async (itemId: number, newQuantity: number, variantId: number, cartId: number) => {
        if (newQuantity < 1) return;
        
        try {
            const res = await UpdateCard_API(itemId.toString(), { quantity: newQuantity, variantId: variantId, cartId: cartId });
            const updatedItems = cartItems.map(item => 
                item.id === itemId ? {...item, quantity: newQuantity} : item    
            );
            setCartItems(updatedItems);
            // Cập nhật store
            updateQuantity(itemId, newQuantity);
        } catch (error) {
            toast.error("Không thể cập nhật số lượng");
        }
    }

    const handleDeleteItem = async (itemId: number) => {
        const result = await showConfirmDialog({
            title: 'Xác nhận xóa?',
            text: `Bạn có chắc chắn muốn xóa sản phẩm này?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        })  
        if (result.isConfirmed) {
        try {
            await DeleteCard_API(itemId.toString());
            const updatedItems = cartItems.filter(item => item.id !== itemId);
            setCartItems(updatedItems);
            // Cập nhật store
            removeFromCart(itemId);
        } catch (error) {
                toast.error("Không thể xóa sản phẩm");
            }
        }
    }

    const handleCheckItem = (itemId: number) => {
        setSelectedItems(prev => 
            prev.includes(itemId) 
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    }

    const handleSelectAll = () => {
        if (selectedItems.length === cartItems.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(cartItems.map(item => item.id));
        }
    }

    const calculateTotal = () => {
        return selectedItems.reduce((total, itemId) => {
            const item = cartItems.find(item => item.id === itemId);
            if (item) {
                return total + calculateCartItemTotal(item);
            }
            return total;
        }, 0);
    }

    // Show loading khi đang check auth hoặc sync data
    if (loading || (!userInfo && typeof window !== 'undefined' && (localStorage.getItem('accessToken') || localStorage.getItem('user')))) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải thông tin người dùng...</p>
                </div>
            </div>
        );
    }
    
    // Redirect nếu không có user sau khi đã load xong
    if (!userInfo) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Bạn cần đăng nhập để xem giỏ hàng</p>
                    <Button color="primary" onClick={() => router.push('/login')}>
                        Đăng nhập
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                        <ShoppingBag className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Giỏ hàng của bạn
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">Quản lý và thanh toán các sản phẩm yêu thích</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Cart Items */}
                    <div className="lg:col-span-3">
                        {/* Select All */}
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/30 p-6 mb-6">
                            <label className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                                    onChange={handleSelectAll}
                                    className="w-5 h-5 text-blue-600 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-blue-500 focus:ring-2"
                                />
                                <span className="font-semibold text-gray-800 dark:text-gray-200">
                                    Chọn tất cả ({selectedItems.length}/{cartItems.length})
                                </span>
                            </label>
                        </div>

                        {/* Cart Items List */}
                        <div className="space-y-6">
                            {cartItems.map((item) => (
                                <div key={item.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/30 hover:shadow-xl dark:hover:shadow-gray-900/30 transition-all duration-300">
                                    <div className="p-6">
                                        <div className="flex items-start gap-4">
                                            {/* Checkbox */}
                                            <div className="pt-2">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.includes(item.id)}
                                                    onChange={() => handleCheckItem(item.id)}
                                                    className="w-5 h-5 text-blue-600 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-blue-500 focus:ring-2"
                                                />
                                            </div>

                                            {/* Product Image */}
                                            <div className="w-28 h-28 relative flex-shrink-0">
                                                <Image
                                                    src={formatProductImageUrl(item.variant.product.imageUrls, 0)}
                                                    alt={item.variant.product.name}
                                                    fill
                                                    className="object-cover rounded-xl shadow-md"
                                                />
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-xl">
                                                        {item.variant.product.name}
                                                    </h3>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                                        ID: {item.id}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                    Thêm vào: {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                                                </p>
                                                
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                                                        Size: {item.variant.size.name}
                                                    </span>
                                                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium flex items-center gap-1">
                                                        <span>Màu:</span> 
                                                        <span>{item.variant.color.name}</span>
                                                        <div className="w-3 h-3 rounded-full border border-white dark:border-gray-600 shadow-sm" style={{backgroundColor: item.variant.color.hexColor}}></div>
                                                    </span>
                                                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                                                        Mùa: {item.variant.product.season}
                                                    </span>
                                                    <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 rounded-full text-sm font-medium">
                                                        {item.variant.product.category.name}
                                                    </span>
                                                    <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
                                                        {item.variant.product.team.name}
                                                    </span>
                                                    <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 rounded-full text-sm font-medium">
                                                        {item.variant.product.team.league}
                                                    </span>
                                                    <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium">
                                                        {item.variant.product.material.name}
                                                    </span>
                                                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                                                        Mã: {item.variant.product.code}
                                                    </span>
                                                </div>
                                                
                                                {/* Price */}
                                                <div className="flex items-center gap-3 mb-6">
                                                    <FormatPrice 
                                                        price={calculateCartItemPrice(item)} 
                                                        className="text-red-600 dark:text-red-400 text-xl font-bold" 
                                                        currency="₫" 
                                                    />
                                                    {hasDiscount(item) && (
                                                        <FormatPrice 
                                                            price={getOriginalPrice(item)} 
                                                            className="text-gray-400 dark:text-gray-500 line-through text-lg" 
                                                            currency="₫" 
                                                        />
                                                    )}
                                                    {hasDiscount(item) && (
                                                        <span className="text-sm font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded-full">
                                                            -{item.variant.product.salePrice}%
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center border-2 border-blue-200 dark:border-blue-700 rounded-xl overflow-hidden">
                                                        <button 
                                                            onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.variant.id, cartData.id)}
                                                            className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors font-bold"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            -
                                                        </button>
                                                        <span className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 font-bold min-w-[3rem] text-center">
                                                            {item.quantity}
                                                        </span>
                                                        <button 
                                                            onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.variant.id, cartData.id)}
                                                            className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors font-bold"
                                                            disabled={item.quantity >= item.variant.stockQuantity}
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    {/* Stock Info */}
                                                    <span className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                                                        Còn lại: {item.variant.stockQuantity}
                                                    </span>

                                                    {/* Delete Button */}
                                                    <button 
                                                        className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 p-3 rounded-xl transition-all duration-200" 
                                                        onClick={() => handleDeleteItem(item.id)}
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {cartItems.length === 0 && (
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/30 p-12 text-center">
                                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
                                    <ShoppingBag className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">Giỏ hàng trống</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">Hãy thêm một số sản phẩm vào giỏ hàng của bạn</p>
                                <Link 
                                    href="/products" 
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                                >
                                    <ShoppingBag size={18} />
                                    Khám phá sản phẩm
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <CardPay 
                        selectedItems={selectedItems}
                        calculateTotal={calculateTotal}
                        cartData={cartData}
                    />
                </div>
            </div>
        </div>
    )
}