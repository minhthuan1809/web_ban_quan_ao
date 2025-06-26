"use client";

import { getContacts_API } from '@/app/_service/contact';
import useAuthInfor from '@/app/customHooks/AuthInfor';
import React, { useEffect, useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Chip, Tooltip, Button, Modal, ModalContent, ModalHeader, ModalBody, Card, CardBody } from "@nextui-org/react";
import { Eye, Mail, Send, User } from "lucide-react";
import TitleSearchAdd from '@/app/components/ui/TitleSearchAdd';
import ModalSentMail from '../../_modal/ModalSentMail';
import type { AdminContact as Contact } from '../../../../types/contact'; 
import ModalDetalMail from '../../_modal/ModalDetalMail';
import { ContactSkeleton } from '../../_skeleton';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [isMailModalOpen, setIsMailModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const rowsPerPage = 10;
  const { accessToken } = useAuthInfor();

  useEffect(() => {
    const fetchContacts = async () => {
      if (!accessToken) return;
      
      setLoading(true);
      try {
        const res = await getContacts_API({
          page: page - 1,
          size: rowsPerPage,
          search: searchValue
          }, accessToken);
        setContacts(res.content);
        setTotalPages(res.totalPages);
      } catch (error) { 
        console.error("Lỗi khi tải danh sách liên hệ:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchContacts();
  }, [page, searchValue, accessToken]);

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
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewDetail = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDetailModalOpen(true);
  };

  const handleSendEmail = (contact: Contact) => {
    setSelectedContact(contact);
    setIsMailModalOpen(true);
  };

  if (loading) {
    return <ContactSkeleton />;
  }

  return (
    <div className="p-4">
      <TitleSearchAdd
        title={{
          title: "Liên hệ",
          search: "Tìm kiếm liên hệ...",
        }}
        onSearch={(value) => setSearchValue(value)}
 
      />  
      <Table
        aria-label="Bảng danh sách liên hệ"
        bottomContent={
         totalPages < 1 &&   
         (<div className='flex justify-center mt-4'>
          <Pagination
               color="primary"
               page={page + 1}
               total={totalPages}
               onChange={(newPage) => setPage(newPage - 1)}
             />
          </div>)
        }
      >
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Họ tên</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>SĐT</TableColumn>
          <TableColumn>Địa chỉ</TableColumn>
          <TableColumn>Tiêu đề</TableColumn>
          <TableColumn>Mức độ</TableColumn>
          <TableColumn>Trạng thái</TableColumn>
          <TableColumn>Người xử lý</TableColumn>
          <TableColumn>Thời gian</TableColumn>
          <TableColumn>Thao tác</TableColumn>
        </TableHeader>
        <TableBody 
          items={contacts} 
          emptyContent={"Không có dữ liệu liên hệ"}
          isLoading={loading}
        >
          {(contact) => (
            <TableRow key={contact.id}>
              <TableCell>{contact.id}</TableCell>
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
                   contact.status === "COMPLETED" ? "Đã xử lý" : "Đã đóng"}
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
              <TableCell>
                <div className="flex gap-2">
                  <Tooltip content="Xem chi tiết">
                    <Button isIconOnly size="sm" variant="light" onClick={() => handleViewDetail(contact)}>
                      <Eye size={18} />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Gửi email">
                    <Button isIconOnly size="sm" variant="light" onClick={() => handleSendEmail(contact)}>
                      <Mail size={18} />
                    </Button>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Modal xem chi tiết liên hệ */}
     <ModalDetalMail 
        isDetailModalOpen={isDetailModalOpen}
        setIsDetailModalOpen={setIsDetailModalOpen}
        selectedContact={selectedContact}
      />

      {/* Modal gửi email */}
      <ModalSentMail  
        isOpen={isMailModalOpen}
        onOpenChange={setIsMailModalOpen}
        contactData={selectedContact}
      />  
    </div>
  );
}
