"use client";

import InputGmail from "@/app/components/ui/InputGmail";
import InputInformation from "@/app/components/ui/InputInformation";
import InputPhone from "@/app/components/ui/InputPhone";
import { Button, Textarea } from "@nextui-org/react";
import React, { useState } from "react";

export default function FormContact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [address, setAddress] = useState("");
  return (
    <div>
      <div className="mt-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gửi liên hệ</h1>
        <form className="space-y-3">
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
          <Button className="block bg-blue-500 text-white px-4 py-2 rounded-md w-full">
            Gửi liên hệ
          </Button>
        </form>
      </div>
    </div>
  );
}
