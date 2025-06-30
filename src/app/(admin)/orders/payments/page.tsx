"use client"
import React, { useState, useEffect, useCallback }  from 'react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button, Pagination       } from "@nextui-org/react";
import { Eye, FileText } from "lucide-react";
import showConfirmDialog from "@/app/_util/Sweetalert2";
import { getHistoryOrderVnpayResponseCode_API } from '@/app/_service/Oder';
import Loading from '@/app/_util/Loading';

export default function HistoryPay() {
    const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
    const [page, setPage] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [limit, setLimit] = useState<number>(15);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchPaymentHistory = useCallback(async (loading: boolean) => {
        try {
            setLoading(loading);
            const res = await getHistoryOrderVnpayResponseCode_API(page, limit);
            setTotal(res.totalPages);
            if (Array.isArray(res)) {
                setPaymentHistory(res);
            } else if (res && res.content && Array.isArray(res.content)) {
                setPaymentHistory(res.content);
            } else {
                setPaymentHistory([]);
            }
        } catch (error) {
            console.error("Lỗi khi tải lịch sử thanh toán:", error);
            setPaymentHistory([]); 
        } finally {
            setLoading(false);
        }
    }, [page, limit]);

    useEffect(() => {
        fetchPaymentHistory(false);
        const interval = setInterval(() => {
            fetchPaymentHistory(false);
        }, 2000); // Gọi lại API mỗi 2 giây

        return () => clearInterval(interval);
    }, [fetchPaymentHistory]);

    const getStatusColor = (status: string) => {
        switch(status) {
            case "00":
                return "success";
            case "PENDING":
                return "warning"; 
            default:
                return "danger";
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        // Format YYYYMMDDHHMMSS to Date
        const year = dateString.substring(0,4);
        const month = dateString.substring(4,6);
        const day = dateString.substring(6,8);
        const hour = dateString.substring(8,10);
        const minute = dateString.substring(10,12);
        const second = dateString.substring(12,14);
        
        const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    if(loading){
        return <Loading />
    }   

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const handleViewDetails = async (payment: any) => {
        await showConfirmDialog({
            title: 'Chi tiết giao dịch',
            html: `
                <div class="text-left">
                    <p><strong>Mã giao dịch:</strong> ${payment.transactionCode}</p>
                    <p><strong>Ngân hàng:</strong> ${payment.bankCode}</p>
                    <p><strong>Loại thẻ:</strong> ${payment.cardType}</p>
                    <p><strong>Số tiền:</strong> ${formatCurrency(payment.amount)}</p>
                    <p><strong>Trạng thái:</strong> ${payment.status === "00" ? "Thành công" : "Thất bại"}</p>
                    <p><strong>Thời gian:</strong> ${formatDate(payment.payDate)}</p>
                    <p><strong>Mã đơn hàng:</strong> ${payment.order?.code}</p>
                    <p><strong>Khách hàng:</strong> ${payment.order?.customerName}</p>
                </div>
            `,
            icon: 'info',
            confirmButtonText: 'Đóng'
        });
    };

    return (
        <div className="w-full p-4">
            {paymentHistory.length === 0 ? (
                <div className="text-center py-10">
                    <FileText size={48} color="#6B7280" />
                    <p className="mt-4 text-gray-600 text-lg">Không có dữ liệu giao dịch</p>
                </div>
            ) : (
                <Table
                    aria-label="Bảng lịch sử giao dịch VNPay"
                >
                    <TableHeader>
                        <TableColumn>Mã giao dịch</TableColumn>
                        <TableColumn>Ngân hàng</TableColumn>
                        <TableColumn>Mã đơn hàng</TableColumn>
                        <TableColumn>Khách hàng</TableColumn>
                        <TableColumn>Thời gian</TableColumn>
                        <TableColumn>Số tiền</TableColumn>
                        <TableColumn>Trạng thái</TableColumn>
                        <TableColumn>Thao tác</TableColumn>
                    </TableHeader>
                    <TableBody items={paymentHistory}>
                        {(item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.transactionCode}</TableCell>
                                <TableCell>{item.bankCode}</TableCell>
                                <TableCell>{item.order?.code}</TableCell>
                                <TableCell>{item.order?.customerName}</TableCell>
                                <TableCell>{formatDate(item.payDate)}</TableCell>
                                <TableCell>{formatCurrency(item.amount)}</TableCell>
                                <TableCell>
                                    <Chip color={getStatusColor(item.status) as any} variant="flat" size="sm">
                                        {item.status === "00" ? "Thành công" : "Thất bại"}
                                    </Chip>
                                </TableCell>
                                <TableCell>
                                    <Button 
                                        isIconOnly 
                                        size="sm" 
                                        variant="light" 
                                        onClick={() => handleViewDetails(item)}
                                    >
                                        <Eye size={18} />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                   
            )}
              {total > 1 && (
                <div className="flex justify-center mt-4">
                    <Pagination
                        total={total}
                        page={page}
                        onChange={(page) => setPage(page)}
                    />
                </div>
              )}
        </div>
    )
}
