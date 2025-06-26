'use client';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import useAuthInfor from '@/app/customHooks/AuthInfor';
import { authChangePassword_API } from '@/app/_service/authClient';
import { Button, Input, Card, CardBody } from '@nextui-org/react';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function Password() {
  const { accessToken } = useAuthInfor();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accessToken) {
      toast.error('Vui lòng đăng nhập lại');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Mật khẩu mới không khớp');
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);
    try {
      // Gửi theo API spec: oldPassword, newPassword, confirmNewPassword
      const requestData = {
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmPassword
      };
      
      const response = await authChangePassword_API(requestData, accessToken);
      
      if (response.status === 200) {
        toast.success('Đổi mật khẩu thành công!');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error: any) {
      console.error('Change password error:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi đổi mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardBody className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Đổi mật khẩu</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Mật khẩu hiện tại"
            type={showPasswords.current ? "text" : "password"}
            value={formData.currentPassword}
            onChange={(e) => handleInputChange('currentPassword', e.target.value)}
            variant="bordered"
            size="lg"
            startContent={<Lock className="text-default-400" size={18} />}
            endContent={
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="text-default-400 hover:text-default-600"
              >
                {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
            required
          />
          
          <Input
            label="Mật khẩu mới"
            type={showPasswords.new ? "text" : "password"}
            value={formData.newPassword}
            onChange={(e) => handleInputChange('newPassword', e.target.value)}
            variant="bordered"
            size="lg"
            startContent={<Lock className="text-default-400" size={18} />}
            endContent={
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="text-default-400 hover:text-default-600"
              >
                {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
            required
            minLength={6}
          />
          
          <Input
            label="Nhập lại mật khẩu mới"
            type={showPasswords.confirm ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            variant="bordered"
            size="lg"
            startContent={<Lock className="text-default-400" size={18} />}
            endContent={
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="text-default-400 hover:text-default-600"
              >
                {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
            required
            minLength={6}
          />
          
          <Button 
            type="submit" 
            color="primary"
            size="lg"
            className="w-full font-semibold"
            isLoading={loading}
            disabled={loading}
          >
            {loading ? 'Đang đổi...' : 'Đổi mật khẩu'}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
