import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react'
import React, { useState } from 'react'           
import { Input, Button } from '@nextui-org/react'
import { UserPlus, Edit3, User, Mail, Phone, MapPin, Lock } from 'lucide-react'
import InputAddress from '@/app/components/ui/InputAddress'
import { CreateUser_API } from '@/app/_service/user'
import ImgUpload from '@/app/components/ui/ImgUpload'
import { toast } from 'react-toastify'
import InputPassword from '@/app/components/ui/InputPassword'
import InputPhone from '@/app/components/ui/InputPhone'
import InputGmail from '@/app/components/ui/InputGmail'
import InputGender from '@/app/components/ui/InputGender'

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
        setLoading(true);
     const   res = await CreateUser_API(formData, accessToken);
     if(res.status === 200){
        toast.success('Thêm người dùng thành công!');
     }else{
        toast.error('Thêm người dùng thất bại!');
     }
        setLoading(false);
        onClose();
    }

    return (
    <div className='h-[80vh] overflow-hidden'>
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
        backdrop: "bg-background/80 backdrop-blur-md"
      }}
    >
      <ModalContent>
        <ModalHeader className="text-xl font-bold">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              {modalMode === 'add' ? <UserPlus className="w-5 h-5 text-primary" /> : <Edit3 className="w-5 h-5 text-primary" />}
            </div>
            {modalMode === 'add' ? 'Thêm người dùng mới' : 'Chỉnh sửa thông tin người dùng'}
          </div>
        </ModalHeader>
        <ModalBody className="space-y-4">
           <div className="w-full flex justify-center items-center h-[150px]">
           <ImgUpload setPreview={setPreview} preview={preview} setFile={setFile} />
           </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Họ và tên"
              placeholder="Nhập họ và tên đầy đủ"
              type="text"
              value={formData.fullName}
              labelPlacement={"outside"}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              variant="bordered"
              isRequired
              startContent={<User className="w-4 h-4 text-default-400" />}
              classNames={{
                label: "text-default-700 font-medium",
                input: "text-default-800"
              }}
            />
            <InputGmail
              label="Email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e })}
            />
          </div>

          {modalMode === 'add' && (
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

          <div className="space-y-2">
            <InputAddress
              onChange={(e) => setFormData({ 
                ...formData, 
                address: e.city.cityName, 
                district: e.district.districtName, 
                ward: e.ward.wardName 
              })}
            />
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
            className="font-medium"
          >
            Hủy bỏ
          </Button>
          <Button 
            color="primary" 
            onPress={handleSubmit}
            isLoading={loading}
            className="font-semibold px-6"
          >
            {modalMode === 'add' ? 'Thêm người dùng' : 'Lưu thay đổi'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal></div>
  )
}
