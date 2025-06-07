import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Card,
  CardBody,
  Button,
  Chip,
} from "@nextui-org/react";
import React from "react";
import { Contact } from "./typecontac";
import { Send } from "lucide-react";

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
                          Thời gian
                        </h3>
                        <p className="text-foreground">
                          {formatDate(selectedContact.createdAt)}
                        </p>
                      </div>
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

                    <div className="flex justify-end">
                      <Button
                        color="primary"
                        endContent={<Send size={16} />}
                        onClick={() => {
                          onClose();
                          setIsDetailModalOpen(true);
                        }}>
                        Phản hồi email
                      </Button>
                    </div>
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
