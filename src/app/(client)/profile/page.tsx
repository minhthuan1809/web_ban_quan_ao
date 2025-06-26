import React, { useState } from 'react';
import Image from 'next/image';

export default function PageProfile() {
  const [name, setName] = useState('Nguyễn Minh Em');
  const [email, setEmail] = useState('user@gmail.com');
  const [avatar, setAvatar] = useState('https://plus.unsplash.com/premium_photo-1687686676757-9d849a16e4ea?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGVyc2lvbnxlbnwwfHwwfHx8MA%3D%3D');
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-8">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-28 h-28">
          <Image src={avatar} alt="avatar" fill className="rounded-full object-cover border-4 border-blue-100" />
        </div>
        <label className="cursor-pointer text-blue-600 hover:underline">
          Đổi ảnh đại diện
          <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </label>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Họ và tên</label>
          <input value={name} onChange={e => setName(e.target.value)} className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" required type="email" />
        </div>
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition" disabled={loading}>
        {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
      </button>
    </form>
  );
}
