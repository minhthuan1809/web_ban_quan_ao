'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import useAuthInfor from '@/app/customHooks/AuthInfor';
import { authUpdateProfile_API } from '@/app/_service/authClient';
import { uploadToCloudinary } from '@/app/_util/upload_img_cloudinary';
import { Button, Input, Card, CardBody, CardHeader, Divider, Select, SelectItem } from '@nextui-org/react';
import { User, Mail, Camera, Phone, MapPin, Calendar, Edit3, Save, X } from 'lucide-react';
import { formatAvatarUrl } from '@/app/_util/formatImageUrl';

export default function PageProfile() {
  const { user: userInfo, accessToken, setUser } = useAuthInfor();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',  
    roleId : 1,
    district: '',
    ward: '',
    gender: 'MALE' as 'MALE' | 'FEMALE' | 'OTHER',
    token: ''
  });
  const [avatar, setAvatar] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Load user data when component mounts
  useEffect(() => {
    if (userInfo) {
      setFormData({
        fullName: userInfo.fullName || '',
        email: userInfo.email || '',
        phone: userInfo.phone || '',
        address: userInfo.address || '',
        roleId: 1,
        district: userInfo.district || '',
        ward: userInfo.ward || '',
        gender: (userInfo.gender as 'MALE' | 'FEMALE' | 'OTHER') || 'MALE',
        token: accessToken || ''
      });
      setAvatar(userInfo.avatarUrl || 'https://plus.unsplash.com/premium_photo-1687686676757-9d849a16e4ea?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGVyc2lvbnxlbnwwfHwwfHx8MA%3D%3D');
    }
  }, [userInfo]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatar(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      toast.error('Vui lòng đăng nhập lại');
      return;
    }

    setLoading(true);
    try {
      let avatarUrl = avatar;
      
      // Upload avatar if changed
      if (avatarFile) {
        const uploadedImages = await uploadToCloudinary([avatarFile], process.env.NEXT_PUBLIC_FOLDER || "");
        if (uploadedImages.length > 0) {
          avatarUrl = uploadedImages[0];
        }
      }

      // Update profile sử dụng service
      const response = await authUpdateProfile_API({
        ...formData,
        avatarUrl: avatarUrl,
        token: accessToken
      });

      if (response.status === 200) {
        toast.success('Cập nhật thông tin thành công!');
        // Update user context with new data
        if (setUser) {
          setUser(response.data);
        }
        setIsEditing(false);
      }
    } catch (error: any) {
      console.error('Update profile error:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  const cancelEditing = () => {
    // Reset form data to original user info
    if (userInfo) {
      setFormData({
        fullName: userInfo.fullName || '',
        email: userInfo.email || '',
        phone: userInfo.phone || '',
        address: userInfo.address || '',
        roleId: 1,
        district: userInfo.district || '',
        ward: userInfo.ward || '',
        gender: (userInfo.gender as 'MALE' | 'FEMALE' | 'OTHER') || 'MALE',
        token: accessToken || ''
      });
      setAvatar(userInfo.avatarUrl || 'https://plus.unsplash.com/premium_photo-1687686676757-9d849a16e4ea?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGVyc2lvbnxlbnwwfHwwfHx8MA%3D%3D');
      setAvatarFile(null);
    }
    setIsEditing(false);
  };

  if (!userInfo) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardBody className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar Section */}
            <div className="relative group">
              <div className="relative w-32 h-32 md:w-40 md:h-40">
                <Image 
                  src={formatAvatarUrl(avatar)} 
                  alt="avatar" 
                  fill 
                  className="rounded-full object-cover border-4 border-white shadow-xl" 
                />
                {isEditing && (
                  <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center cursor-pointer group">
                    <Camera className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={28} />
                  </div>
                )}
              </div>
              {isEditing && (
                <label className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 shadow-lg">
                  <Camera size={16} />
                  Đổi ảnh
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleAvatarChange} 
                  />
                </label>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{userInfo.fullName}</h1>
              <p className="text-blue-600 font-medium mb-1">{userInfo.email}</p>
              <p className="text-gray-600">{userInfo.phone || 'Chưa cập nhật số điện thoại'}</p>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-3 text-gray-500">
                <MapPin size={16} />
                <span className="text-sm">{userInfo.address || 'Chưa cập nhật địa chỉ'}</span>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex gap-3">
              {!isEditing ? (
                <Button
                  color="primary"
                  variant="flat"
                  startContent={<Edit3 size={18} />}
                  onClick={() => setIsEditing(true)}
                  className="font-medium"
                >
                  Chỉnh sửa
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    color="danger"
                    variant="flat"
                    startContent={<X size={18} />}
                    onClick={cancelEditing}
                    disabled={loading}
                  >
                    Hủy
                  </Button>
                  <Button
                    color="primary"
                    startContent={<Save size={18} />}
                    onClick={handleSubmit}
                    isLoading={loading}
                    disabled={loading}
                    className="font-medium"
                  >
                    Lưu
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Information Form */}
      {isEditing && (
        <Card>
          <CardHeader className="pb-3">
            <h2 className="text-xl font-semibold text-gray-800">Chỉnh sửa thông tin</h2>
          </CardHeader>
          <Divider />
          <CardBody className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center gap-2">
                  <User size={20} className="text-blue-600" />
                  Thông tin cá nhân
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Họ và tên"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    variant="bordered"
                    size="lg"
                    startContent={<User className="text-default-400" size={18} />}
                    required
                  />
                  
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    variant="bordered"
                    size="lg"
                    startContent={<Mail className="text-default-400" size={18} />}
                    required
                  />
                  
                  <Input
                    label="Số điện thoại"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    variant="bordered"
                    size="lg"
                    startContent={<Phone className="text-default-400" size={18} />}
                  />
                  
                  <Select
                    label="Giới tính"
                    selectedKeys={[formData.gender]}
                    onSelectionChange={(keys) => handleInputChange('gender', Array.from(keys)[0] as string)}
                    variant="bordered"
                    size="lg"
                  >
                    <SelectItem key="MALE" value="MALE">Nam</SelectItem>
                    <SelectItem key="FEMALE" value="FEMALE">Nữ</SelectItem>
                    <SelectItem key="OTHER" value="OTHER">Khác</SelectItem>
                  </Select>
                </div>
              </div>

              <Divider />

              {/* Address Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-blue-600" />
                  Địa chỉ
                </h3>
                <div className="space-y-4">
                  <Input
                    label="Địa chỉ chi tiết"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    variant="bordered"
                    size="lg"
                    startContent={<MapPin className="text-default-400" size={18} />}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Quận/Huyện"
                      value={formData.district}
                      onChange={(e) => handleInputChange('district', e.target.value)}
                      variant="bordered"
                      size="lg"
                    />
                    
                    <Input
                      label="Phường/Xã"
                      value={formData.ward}
                      onChange={(e) => handleInputChange('ward', e.target.value)}
                      variant="bordered"
                      size="lg"
                    />
                  </div>
                </div>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      {/* Profile Stats */}
      {!isEditing && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardBody className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="text-blue-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Tài khoản</h3>
              <p className="text-sm text-gray-600">Thành viên đã xác thực</p>
            </CardBody>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardBody className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="text-green-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Thành viên từ</h3>
              <p className="text-sm text-gray-600">
                {userInfo.createdAt ? new Date(userInfo.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
              </p>
            </CardBody>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardBody className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="text-purple-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Trạng thái email</h3>
              <p className="text-sm text-green-600 font-medium">Đã xác thực</p>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
