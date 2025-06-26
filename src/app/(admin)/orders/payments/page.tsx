"use client"
import React, { useState, useEffect }  from 'react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button } from "@nextui-org/react";
import { Eye } from "lucide-react";
import showConfirmDialog from "@/app/_util/Sweetalert2";

export default function HistoryPay() {
    
    // Dữ liệu giả
    const fakePaymentHistory = [
        {
            id: "ORD-001",
            customerName: "Nguyễn Văn A",
            createdAt: "2023-10-15T08:30:00",
            amount: 1500000,
            status: "SUCCESS"
        },
        {
            id: "ORD-002",
            customerName: "Trần Thị B",
            createdAt: "2023-10-14T14:45:00",
            amount: 2300000,
            status: "PENDING"
        },
        {
            id: "ORD-003",
            customerName: "Lê Văn C",
            createdAt: "2023-10-13T10:20:00",
            amount: 850000,
            status: "FAILED"
        },
        {
            id: "ORD-004",
            customerName: "Phạm Thị D",
            createdAt: "2023-10-12T16:15:00",
            amount: 3200000,
            status: "SUCCESS"
        },
        {
            id: "ORD-005",
            customerName: "Hoàng Văn E",
            createdAt: "2023-10-11T09:10:00",
            amount: 1750000,
            status: "SUCCESS"
        }
    ];

    const getStatusColor = (status: string) => {
        switch(status) {
            case "SUCCESS":
                return "success";
            case "PENDING":
                return "warning";
            case "FAILED":
                return "danger";
            default:
                return "default";
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const handleViewDetails = async (id: string) => {
        await showConfirmDialog({
            title: 'Chi tiết giao dịch',
            text: `Xem chi tiết giao dịch ${id}`,
            icon: 'info',
            confirmButtonText: 'Đóng'
        });
    };

    return (
        <div className="w-full p-4">
         
            <Table
                aria-label="Bảng lịch sử chuyển tiền"
            >
                <TableHeader>
                    <TableColumn>Mã đơn</TableColumn>
                    <TableColumn>Khách hàng</TableColumn>
                    <TableColumn>Ngày tạo</TableColumn>
                    <TableColumn>Tổng tiền</TableColumn>
                    <TableColumn>Trạng thái</TableColumn>
                    <TableColumn>Thao tác</TableColumn>
                </TableHeader>
                <TableBody items={fakePaymentHistory}>
                    {(item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.customerName}</TableCell>
                            <TableCell>{formatDate(item.createdAt)}</TableCell>
                            <TableCell>{formatCurrency(item.amount)}</TableCell>
                            <TableCell>
                                <Chip color={getStatusColor(item.status) as any} variant="flat" size="sm">
                                    {item.status === "SUCCESS" ? "Thành công" : 
                                     item.status === "PENDING" ? "Đang xử lý" : "Thất bại"}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                <Button 
                                    isIconOnly 
                                    size="sm" 
                                    variant="light" 
                                    onClick={() => handleViewDetails(item.id)}
                                >
                                    <Eye size={18} />
                                </Button>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
