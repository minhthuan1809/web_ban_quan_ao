"use client";

import InputGmail from "@/app/components/ui/InputGmail";
import InputInformation from "@/app/components/ui/InputInformation";
import InputPhone from "@/app/components/ui/InputPhone";
import { Button, Input, Textarea } from "@nextui-org/react";
import React, { useState } from "react";
import { createContact_API } from "@/app/_service/contact";
import { toast } from "react-toastify";

export default function FormContact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [address, setAddress] = useState("");
  const [subject, setSubject] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await createContact_API({
        "fullName": name,
        "email": email,
        "phoneNumber": phone,
        "address": address,
        "subject": subject,
        "message": message,
        "priority": "LOW"
      });
      
      if(res.status === 201){
        toast.success("Gửi liên hệ thành công");
        setName("");
        setEmail("");
        setPhone("");
        setAddress("");
        setSubject("");
        setMessage("");
      } else {
        toast.error("Gửi liên hệ thất bại");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi gửi liên hệ");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div>
      <div className="mt-2">
        <h1 className="text-2xl font-bold dark:text-white text-black mb-2">Gửi liên hệ</h1>
        <form className="space-y-2" onSubmit={handleSubmit}>
          <div className="w-full flex gap-2">
            <div className="w-full">
              <InputInformation
                placeholder="Họ tên"
                label="Họ tên"
                value={name}
                onChange={(value) => setName(value)}
                icon="User"
              />
            </div>
            <div className="w-full">
              <InputInformation
                placeholder="Địa chỉ"
                label="Địa chỉ"
                value={address}
                onChange={(value) => setAddress(value)}
                icon="MapPin"
              />
            </div>
          </div>
          <div className="w-full flex gap-2">
            <div className="w-full">
              <InputGmail
                placeholder="Email"
                label="Email"
                value={email}
                onChange={(value) => setEmail(value)}
              />
            </div>
            <div className="w-full">
              <InputPhone
                placeholder="Số điện thoại"
                label="Số điện thoại"
                value={phone}
                onChange={(value) => setPhone(value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Input
              placeholder="Tiêu đề"
              name="subject"
              label="Tiêu đề"
              value={subject}
              variant="bordered"
              labelPlacement="outside"
              className="w-full"
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="w-full">
            <Textarea
              className="col-span-12 md:col-span-6"
              label="Nội dung"
              labelPlacement="outside"
              placeholder="Nội dung"
              variant="bordered"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              minRows={4}
              maxRows={4}
            />
          </div>
          <Button className="block bg-blue-500 text-white px-4 py-2 rounded-md w-full" disabled={isLoading} type="submit">
            {isLoading ? "Đang gửi..." : "Gửi liên hệ"}
          </Button>
        </form>
      </div>
    </div>
  );
}
