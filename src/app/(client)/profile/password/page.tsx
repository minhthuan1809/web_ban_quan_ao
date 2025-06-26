import React, { useState } from 'react';

export default function Password() {
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (newPass !== confirm) {
      setError('Mật khẩu mới không khớp');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess('Đổi mật khẩu thành công!');
      setCurrent(''); setNewPass(''); setConfirm('');
    }, 1200);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white rounded-lg shadow p-6 space-y-5">
      <h1 className="text-xl font-bold mb-2">Đổi mật khẩu</h1>
      <div>
        <label className="block mb-1">Mật khẩu hiện tại</label>
        <input type="password" value={current} onChange={e => setCurrent(e.target.value)} className="w-full border rounded px-3 py-2" required />
      </div>
      <div>
        <label className="block mb-1">Mật khẩu mới</label>
        <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} className="w-full border rounded px-3 py-2" required />
      </div>
      <div>
        <label className="block mb-1">Nhập lại mật khẩu mới</label>
        <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} className="w-full border rounded px-3 py-2" required />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition" disabled={loading}>
        {loading ? 'Đang đổi...' : 'Đổi mật khẩu'}
      </button>
    </form>
  );
}
