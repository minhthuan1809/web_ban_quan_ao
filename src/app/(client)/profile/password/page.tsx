'use client';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import useAuthInfor from '@/app/customHooks/AuthInfor';
import { authChangePassword_API } from '@/app/_service/authClient';
import { Button, Input, Card, CardBody, CardHeader, Divider, Progress } from '@nextui-org/react';
import { Lock, Eye, EyeOff, Shield, CheckCircle, AlertCircle } from 'lucide-react';

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

  // Password strength checker
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    Object.values(checks).forEach(check => {
      if (check) strength++;
    });
    
    return { strength, checks };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);
  const strengthPercentage = (passwordStrength.strength / 5) * 100;
  const strengthColor = strengthPercentage < 40 ? 'danger' : strengthPercentage < 80 ? 'warning' : 'success';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accessToken) {
      toast.error('Vui lòng đăng nhập lại');
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      toast.error('Mật khẩu mới không được giống mật khẩu cũ');
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
      // Sử dụng service API
      const response = await authChangePassword_API({
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmPassword,
        token: accessToken
      });
      
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
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardBody className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Shield className="text-purple-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Đổi mật khẩu</h1>
              <p className="text-gray-600">Bảo vệ tài khoản của bạn bằng mật khẩu mạnh</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Password Form */}
      <Card>
        <CardHeader className="pb-3">
          <h2 className="text-xl font-semibold text-gray-800">Thay đổi mật khẩu</h2>
        </CardHeader>
        <Divider />
        <CardBody className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div>
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
                    className="text-default-400 hover:text-default-600 transition-colors"
                  >
                    {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                required
                className="mb-2"
              />
              <p className="text-xs text-gray-500">Nhập mật khẩu hiện tại để xác thực</p>
            </div>

            <Divider />

            {/* New Password */}
            <div>
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
                    className="text-default-400 hover:text-default-600 transition-colors"
                  >
                    {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                required
                minLength={6}
                color={
                  formData.newPassword && formData.currentPassword && 
                  formData.newPassword === formData.currentPassword 
                    ? 'danger' 
                    : 'default'
                }
              />
              
              {/* Warning when new password matches current password */}
              {formData.newPassword && formData.currentPassword && 
               formData.newPassword === formData.currentPassword && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  Mật khẩu mới không được giống mật khẩu cũ
                </p>
              )}
              
              {/* Password Strength Indicator */}
              {formData.newPassword && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Độ mạnh mật khẩu</span>
                    <span className={`text-sm font-medium ${
                      strengthColor === 'danger' ? 'text-red-500' :
                      strengthColor === 'warning' ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                      {strengthPercentage < 40 ? 'Yếu' : strengthPercentage < 80 ? 'Trung bình' : 'Mạnh'}
                    </span>
                  </div>
                  <Progress
                    value={strengthPercentage}
                    color={strengthColor}
                    size="sm"
                    className="w-full"
                  />
                  
                  {/* Password Requirements */}
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className={`flex items-center gap-2 text-xs ${
                      passwordStrength.checks.length ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {passwordStrength.checks.length ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                      Ít nhất 8 ký tự
                    </div>
                    <div className={`flex items-center gap-2 text-xs ${
                      passwordStrength.checks.uppercase ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {passwordStrength.checks.uppercase ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                      Chữ hoa
                    </div>
                    <div className={`flex items-center gap-2 text-xs ${
                      passwordStrength.checks.lowercase ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {passwordStrength.checks.lowercase ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                      Chữ thường
                    </div>
                    <div className={`flex items-center gap-2 text-xs ${
                      passwordStrength.checks.number ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {passwordStrength.checks.number ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                      Số
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
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
                    className="text-default-400 hover:text-default-600 transition-colors"
                  >
                    {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                required
                minLength={6}
                color={
                  formData.confirmPassword && formData.newPassword !== formData.confirmPassword 
                    ? 'danger' 
                    : formData.confirmPassword && formData.newPassword === formData.confirmPassword
                    ? 'success'
                    : 'default'
                }
              />
              {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">Mật khẩu không khớp</p>
              )}
              {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
                <p className="text-xs text-green-500 mt-1">Mật khẩu khớp</p>
              )}
            </div>

            <Divider />

            {/* Submit Button */}
            <Button 
              type="submit" 
              color="primary"
              size="lg"
              className="w-full font-semibold"
              isLoading={loading}
              disabled={
                loading || 
                formData.newPassword !== formData.confirmPassword || 
                !formData.currentPassword ||
                formData.currentPassword === formData.newPassword
              }
              startContent={!loading && <Shield size={18} />}
            >
              {loading ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
            </Button>
          </form>
        </CardBody>
      </Card>

      {/* Security Tips */}
      <Card>
        <CardHeader className="pb-3">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Shield className="text-blue-600" size={20} />
            Mẹo bảo mật
          </h3>
        </CardHeader>
        <Divider />
        <CardBody className="p-6">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="text-green-500 mt-0.5" size={16} />
              <p className="text-sm text-gray-600">Sử dụng mật khẩu dài ít nhất 8 ký tự</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="text-green-500 mt-0.5" size={16} />
              <p className="text-sm text-gray-600">Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="text-green-500 mt-0.5" size={16} />
              <p className="text-sm text-gray-600">Không sử dụng thông tin cá nhân dễ đoán</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="text-green-500 mt-0.5" size={16} />
              <p className="text-sm text-gray-600">Định kỳ thay đổi mật khẩu (3-6 tháng/lần)</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="text-green-500 mt-0.5" size={16} />
              <p className="text-sm text-gray-600">Không sử dụng lại mật khẩu cũ</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
