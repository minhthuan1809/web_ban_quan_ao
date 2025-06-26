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

export default function Page() {
    const { user : userInfo, accessToken, syncFromLocalStorage } = useAuthInfor();
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [cartData, setCartData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    
    // Debug user state
    useEffect(() => {
        console.log('🛒 [Cart] User state:', {
            userInfo: !!userInfo,
            accessToken: !!accessToken,
            userEmail: userInfo?.email,
            userId: userInfo?.id
        });
    }, [userInfo, accessToken]);
    
    // Force sync nếu cần thiết
    useEffect(() => {
        if (!userInfo && !accessToken && typeof window !== 'undefined') {
            const hasTokenInStorage = localStorage.getItem('accessToken');
            const hasUserInStorage = localStorage.getItem('user');
            
            console.log('🔍 [Cart] Checking localStorage:', {
                hasTokenInStorage: !!hasTokenInStorage,
                hasUserInStorage: !!hasUserInStorage
            });
            
            if (hasTokenInStorage && hasUserInStorage) {
                console.log('🔄 [Cart] Force sync từ localStorage');
                syncFromLocalStorage();
                return;
            }
        }
        
        // Sau 2 giây nếu vẫn không có user thì redirect
        const timer = setTimeout(() => {
            if (!userInfo && !accessToken) {
                console.log('🚫 [Cart] No user found, redirecting to login');
                router.push('/login');
            }
        }, 2000);
        
        return () => clearTimeout(timer);
    }, [userInfo, accessToken, syncFromLocalStorage, router]);
    
    useEffect(() => {
        const fetchCard = async () => {
            try {
                console.log("🛒 [Cart] Fetching cart for user:", userInfo?.email);
                if (!userInfo?.id) {
                    console.log("🚫 [Cart] No user ID available");
                    setLoading(false);
                    return;
                }
                
                const res = await GetCard_API(userInfo.id);
                if (res.data) {
                    setCartData(res.data);
                    if (res.data.cartItems) {
                        setCartItems(res.data.cartItems);
                    }
                }
            } catch (error) {
                console.error('Lỗi khi tải giỏ hàng:', error);
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
            setCartItems(cartItems.map(item => 
                item.id === itemId ? {...item, quantity: newQuantity} : item    
            ));
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
            setCartItems(cartItems.filter(item => item.id !== itemId));
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
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 ">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <ShoppingBag className="w-5 h-5 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold">Giỏ hàng của bạn</h1>
                   
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Cart Items */}
                    <div className="lg:col-span-3">
                   

                        {/* Select All */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                            <label className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                                    onChange={handleSelectAll}
                                    className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <span className="font-medium text-gray-700">
                                    Chọn tất cả ({selectedItems.length}/{cartItems.length})
                                </span>
                            </label>
                        </div>

                        {/* Cart Items List */}
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                                    <div className="p-4">
                                        <div className="flex items-start gap-4">
                                            {/* Checkbox */}
                                            <div className="pt-2">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.includes(item.id)}
                                                    onChange={() => handleCheckItem(item.id)}
                                                    className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                />
                                            </div>

                                            {/* Product Image */}
                                            <div className="w-24 h-24 relative flex-shrink-0">
                                                <Image
                                                    src={item.variant.product.imageUrls[0]}
                                                    alt={item.variant.product.name}
                                                    fill
                                                    className="object-cover rounded-lg"
                                                />
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h3 className="font-medium text-gray-900 text-lg">
                                                        {item.variant.product.name}
                                                    </h3>
                                                    <span className="text-xs text-gray-500">
                                                        ID: {item.id}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 mb-3">
                                                    Thêm vào: {new Date(item.createdAt).toLocaleDateString()}
                                                </p>
                                                
                                                <div className="flex flex-col gap-2 mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                                                            Size: {item.variant.size.name}
                                                        </span>
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm flex items-center gap-1">
                                                            <span>Màu:</span> 
                                                            <span>{item.variant.color.name}</span>
                                                            <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.variant.color.hexColor}}></div>
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                                                            Mùa: {item.variant.product.season}
                                                        </span>
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                                                            Danh mục: {item.variant.product.category.name}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                                                            Đội: {item.variant.product.team.name}
                                                        </span>
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                                                            Giải đấu: {item.variant.product.team.league}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                                                            Chất liệu: {item.variant.product.material.name}
                                                        </span>
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                                                            Mã SP: {item.variant.product.code}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                {/* Price */}
                                                <div className="flex items-center gap-3 mb-4">
                                                    <FormatPrice 
                                                        price={calculateCartItemPrice(item)} 
                                                        className="text-red-600 text-lg font-medium" 
                                                        currency="₫" 
                                                    />
                                                    {hasDiscount(item) && (
                                                        <FormatPrice 
                                                            price={getOriginalPrice(item)} 
                                                            className="text-gray-400 line-through" 
                                                            currency="₫" 
                                                        />
                                                    )}
                                                    {hasDiscount(item) && (
                                                        <span className="text-sm font-medium text-green-600">
                                                            -{item.variant.product.salePrice}%
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center border border-gray-300 rounded">
                                                        <button 
                                                            onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.variant.id, cartData.id)}
                                                            className="px-3 py-1 text-gray-600 hover:bg-gray-50"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            -
                                                        </button>
                                                        <span className="px-3 py-1 bg-gray-50 text-gray-900 font-medium min-w-[2.5rem] text-center">
                                                            {item.quantity}
                                                        </span>
                                                        <button 
                                                            onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.variant.id, cartData.id)}
                                                            className="px-3 py-1 text-gray-600 hover:bg-gray-50"
                                                            disabled={item.quantity >= item.variant.stockQuantity}
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    {/* Stock Info */}
                                                    <span className="text-sm text-gray-500">
                                                        Còn lại: {item.variant.stockQuantity}
                                                    </span>

                                                    {/* Delete Button */}
                                                    <button className="text-red-500 hover:text-red-700 p-2" onClick={() => handleDeleteItem(item.id)}>
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
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                                <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V18C19 19.1 18.1 20 17 20H7C5.9 20 5 19.1 5 18V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V18H17V6H7Z"/>
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Giỏ hàng trống</h3>
                                <p className="text-gray-600">Hãy thêm một số sản phẩm vào giỏ hàng của bạn</p>
                                <Link href="/products" className="text-blue-600 hover:text-blue-700">Thêm sản phẩm</Link>
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