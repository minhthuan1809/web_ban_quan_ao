import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import React, { useState } from "react";
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import { UserPlus, Edit3, User } from "lucide-react";
import InputAddress from "@/app/components/ui/InputAddress";
import { CreateUser_API, UpdateUser_API } from "@/app/_service/user";
import ImgUpload from "@/app/components/ui/ImgUpload";
import { toast } from "react-toastify";
import InputPassword from "@/app/components/ui/InputPassword";
import InputPhone from "@/app/components/ui/InputPhone";
import InputGmail from "@/app/components/ui/InputGmail";
import InputGender from "@/app/components/ui/InputGender";
import { uploadToCloudinary } from "@/app/_util/upload_img_cloudinary";

interface ModalAddUseProps {
  editUser: any;
  isOpen: boolean;
  onClose: () => void;
  modalMode: 'add' | 'edit';
  formData: any;
  setFormData: (data: any) => void;
  accessToken: string;
  reload: boolean;
  setReload: (reload: boolean) => void;
}

const initialFormData = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  address: "",
  district: "",
  ward: "",
  roleId: "",
  gender: "",
  avatarUrl: "",
};

export default function ModalAddUse({
  editUser,
  isOpen,
  onClose,
  modalMode,
  formData, 
  setFormData,
  accessToken,
  reload,
  setReload,
}: ModalAddUseProps) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const resetForm = () => {
    setFormData(initialFormData);
    setFile(null);
    setPreview(null);
  };

  const handleImageUpload = async () => {
    if (!file) return "";
    const newUploadedImages = await uploadToCloudinary([file], process.env.NEXT_PUBLIC_FOLDER || "");
    return newUploadedImages.length > 0 ? newUploadedImages[0] : "";
  };

  const handleSuccess = () => {
    setLoading(false);
    resetForm();
    toast.success(modalMode === "add" ? "Thêm người dùng thành công!" : "Cập nhật người dùng thành công!");
    setReload(!reload);
    onClose();
  };

  const handleError = () => {
    setLoading(false);
    toast.error(modalMode === "add" ? "Thêm người dùng thất bại!" : "Cập nhật người dùng thất bại!");
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const avatarUrl = await handleImageUpload();
      if (avatarUrl) {
        formData.avatarUrl = avatarUrl;
      }
      
      const res = await CreateUser_API(formData, accessToken);
      res.status === 200 ? handleSuccess() : handleError();
    } catch (error) {
      handleError();
    }
  };
  
  const handleEdit = async () => {
    setLoading(true);
    try {
      const avatarUrl = await handleImageUpload();
      if (avatarUrl) {
        formData.avatarUrl = avatarUrl;
      }
      
      const res = await UpdateUser_API(editUser.id, formData, accessToken);
      res.status === 200 ? handleSuccess() : handleError();
    } catch (error) {
      handleError();
    }
  };

  const modalConfig = {
    isOpen,
    onClose,
    placement: "center" as const,
    size: "2xl" as const,
    scrollBehavior: "inside" as const,
    classNames: {
      base: "bg-background",
      header: "border-b border-border",
      body: "py-6",
      footer: "border-t border-border",
      closeButton: "hover:bg-default-100",
      backdrop: "bg-background/80 backdrop-blur-md",
    },
  };

  const headerIcon = modalMode === "add" ? <UserPlus className="w-5 h-5 text-primary" /> : <Edit3 className="w-5 h-5 text-primary" />;
  const headerTitle = modalMode === "add" ? "Thêm người dùng mới" : "Chỉnh sửa thông tin người dùng";
  const buttonText = modalMode === "add" ? "Thêm người dùng" : "Lưu thay đổi";
  const handleAction = modalMode === "add" ? handleSubmit : handleEdit;

  return (
    <div className="h-[80vh] overflow-hidden">
      <Modal {...modalConfig}>
        <ModalContent>
          <ModalHeader className="text-xl font-bold">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                {headerIcon}
              </div>
              {headerTitle}
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
                labelPlacement="outside"
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, roleId: Number(e.target.value) })}
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
              onPress={handleAction}
              isLoading={loading}
              className="font-semibold px-6">
              {buttonText}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
