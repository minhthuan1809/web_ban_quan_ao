"use client";
import React, { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation';
import InputPassword from '@/app/components/ui/InputPassword';
import { authResetPassword_API } from '@/app/_service/authClient';
import { toast } from 'react-toastify';
import Loading from '@/app/_util/Loading';

function ResetPasswordForm() {
    const params = useSearchParams();
    const token = params.get('token');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (password === confirmPassword && confirmPassword !== '') {
            setError('');
        } else if (confirmPassword !== '' && password !== confirmPassword) {
            setError('Mật khẩu không khớp');
        }
    }, [password, confirmPassword]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Mật khẩu không khớp');
            return;
        }
        if (!token) {
            toast.error('Token không hợp lệ');
            return;
        }
        try {
            setLoading(true);
            const response = await authResetPassword_API(token, password);
            if (response.status === 200) {
                setShowModal(true);
                setTimeout(() => {
                    setShowModal(false);
                    router.push('/login');
                }, 2000);
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-lg font-medium text-gray-900">Đổi mật khẩu thành công!</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Bạn sẽ được chuyển hướng đến trang đăng nhập
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="hidden md:flex items-center justify-center bg-blue-100 p-8">
                    <div
                        className="w-full h-full bg-cover bg-center rounded-2xl"
                        style={{
                            backgroundImage:
                                "url('https://images.unsplash.com/photo-1507679799987-c6e8cd9c85f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')",
                            backgroundPosition: "center",
                        }}
                    />
                </div>

                <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Đặt lại mật khẩu</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <InputPassword
                            label="Mật khẩu mới"
                            placeholder="Nhập mật khẩu mới"
                            value={password}
                            onChange={setPassword}
                        />
                        <div className='pt-2'>
                            <InputPassword
                                label="Xác nhận mật khẩu"
                                placeholder="Nhập lại mật khẩu mới"
                                value={confirmPassword}
                                onChange={setConfirmPassword}
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Đặt lại mật khẩu
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function PageResetPassword() {
    return (
        <Suspense fallback={<Loading />}>
            <ResetPasswordForm />
        </Suspense>
    );
}