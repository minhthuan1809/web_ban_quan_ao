'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import useAuthInfor from '@/app/customHooks/AuthInfor';
import { authUpdateProfile_API } from '@/app/_service/authClient';
import { uploadToCloudinary } from '@/app/_util/upload_img_cloudinary';
import { Button, Input, Card, CardBody } from '@nextui-org/react';
import { User, Mail, Camera } from 'lucide-react';

export default function PageProfile() {
  const { user: userInfo, accessToken, setUser } = useAuthInfor();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    district: '',
    ward: '',
    gender: 'MALE' as 'MALE' | 'FEMALE' | 'OTHER'
  });
  const [avatar, setAvatar] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Load user data when component mounts
  useEffect(() => {
    if (userInfo) {
      setFormData({
        fullName: userInfo.fullName || '',
        email: userInfo.email || '',
        phone: userInfo.phone || '',
        address: userInfo.address || '',
        district: userInfo.district || '',
        ward: userInfo.ward || '',
        gender: (userInfo.gender as 'MALE' | 'FEMALE' | 'OTHER') || 'MALE'
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

      // Update profile
      const response = await authUpdateProfile_API({
        ...formData,
        avatarUrl: avatarUrl
      }, accessToken);

      if (response.status === 200) {
        toast.success('Cập nhật thông tin thành công!');
        // Update user context with new data
        if (setUser) {
          setUser(response.data);
        }
      }
    } catch (error: any) {
      console.error('Update profile error:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật thông tin');
    } finally {
      setLoading(false);
    }
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
    <Card className="max-w-2xl mx-auto">
      <CardBody className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32">
              <Image 
                src={avatar} 
                alt="avatar" 
                fill 
                className="rounded-full object-cover border-4 border-blue-100 shadow-lg" 
              />
              <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center cursor-pointer group">
                <Camera className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
              </div>
            </div>
            <label className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium transition-colors flex items-center gap-2">
              <Camera size={18} />
              Đổi ảnh đại diện
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleAvatarChange} 
              />
            </label>
          </div>

          {/* Form Fields */}
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
            />
            
            <div>
              <label className="block text-sm font-medium mb-2">Giới tính</label>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 h-12 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="OTHER">Khác</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Địa chỉ"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              variant="bordered"
              size="lg"
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

          <Button 
            type="submit" 
            color="primary"
            size="lg"
            className="w-full font-semibold"
            isLoading={loading}
            disabled={loading}
          >
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
