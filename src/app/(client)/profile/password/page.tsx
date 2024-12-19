import InputPassword from "@/app/components/ui/InputPassword";
import { Input } from "@nextui-org/react";
import * as Icon from "lucide-react";
import React from "react";

export default function Password() {
  return (
    <div>
      <div>
        <h1>
          <Icon.Lock />
          Thay đổi mật khẩu
        </h1>
        <p>Vui lòng nhập mật khẩu hiện tại và mật khẩu mới của bạn</p>
      </div>
      <div></div>
    </div>
  );
}
