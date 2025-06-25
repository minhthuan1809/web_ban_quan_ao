import { GetAllCode_API, getCouponById_API } from '@/app/_service/discount';
import useAuthInfor from '@/app/customHooks/AuthInfor';
import { Input, ModalBody, Modal, ModalContent, ModalHeader, ModalFooter, Button } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import FormatPrice from '@/app/_util/FormatPrice';

interface ModalChooseDiscountProps {
    isOpen: boolean;
    onClose: () => void;
    setDiscountCode: (discountCode: any) => void;
    discountCode: any;
    orderTotal: number;
    setDiscount: (discount: number) => void;
}

export default function ModalChooseDiscount({ isOpen, onClose, setDiscountCode, discountCode, orderTotal, setDiscount}: ModalChooseDiscountProps) {
    const [discountList, setDiscountList] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const { user: userInfo, accessToken } = useAuthInfor();

    useEffect(() => {
        const fetchDiscountList = async () => {
            if (!userInfo?.id || !accessToken) return;
            
            try {
                const res = await getCouponById_API(String(userInfo.id), accessToken);
                setDiscountList(res.data.content);
            } catch (error) {
                console.error('Error fetching discount list:', error);
            }
        }
        fetchDiscountList();
    }, [userInfo?.id, accessToken]);

    // Lọc mã giảm giá hợp lệ
    const validDiscounts = discountList?.filter(discount => {
        const currentDate = new Date();
        const validTo = new Date(discount.validTo);
        
        // Kiểm tra hết hạn
        const isNotExpired = validTo >= currentDate;
        
        // Kiểm tra đơn tối thiểu
        const meetsMinimum = orderTotal >= discount.minimumAmount;
        
        // Kiểm tra còn lượt sử dụng
        const hasUsageLeft = discount.usedCount < discount.maxUsageCount;
        
        return isNotExpired && meetsMinimum && hasUsageLeft;
    });

    const filteredDiscounts = validDiscounts?.filter(discount => 
        discount.code.toLowerCase().includes(search.toLowerCase()) ||
        discount.name.toLowerCase().includes(search.toLowerCase())
    );

    // Tính toán số tiền giảm
    const calculateDiscountAmount = (discount: any) => {
        if (discount.discountType === 'PERCENTAGE') {
            const discountAmount = (orderTotal * discount.discountValue) / 100;
            return Math.min(discountAmount, discount.maximumDiscount);
        } else {
            return Math.min(discount.discountValue, orderTotal);
        }
    };

    const handleSelectDiscount = (discount: any) => {
        const discountAmount = calculateDiscountAmount(discount);
        setDiscountCode({...discount, name: discount.code});
        setDiscount(discountAmount);
    };


    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="2xl"
        >
            <ModalContent>
                <ModalHeader>
                    <h2 className="text-xl font-semibold">Chọn mã giảm giá</h2>
                </ModalHeader>
                <ModalBody>
                    <div className="mb-4">
                        <Input
                            placeholder="Tìm kiếm mã giảm giá"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <p className="text-sm text-gray-600 mt-2">
                            Tổng đơn hàng: <FormatPrice price={orderTotal} currency="₫" />
                        </p>
                    </div>
                    
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {filteredDiscounts && filteredDiscounts.length > 0 ? (
                            filteredDiscounts.map((discount) => (
                                <div 
                                    key={discount.id}
                                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                        discountCode?.id === discount.id 
                                        ? 'border-blue-500 bg-blue-50' 
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    onClick={() => handleSelectDiscount(discount)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium text-gray-900">{discount.name}</h3>
                                            <p className="text-sm text-gray-600 mt-1">{discount.description}</p>
                                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                                                <p>Mã: <span className="font-medium text-blue-600">{discount.code}</span></p>
                                                <p>Giảm: {discount.discountType === 'PERCENTAGE' ? 
                                                    `${discount.discountValue}%` : 
                                                    <FormatPrice price={discount.discountValue} currency="₫" />
                                                }</p>
                                                <p>Đơn tối thiểu: <FormatPrice price={discount.minimumAmount} currency="₫" /></p>
                                                <p>Giảm tối đa: <FormatPrice price={discount.maximumDiscount} currency="₫" /></p>
                                                <p className="text-green-600 font-medium">
                                                    Bạn sẽ được giảm: <FormatPrice price={calculateDiscountAmount(discount)} currency="₫" />
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right text-sm text-gray-500">
                                            <p>HSD: {new Date(discount.validTo).toLocaleDateString('vi-VN')}</p>
                                            <p className="mt-1">Còn lại: {discount.maxUsageCount - discount.usedCount}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p>Không có mã giảm giá phù hợp</p>
                                <p className="text-sm mt-1">Mã giảm giá phải còn hạn, đủ đơn tối thiểu và còn lượt sử dụng</p>
                            </div>
                        )}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                        Đóng
                    </Button>
                    <Button color="primary" onPress={onClose}>
                        Xác nhận
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
