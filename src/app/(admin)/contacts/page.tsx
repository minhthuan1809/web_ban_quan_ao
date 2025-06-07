"use client";

import { getContacts_API } from '@/app/_service/contact';
import React, { useEffect, useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Chip, Tooltip, Button, Modal, ModalContent, ModalHeader, ModalBody, Card, CardBody } from "@nextui-org/react";
import { Eye, Mail, Send } from "lucide-react";
import TitleSearchAdd from '@/app/components/ui/TitleSearchAdd';
import ModalSentMail from '../_modal/ModalSentMail';
import { Contact } from './typecontac'; 
import ModalDetalMail from './ModalDetalMail';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [isMailModalOpen, setIsMailModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      try {
        const res = await getContacts_API({
          page: page - 1,
          size: rowsPerPage,
          search: searchValue
          });
        setContacts(res.data.content);
        setTotalPages(res.data.totalPages);
      } catch (error) { 
        console.error("Lỗi khi tải danh sách liên hệ:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchContacts();
  }, [page, searchValue]);

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

  return (
    <div className="p-4">
      <TitleSearchAdd
        title={{
          title: "Liên hệ",
          search: "Tìm kiếm liên hệ...",
          btn: "Gửi email"
        }}
        onSearch={(value) => setSearchValue(value)}
        onAdd={() => {
          setSelectedContact(null);
          setIsMailModalOpen(true);
        }}  
      />  
      <Table
        aria-label="Bảng danh sách liên hệ"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={totalPages}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
      >
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Họ tên</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>SĐT</TableColumn>
          <TableColumn>Tiêu đề</TableColumn>
          <TableColumn>Trạng thái</TableColumn>
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
              <TableCell className="max-w-[200px] truncate">{contact.subject}</TableCell>
              <TableCell>
                <Chip color={getStatusColor(contact.status) as any} variant="flat">
                  {contact.status === "PENDING" ? "Chờ xử lý" : 
                   contact.status === "PROCESSING" ? "Đang xử lý" :
                   contact.status === "RESOLVED" ? "Đã xử lý" : "Từ chối"}
                </Chip>
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
