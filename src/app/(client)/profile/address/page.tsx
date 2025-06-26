import React, { useState } from 'react';

interface Address {
  id: number;
  name: string;
  phone: string;
  address: string;
}

const initialAddresses: Address[] = [
  { id: 1, name: 'Nguyễn Minh Em', phone: '0901234567', address: '123 Đường ABC, Quận 1, TP.HCM' },
  { id: 2, name: 'Nguyễn Văn B', phone: '0912345678', address: '456 Đường XYZ, Quận 3, TP.HCM' },
];

export default function PageAddress() {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number|null>(null);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });

  const handleEdit = (addr: Address) => {
    setEditId(addr.id);
    setForm({ name: addr.name, phone: addr.phone, address: addr.address });
    setShowForm(true);
  };
  const handleDelete = (id: number) => setAddresses(addresses.filter(a => a.id !== id));
  const handleAdd = () => {
    setEditId(null);
    setForm({ name: '', phone: '', address: '' });
    setShowForm(true);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      setAddresses(addresses.map(a => a.id === editId ? { ...a, ...form } : a));
    } else {
      setAddresses([...addresses, { ...form, id: Date.now() }]);
    }
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Địa chỉ nhận hàng</h1>
        <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">Thêm địa chỉ</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map(addr => (
          <div key={addr.id} className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
            <div className="font-semibold">{addr.name}</div>
            <div className="text-gray-500 text-sm">{addr.phone}</div>
            <div className="text-gray-700">{addr.address}</div>
            <div className="flex gap-2 mt-2">
              <button onClick={() => handleEdit(addr)} className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500">Sửa</button>
              <button onClick={() => handleDelete(addr.id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Xóa</button>
            </div>
          </div>
        ))}
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 max-w-md mx-auto space-y-4">
          <h2 className="font-bold text-lg mb-2">{editId ? 'Sửa địa chỉ' : 'Thêm địa chỉ'}</h2>
          <div>
            <label className="block mb-1">Họ tên</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block mb-1">Số điện thoại</label>
            <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block mb-1">Địa chỉ</label>
            <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="w-full border rounded px-3 py-2" required />
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-200 rounded">Hủy</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Lưu</button>
          </div>
        </form>
      )}
    </div>
  );
}