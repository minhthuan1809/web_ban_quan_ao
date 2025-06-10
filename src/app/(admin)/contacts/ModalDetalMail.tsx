import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Card,
  CardBody,
  Button,
  Chip,
  Divider,
} from "@nextui-org/react";
import React from "react";
import { Contact } from "./typecontac";
import { Send, User, Calendar, MapPin } from "lucide-react";

export default function ModalDetalMail({
  isDetailModalOpen,
  setIsDetailModalOpen,
  selectedContact,
}: {
  isDetailModalOpen: boolean;
  setIsDetailModalOpen: (open: boolean) => void;
  selectedContact: Contact | null | null;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
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
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      {" "}
      <Modal
        isOpen={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        size="2xl"
        classNames={{
          base: "bg-background",
          header: "border-b border-divider",
          body: "py-6",
        }}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-foreground">
                Chi tiết liên hệ
              </ModalHeader> 
              <ModalBody>
                {selectedContact && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm text-default-500 mb-1">
                          Mã liên hệ
                        </h3>
                        <p className="text-foreground">{selectedContact.id}</p>
                      </div>
                      <div>
                        <h3 className="text-sm text-default-500 mb-1">
                          Trạng thái
                        </h3>
                        <Chip
                          color={getStatusColor(selectedContact.status) as any}
                          variant="flat">
                          {selectedContact.status === "PENDING"
                            ? "Chờ xử lý"
                            : selectedContact.status === "PROCESSING"
                            ? "Đang xử lý"
                            : selectedContact.status === "RESOLVED"
                            ? "Đã xử lý"
                            : "Từ chối"}
                        </Chip>
                      </div>
                      <div>
                        <h3 className="text-sm text-default-500 mb-1">
                          Mức độ ưu tiên
                        </h3>
                        <Chip
                          color={getPriorityColor(selectedContact.priority) as any}
                          variant="flat">
                          {selectedContact.priority === "HIGH"
                            ? "Cao"
                            : selectedContact.priority === "MEDIUM"
                            ? "Trung bình"
                            : "Thấp"}
                        </Chip>
                      </div>
                      <div>
                        <h3 className="text-sm text-default-500 mb-1">
                          Người phụ trách
                        </h3>
                        {selectedContact.assignedToName ? (
                          <div className="flex items-center gap-1">
                            <User size={14} />
                            <span>{selectedContact.assignedToName}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">Chưa phân công</span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm text-default-500 mb-1">
                          Họ tên
                        </h3>
                        <p className="text-foreground">
                          {selectedContact.fullName}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm text-default-500 mb-1">Email</h3>
                        <p className="text-foreground">
                          {selectedContact.email}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm text-default-500 mb-1">
                          Số điện thoại
                        </h3>
                        <p className="text-foreground">
                          {selectedContact.phoneNumber}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm text-default-500 mb-1">
                          Địa chỉ
                        </h3>
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          <p className="text-foreground">
                            {selectedContact.address || "Không có"}
                          </p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm text-default-500 mb-1">
                          Thời gian tạo
                        </h3>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <p className="text-foreground">
                            {formatDate(selectedContact.createdAt)}
                          </p>
                        </div>
                      </div>
                      {selectedContact.resolvedAt && (
                        <div>
                          <h3 className="text-sm text-default-500 mb-1">
                            Thời gian xử lý
                          </h3>
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <p className="text-foreground">
                              {formatDate(selectedContact.resolvedAt)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm text-default-500 mb-1">Tiêu đề</h3>
                      <p className="text-foreground">
                        {selectedContact.subject}
                      </p>
                    </div>

                    <Card className="bg-default-50">
                      <CardBody>
                        <h3 className="text-sm text-default-500 mb-2">
                          Nội dung
                        </h3>
                        <p className="text-foreground whitespace-pre-wrap">
                          {selectedContact.message}
                        </p>
                      </CardBody>
                    </Card>

                    {selectedContact.replies && selectedContact.replies.length > 0 && (
                      <div className="space-y-4">
                        <Divider />
                        <h3 className="text-medium font-semibold">Lịch sử phản hồi</h3>
                        {selectedContact.replies.map((reply) => (
                          <Card key={reply.id} className="bg-primary-50">
                            <CardBody>
                              <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-1">
                                  <User size={14} />
                                  <span className="font-medium">{reply.adminName}</span>
                                </div>
                                <div className="text-xs text-default-500">
                                  {formatDate(reply.createdAt)}
                                </div>
                              </div>
                              <p className="whitespace-pre-wrap">
                                {reply.replyMessage}
                              </p>
                              {reply.isEmailSent && (
                                <div className="flex items-center gap-1 mt-2 text-xs text-success">
                                  <Send size={12} />
                                  <span>Email đã gửi lúc {formatDate(reply.emailSentAt)}</span>
                                </div>
                              )}
                            </CardBody>
                          </Card>
                        ))}
                      </div>
                    )}

                    
                  </div>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>{" "}
    </div>
  );
}
