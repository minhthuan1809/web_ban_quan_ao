import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import React, { useState } from "react";
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import { UserPlus, Edit3, User, Mail, Phone, MapPin, Lock } from "lucide-react";
import InputAddress from "@/app/components/ui/InputAddress";
import { CreateUser_API, UpdateUser_API } from "@/app/_service/user";
import ImgUpload from "@/app/components/ui/ImgUpload";
import { toast } from "react-toastify";
import InputPassword from "@/app/components/ui/InputPassword";
import InputPhone from "@/app/components/ui/InputPhone";
import InputGmail from "@/app/components/ui/InputGmail";
import InputGender from "@/app/components/ui/InputGender";
import { uploadToCloudinary } from "@/app/_util/upload_img_cloudinary";

export default function ModalAddUse({
  isOpen,
  onClose,
  modalMode,
  formData,
  setFormData,
  accessToken,
}: any) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    if (!file) return;
    const newUploadedImages = await uploadToCloudinary([file], process.env.NEXT_PUBLIC_FOLDER || "");
    formData.avatarUrl = newUploadedImages[0] || "";
    try {
      setLoading(true);
      const res = await CreateUser_API(formData, accessToken);
      if (res.status === 200) {
        toast.success("Thêm người dùng thành công!");
        onClose();
      } else {
        toast.error("Thêm người dùng thất bại!");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thêm người dùng!");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!file) return;
    const newUploadedImages = await uploadToCloudinary([file], process.env.NEXT_PUBLIC_FOLDER || "");
    formData.avatarUrl = newUploadedImages[0] || "";
    try {
      setLoading(true);
      const res = await UpdateUser_API(formData, accessToken, formData.id);
      if (res.status === 200) {
        toast.success("Cập nhật người dùng thành công!");
        onClose();
      } else {
        toast.error("Cập nhật người dùng thất bại!");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật người dùng!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[80vh] overflow-hidden">
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        placement="center"
        size="2xl"
        scrollBehavior="inside"
        classNames={{
          base: "bg-background",
          header: "border-b border-border",
          body: "py-6",
          footer: "border-t border-border",
          closeButton: "hover:bg-default-100",
          backdrop: "bg-background/80 backdrop-blur-md",
        }}>
        <ModalContent>
          <ModalHeader className="text-xl font-bold">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                {modalMode === "add" ? (
                  <UserPlus className="w-5 h-5 text-primary" />
                ) : (
                  <Edit3 className="w-5 h-5 text-primary" />
                )}
              </div>
              {modalMode === "add"
                ? "Thêm người dùng mới"
                : "Chỉnh sửa thông tin người dùng"}
            </div>
          </ModalHeader>
          <ModalBody className="space-y-4">
            <div className="w-full flex justify-center items-center h-[150px]">
              <ImgUpload
                setPreview={setPreview}
                preview={preview}
                setFile={setFile}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Họ và tên"
                placeholder="Nhập họ và tên đầy đủ"
                type="text"
                value={formData.fullName}
                labelPlacement={"outside"}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                variant="bordered"
                isRequired
                startContent={<User className="w-4 h-4 text-default-400" />}
                classNames={{
                  label: "text-default-700 font-medium",
                  input: "text-default-800",
                }}
              />
              <InputGmail
                label="Email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e })}
              />
            </div>

            {modalMode === "add" && (
              <InputPassword
                label="Mật khẩu"
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e })}
              />
            )}

            <InputPhone
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e })}
            />

              <InputAddress
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: e.city.cityName,
                    district: e.district.districtName,
                    ward: e.ward.wardName,
                  })
                }
              />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 -mt-4">
                Vai trò
              </label>
              <Select
                placeholder="Chọn vai trò"
                size="sm"
                value={formData.roleId}
                onChange={(e) =>
                  setFormData({ ...formData, roleId: Number(e.target.value) })
                }
                variant="bordered"
                labelPlacement="outside"
                classNames={{
                  label: "text-default-700 font-medium",
                  trigger: "h-12",
                }}>
                <SelectItem key={1} value="USER">
                  Người dùng
                </SelectItem>
                <SelectItem key={2} value="ADMIN">
                  Quản trị viên
                </SelectItem>
              </Select>
            </div>

            <InputGender
              label="Giới tính"
              placeholder="Nhập giới tính"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e })}
            />
          </ModalBody>
          <ModalFooter className="gap-3">
            <Button
              color="danger"
              variant="bordered"
              onPress={onClose}
              className="font-medium">
              Hủy bỏ
            </Button>
            <Button
              color="primary"
              onPress={modalMode === "add" ? handleSubmit : handleEdit}
              isLoading={loading}
              className="font-semibold px-6">
              {modalMode === "add" ? "Thêm người dùng" : "Lưu thay đổi"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
