"use client"
import { getUserById_API, UpdateUser_API, CreateUser_API, deleteUser_API } from '@/app/_service/user';
import useAuthInfor from '@/app/customHooks/AuthInfor';
import React, { useEffect, useState } from 'react';
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, useDisclosure, Spinner, Chip, Avatar
} from "@nextui-org/react";

import { User, UserPlus, Edit3, Trash2, Users, Mail, Phone, MapPin } from 'lucide-react';
import Loading from '@/app/_util/Loading';
import { toast } from 'react-toastify';
import ModalAddUse from './ModalAddUse';

interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  district: string;
  ward: string;
  roleName: string | null;
  avatarUrl: string | null;
  gender: string;
  isVerify: boolean;
  createdAt: number;
  updatedAt: number;
}

interface UserResponse {
  data: User[];
  metadata: {
    page: number;
    page_size: number;
    total: number;
    total_page: number;
    ranger: {
      from: number;
      to: number;
    }
  }
}

export default function PageUser() {        
  const [users, setUsers] = useState<UserResponse | null>(null);
  const { accessToken } = useAuthInfor();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editUser, setEditUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    district: '',
    ward: '',
    gender: 'MALE'
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [])

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUserById_API(accessToken);
      setUsers(res.data);
    } catch (error) {
      toast.error('Lỗi tải danh sách người dùng!');
    } finally {
      setLoading(false);
    }
  }

  const handleAdd = () => {
    setModalMode('add');
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      address: '',
      district: '',
      ward: '',
      gender: 'MALE'
    });
    setEditUser(null);
    setShowModal(true);
  }

  const handleEdit = (user: User) => {
    setModalMode('edit');
    setEditUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      district: user.district,
      ward: user.ward,
      gender: user.gender
    });
    setShowModal(true);
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;
    setLoading(true);
    try {
      await deleteUser_API(id, accessToken);
      toast.success('Xóa người dùng thành công!');
      fetchUsers();
    } catch (error) {
      toast.error('Xóa người dùng thất bại!');
    } finally {
      setLoading(false);
    }
  }

  const handleModalSubmit = async () => {
    setLoading(true);
    try {
      if (modalMode === 'add') {
        await CreateUser_API(formData, accessToken);
        toast.success('Thêm người dùng thành công!');
      } else if (modalMode === 'edit' && editUser) {
        await UpdateUser_API(editUser.id, formData, accessToken);
        toast.success('Cập nhật người dùng thành công!');
      }
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      toast.error('Lưu thông tin thất bại!');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen ">
      <div className="mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow border border-slate-200 p-5 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Users className="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Quản lý người dùng</h1>
              <p className="text-slate-500 text-sm">Tổng cộng {users?.metadata?.total || 0} người dùng</p>
            </div>
          </div>
          <Button 
            color="primary"
            onPress={handleAdd}
            startContent={<UserPlus className="w-4 h-4" />}
            className="font-semibold px-5"
            size="md"
            variant="flat"
          >
            Thêm người dùng
          </Button>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <Table
              aria-label="Bảng người dùng"
              removeWrapper
              className="min-w-[800px]"
              classNames={{
                th: "bg-slate-50 text-slate-700 font-semibold text-xs py-3 border-b border-slate-100",
                td: "py-3 text-slate-700 text-sm border-b border-slate-50",
                tr: "hover:bg-slate-50/70 transition-colors"
              }}
            >
              <TableHeader>
                <TableColumn>
                  <div className="flex items-center gap-2">
                    STT
                  </div>
                </TableColumn>
                <TableColumn>
                  <div className="flex items-center gap-2">
                    Họ tên
                  </div>
                </TableColumn>
                <TableColumn>
                  <div className="flex items-center gap-2">
                    SĐT
                  </div>
                </TableColumn>
                <TableColumn>
                  <div className="flex items-center gap-2">
                    Địa chỉ
                  </div>
                </TableColumn>
                <TableColumn>Giới tính</TableColumn>
                <TableColumn className="text-center">Hành động</TableColumn>
              </TableHeader>
              <TableBody emptyContent={
                <div className="text-center py-8">
                  <Users className="w-14 h-14 mx-auto text-slate-200 mb-3" />
                  <p className="text-slate-400">Không có dữ liệu người dùng</p>
                </div>
              }>
                {(users?.data ?? []).map((user: User, index: number) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="text-slate-600">{index + 1}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar 
                          src={user.avatarUrl || "https://i.pravatar.cc/150?u=a042581f4e29026024d"}
                          size="sm"
                          className="flex-shrink-0"
                        />
                        <div>
                          <div className="font-medium text-slate-800">{user.fullName}</div>
                          <div className="text-slate-500 text-xs">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-slate-600">{user.phone}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-slate-600 max-w-xs truncate">
                        {`${user.address}, ${user.ward}, ${user.district}`}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-block px-2 py-1 rounded bg-slate-100 text-xs text-slate-700">
                        {user.gender === 'MALE' ? 'Nam' : user.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          color="primary"
                          variant="light"
                          onPress={() => handleEdit(user)}
                          startContent={<Edit3 className="w-3 h-3" />}
                          className="min-w-0 px-3"
                        >
                          Sửa
                        </Button>
                        <Button
                          size="sm"
                          color="danger"
                          variant="light"
                          onPress={() => handleDelete(user.id)}
                          startContent={<Trash2 className="w-3 h-3" />}
                          className="min-w-0 px-3"
                        >
                          Xóa
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <ModalAddUse
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        modalMode={modalMode}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleModalSubmit}
        accessToken={accessToken}
      />
      {loading && <Loading />}
    </div>
  )
}