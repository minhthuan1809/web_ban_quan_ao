'use client';
import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Textarea, Spinner } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface Contact {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function ModalSentMail({
  isOpen,
  onOpenChange,
  contactData
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  contactData: Contact | null;
}) {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (contactData && isOpen) {
      setEmail(contactData.email);
      setSubject(`Phản hồi: ${contactData.subject}`);
      setContent(`Kính gửi ${contactData.fullName},\n\nCảm ơn bạn đã liên hệ với chúng tôi về vấn đề "${contactData.subject}".\n\n[Nội dung phản hồi của bạn ở đây]\n\nTrân trọng,\nĐội ngũ hỗ trợ`);
    }
  }, [contactData, isOpen]);

  const handleSendEmail = async () => {
    if (!email.trim()) {
      toast.error("Vui lòng nhập email người nhận");
      return;
    }
    if (!subject.trim()) {
      toast.error("Vui lòng nhập tiêu đề email");
      return;
    }
    if (!content.trim()) {
      toast.error("Vui lòng nhập nội dung email");
      return;
    }

    try {
      setLoading(true);
      // Gọi API gửi email ở đây
      // const response = await sendEmail_API({ email, subject, content });
      
      // Mô phỏng gửi email thành công
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Gửi email thành công");
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error("Lỗi khi gửi email:", error);
      toast.error("Có lỗi xảy ra khi gửi email");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setSubject("");
    setContent("");
  };

  const handleCancel = () => {
    onOpenChange(false);
    resetForm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="2xl"
      onClose={resetForm}
      classNames={{
        base: "bg-background",
        header: "border-b border-divider",
        footer: "border-t border-divider",
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-foreground">
              Gửi email phản hồi
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <Input
                  label="Email người nhận"
                  placeholder="Nhập email người nhận"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="bordered"
                  labelPlacement="outside"
                  classNames={{
                    label: "text-foreground font-medium",
                    input: "text-foreground",
                    inputWrapper: "bg-background"
                  }}
                  isRequired
                />
                <Input
                  label="Tiêu đề"
                  placeholder="Nhập tiêu đề email"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  variant="bordered"
                  labelPlacement="outside"
                  classNames={{
                    label: "text-foreground font-medium",
                    input: "text-foreground",
                    inputWrapper: "bg-background"
                  }}
                  isRequired
                />
                <Textarea
                  label="Nội dung"
                  placeholder="Nhập nội dung email"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  variant="bordered"
                  labelPlacement="outside"
                  minRows={8}
                  maxRows={12}
                  classNames={{
                    label: "text-foreground font-medium",
                    input: "text-foreground",
                    inputWrapper: "bg-background"
                  }}
                  isRequired
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button 
                color="danger" 
                variant="flat" 
                onClick={handleCancel}
                className="font-medium"
                isDisabled={loading}
              >
                Hủy
              </Button>
              <Button 
                color="primary" 
                onClick={handleSendEmail}
                className="font-medium"
                isLoading={loading}
              >
                {loading ? <Spinner size="sm" color="white" /> : "Gửi email"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
