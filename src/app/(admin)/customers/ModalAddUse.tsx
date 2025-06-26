import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  Select,
  SelectItem,
  Progress,
  Card
} from "@nextui-org/react";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { UserPlus, Edit3, User, Mail, Phone, MapPin, Users, Camera, Upload, Check, ArrowRight, ArrowLeft, Key } from "lucide-react";
import InputAddress from "@/app/components/ui/InputAddress";
import { CreateUser_API, UpdateUser_API } from "@/app/_service/user";
import ImgUpload from "@/app/components/ui/ImgUpload";
import { toast } from "react-toastify";
import InputGender from "@/app/components/ui/InputGender";
import { uploadToCloudinary } from "@/app/_util/upload_img_cloudinary";
import InputGmail from "@/app/components/ui/InputGmail";
import InputPhone from "@/app/components/ui/InputPhone";

interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  district: string;
  ward: string;
  roleId: number;
  avatarUrl: string;
  gender: string;
}

interface ModalAddUseProps {
  editUser: User | null;
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
  roleId: 1,
  gender: "",
  avatarUrl: "",
};

interface ValidationRule {
  required: boolean;
  message: string;
  pattern?: RegExp;
  minLength?: number;
}

const VALIDATION_RULES: Record<string, ValidationRule> = {
  fullName: { required: true, message: 'Họ tên không được để trống' },
  email: { required: true, pattern: /\S+@\S+\.\S+/, message: 'Email không hợp lệ' },
  password: { required: true, minLength: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
  phone: { required: true, message: 'Số điện thoại không được để trống' },
  gender: { required: true, message: 'Vui lòng chọn giới tính' },
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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);

  // Memoized values
  const isEditMode = modalMode === 'edit';
  const headerConfig = useMemo(() => ({
    icon: isEditMode ? <Edit3 className="w-5 h-5 text-purple-600" /> : <UserPlus className="w-5 h-5 text-blue-600" />,
    title: isEditMode ? "Chỉnh sửa thông tin người dùng" : "Thêm người dùng mới",
    subtitle: isEditMode ? "Cập nhật thông tin người dùng" : "Điền thông tin để tạo tài khoản mới",
    buttonText: isEditMode ? "Cập nhật" : "Thêm mới",
    bgColor: isEditMode ? 'bg-purple-100' : 'bg-blue-100'
  }), [isEditMode]);

  // Set preview when editing
  useEffect(() => {
    if (isEditMode && editUser?.avatarUrl) {
      setPreview(editUser.avatarUrl);
    }
  }, [isEditMode, editUser]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({ ...initialFormData, roleId: 1 });
    setFile(null);
    setPreview(null);
    setErrors({});
    setStep(1);
    setUploadProgress(0);
  }, [setFormData]);

  // Validation
  const validateField = useCallback((field: string, value: any) => {
    const rule = VALIDATION_RULES[field];
    if (!rule) return '';

    if (rule.required && !value?.trim()) {
      return rule.message;
    }
    
    if (field === 'email' && value && rule.pattern && !rule.pattern.test(value)) {
      return rule.message;
    }
    
    if (field === 'password' && modalMode === 'add' && value && rule.minLength && value.length < rule.minLength) {
      return rule.message;
    }
    
    return '';
  }, [modalMode]);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    
    Object.keys(VALIDATION_RULES).forEach(field => {
      if (field === 'password' && isEditMode) return; // Skip password validation in edit mode
      
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField, isEditMode]);

  // Image upload
  const handleImageUpload = useCallback(async () => {
    if (!file) return "";
    
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90));
    }, 100);
    
    try {
      const uploadedImages = await uploadToCloudinary([file], process.env.NEXT_PUBLIC_FOLDER || "");
      setUploadProgress(100);
      clearInterval(interval);
      return uploadedImages.length > 0 ? uploadedImages[0] : "";
    } catch (error) {
      clearInterval(interval);
      setUploadProgress(0);
      throw error;
    }
  }, [file]);

  // Submit handlers
  const handleSuccess = useCallback(() => {
    setLoading(false);
    resetForm();
    toast.success(`✅ ${isEditMode ? "Cập nhật" : "Thêm"} người dùng thành công!`);
    setReload(!reload);
    onClose();
  }, [isEditMode, resetForm, setReload, reload, onClose]);

  const handleError = useCallback((message?: string) => {
    setLoading(false);
    setUploadProgress(0);
    toast.error(message || `❌ ${isEditMode ? "Cập nhật" : "Thêm"} người dùng thất bại!`);
  }, [isEditMode]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    setLoading(true);
    try {
      let finalData = { ...formData };
      
      if (file) {
        const avatarUrl = await handleImageUpload();
        if (avatarUrl) finalData.avatarUrl = avatarUrl;
      }
      
      const apiCall = isEditMode 
        ? UpdateUser_API(editUser!.id, finalData, accessToken)
        : CreateUser_API(finalData, accessToken);
      
      const res = await apiCall;
      res.status === 200 ? handleSuccess() : handleError();
    } catch (error) {
      handleError();
    }
  }, [validateForm, formData, file, handleImageUpload, isEditMode, editUser, accessToken, handleSuccess, handleError]);
  // Step navigation
  const nextStep = useCallback(() => {

    
    if (step === 1) {
      const basicFields = ['fullName', 'email'];
      if (modalMode === 'add') basicFields.push('password');
      
      const basicErrors: Record<string, string> = {};
      basicFields.forEach(field => {
        const error = validateField(field, formData[field]);
        if (error) basicErrors[field] = error;
      });
      
      
      if (Object.keys(basicErrors).length > 0) {
        setErrors(basicErrors);
        return;
      }
    }

    setStep(2);
  }, [step, modalMode, validateField, formData, errors]);

  const prevStep = useCallback(() => setStep(1), []);

  // Form field handlers
  const updateField = useCallback((field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [formData, setFormData, errors]);

  const handleAddressChange = useCallback((addressData: any) => {
    setFormData({
      ...formData,
      address: addressData.city.cityName,
      district: addressData.district.districtName,
      ward: addressData.ward.wardName,
    });
  }, [formData, setFormData]);

  return (
    <Modal 
      isOpen={isOpen}
      onClose={() => {
        resetForm();
        onClose();
      }}
      placement="center"
      size="3xl"
      scrollBehavior="inside"
      classNames={{
        base: "bg-white shadow-2xl",
        header: "border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50",
        body: "py-6",
        footer: "border-t border-gray-200 bg-gray-50/50",
        backdrop: "bg-black/60 backdrop-blur-sm",
      }}
    >
      <ModalContent>
        <ModalHeader className="pb-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl shadow-md ${headerConfig.bgColor}`}>
                {headerConfig.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{headerConfig.title}</h2>
                <p className="text-sm text-gray-500">{headerConfig.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Bước {step}/2</span>
              <Progress value={(step / 2) * 100} className="w-20" size="sm" />
            </div>
          </div>
        </ModalHeader>
        
        <ModalBody className="space-y-6">
          {/* Upload Progress */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <Card className="p-4 bg-blue-50 border border-blue-200">
              <div className="flex items-center gap-3">
                <Upload className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-800">Đang tải ảnh...</p>
                  <Progress value={uploadProgress} className="mt-2" color="primary" />
                </div>
              </div>
            </Card>
          )}

          {step === 1 && (
            <div className="space-y-6">
              {/* Avatar Upload */}
              <Card className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-center gap-2">
                    <Camera className="w-5 h-5" />
                    Ảnh đại diện
                  </h3>
                  <ImgUpload
                    setPreview={setPreview}
                    preview={preview}
                    setFile={setFile}
                  />
                  <p className="text-sm text-gray-500 mt-3">Tải lên ảnh đại diện (tuỳ chọn)</p>
                </div>
              </Card>

              {/* Basic Information */}
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Thông tin cơ bản
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="Họ và tên"
                    placeholder="Nhập họ và tên đầy đủ"
                    value={formData.fullName}
                    type="text"
                    labelPlacement="outside"
                    isRequired
                    onChange={(e) => updateField('fullName', e.target.value)}
                    variant="bordered"
                    isInvalid={!!errors.fullName}
                    errorMessage={errors.fullName}
                    startContent={<User className="w-4 h-4 text-gray-400" />}
                  />
                  

                  <InputGmail
                    label="Email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={(value) => updateField('email', value)}
                  />  
                </div>

            
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Thông tin liên hệ & vai trò
              </h3>

              <div className="space-y-5">
                <InputPhone
                  placeholder="Nhập số điện thoại"
                  label="Số điện thoại"
                  value={formData.phone}
                  onChange={(value) => updateField('phone', value)}
                  countryCode="+84"
                  autoComplete="tel"
                  className="w-full"
                  onValidationChange={() => {}}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Địa chỉ <span className="text-red-500">*</span>
                  </label>
                  <InputAddress onChange={handleAddressChange} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Select
                    label="Vai trò"
                    placeholder="Chọn vai trò"
                    selectedKeys={[(formData.roleId ?? 1).toString()]}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as string;
                      updateField('roleId', Number(selected));
                    }}
                    variant="bordered"
                    startContent={<Users className="w-4 h-4 text-black" />}
                    renderValue={() => (formData.roleId === 2 ? 'Quản trị viên' : 'Người dùng')}
                  >
                    <SelectItem key="1" value="1">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Người dùng
                      </div>
                    </SelectItem>
                    <SelectItem key="2" value="2">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Quản trị viên
                      </div>
                    </SelectItem>
                  </Select>

                  <Input
                      label="Giới tính"
                    placeholder="Nam/Nữ/Khác"
                      value={formData.gender}
                    onChange={(e) => updateField('gender', e.target.value)}
                    variant="bordered"
                    isRequired
                    isInvalid={!!errors.gender}
                    errorMessage={errors.gender}
                    startContent={<User className="w-4 h-4 text-gray-400" />}
                  />
                </div>
              </div>
            </div>
          )}
        </ModalBody>
        
        <ModalFooter className="gap-3 pt-6">
          <div className="flex justify-between w-full">
            <div className="flex gap-2">
              {step > 1 && (
                <Button
                  variant="bordered"
                  onPress={prevStep}
                  startContent={<ArrowLeft className="w-4 h-4" />}
                  className="font-medium"
                >
                  Quay lại
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="light"
                onPress={() => {
                  resetForm();
                  onClose();
                }}
              >
                Hủy
              </Button>
              
              {step < 2 ? (
                <Button
                  color="primary"
                  onPress={nextStep}
                  endContent={<ArrowRight className="w-4 h-4" />}
                  className="font-medium"
                >
                  Tiếp theo
                </Button>
              ) : (
                <Button
                  color="primary"
                  onPress={handleSubmit}
                  isLoading={loading}
                  startContent={!loading && <Check className="w-4 h-4" />}
                  className="font-medium"
                >
                  {loading ? "Đang xử lý..." : headerConfig.buttonText}
                </Button>
              )}
            </div>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
