"use client";
import React, { useEffect, useState } from 'react'
import { getHistoryContact_API } from '@/app/_service/contact';
import useAuthInfor from '@/app/customHooks/AuthInfor';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Chip, Tooltip, Button, Input } from "@nextui-org/react";
import { Eye, Mail, User } from "lucide-react";
import { Contact } from '../typecontact';
import TitleSearchAdd from '@/app/components/ui/TitleSearchAdd';

export default function HistoryContact() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const rowsPerPage = 10;
    const [searchValue, setSearchValue] = useState("");
    const { accessToken, user : userInfo } = useAuthInfor();
    
    useEffect(() => {
        const fetchHistoryContact = async () => {
            if (!accessToken || !userInfo?.email) return;
            
            setLoading(true);
            try {
                const res = await getHistoryContact_API(searchValue, accessToken, userInfo.email);
                setContacts(res.content);
                setTotalPages(res.totalPages);
            } catch (error) {
                console.error("Lỗi khi tải lịch sử liên hệ:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchHistoryContact();
    }, [page, searchValue, accessToken, userInfo]);

    const getStatusColor = (status: string) => {
        switch(status) {
            case "PENDING":
                return "warning";
            case "PROCESSING":
                return "primary";
            case "RESOLVED":
                return "success";
            case "REJECTED":
                return "danger";
            default:
                return "default";
        }
    };

    const getPriorityColor = (priority: string) => {
        switch(priority) {
            case "HIGH":
                return "danger";
            case "MEDIUM":
                return "warning";
            case "LOW":
                return "success";
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

    return (
        <div className="w-full">
            <TitleSearchAdd
                title={{
                    title: "Lịch sử liên hệ",
                    search: "Tìm kiếm lịch sử liên hệ...",
                }}
                onSearch={(value) => setSearchValue(value)}
            />
            <Table
                aria-label="Bảng lịch sử liên hệ"
            >
                <TableHeader>
                    <TableColumn>Họ tên</TableColumn>
                    <TableColumn>Email</TableColumn>
                    <TableColumn>SĐT</TableColumn>
                    <TableColumn>Địa chỉ</TableColumn>
                    <TableColumn>Tiêu đề</TableColumn>
                    <TableColumn>Mức độ</TableColumn>
                    <TableColumn>Trạng thái</TableColumn>
                    <TableColumn>Người xử lý</TableColumn>
                    <TableColumn>Thời gian</TableColumn>
                </TableHeader>
                <TableBody 
                    items={contacts} 
                    emptyContent={"Không có dữ liệu lịch sử liên hệ"}
                    isLoading={loading}
                >
                    {(contact) => (
                        <TableRow key={contact.id}>
                            <TableCell>{contact.fullName}</TableCell>
                            <TableCell>{contact.email}</TableCell>
                            <TableCell>{contact.phoneNumber}</TableCell>
                            <TableCell className="max-w-[150px] truncate">{contact.address}</TableCell>
                            <TableCell className="max-w-[150px] truncate">{contact.subject}</TableCell>
                            <TableCell>
                                <Chip color={getPriorityColor(contact.priority) as any} variant="flat" size="sm">
                                    {contact.priority === "HIGH" ? "Cao" : 
                                    contact.priority === "MEDIUM" ? "Trung bình" : "Thấp"}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                <Chip color={getStatusColor(contact.status) as any} variant="flat" size="sm">
                                    {contact.status === "PENDING" ? "Chờ xử lý" : 
                                    contact.status === "PROCESSING" ? "Đang xử lý" :
                                    contact.status === "COMPLETED" ? "Đã xử lý" : "Từ chối"}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                {contact.assignedToName ? (
                                    <div className="flex items-center gap-1">
                                        <User size={14} />
                                        <span>{contact.assignedToName}</span>
                                    </div>
                                ) : (
                                    <span className="text-gray-400 text-xs">Chưa phân công</span>
                                )}
                            </TableCell>
                            <TableCell>{formatDate(contact.createdAt)}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
           {
            totalPages > 1 &&   
            <div className='flex justify-center mt-4'>
            <Pagination
                 showShadow
                 color="primary"
                 page={page}
                 total={totalPages}
                 onChange={(page) => setPage(page)}
             />
            </div>
           }
        </div>
    )
}
