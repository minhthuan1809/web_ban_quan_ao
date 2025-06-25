"use client"
import { getUserById_API, UpdateUser_API, CreateUser_API, deleteUser_API } from '@/app/_service/user';
import useAuthInfor from '@/app/customHooks/AuthInfor';
import React, { useEffect, useState } from 'react';
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, useDisclosure, Avatar, Card
} from "@nextui-org/react";

import { User, UserPlus, Edit3, Trash2, Users } from 'lucide-react';
import Loading from '@/app/_util/Loading';
import { toast } from 'react-toastify';
import ModalAddUse from './ModalAddUse';
import showConfirmDialog from '@/app/_util/Sweetalert2';

interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  district: string;
  ward: string;
  roleId: string;
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

  const [reload, setReload] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    district: '',
    ward: '',
    gender: 'MALE',
    roleId: 1
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
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      address: '',
      district: '',
      ward: '',
      gender: 'MALE',
      roleId: 1
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
      gender: user.gender,
      roleId: Number(user.roleId)
    });
    setShowModal(true);
  }

  const handleDelete = async (id: number) => {
    const result = await showConfirmDialog({
      title: 'Xác nhận xóa?',
      text: `Bạn có chắc chắn muốn xóa người dùng này?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    })      
    if (result.isConfirmed) {
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
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 bg-background min-h-screen">
      {/* Header Section */}
      <div className="bg-card rounded-lg border border-border p-4 md:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-semibold text-foreground">Quản lý người dùng</h1>
            <p className="text-sm text-muted-foreground">Tổng cộng {users?.metadata?.total || 0} người dùng</p>
          </div>
        </div>
        <Button 
          color="primary"
          onPress={handleAdd}
          startContent={<UserPlus className="w-4 h-4" />}
          className="font-medium w-full sm:w-auto"
          size="md"
        >
          Thêm người dùng
        </Button>
      </div>

      {/* Mobile View */}
      <div className="block md:hidden space-y-4">
        {(users?.data ?? []).map((user: User, index: number) => (
          <Card key={user.id} className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Avatar 
                src={user.avatarUrl || "https://i.pravatar.cc/150?u=a042581f4e29026024d"}
                size="sm"
                className="flex-shrink-0"
              />
              <div>
                <div className="font-medium text-foreground">{user.fullName}</div>
                <div className="text-muted-foreground text-xs">{user.email}</div>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">SĐT:</span>
                <span className="text-foreground">{user.phone}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Địa chỉ:</span>
                <span className="text-foreground text-right max-w-[200px] truncate">
                  {`${user.address}, ${user.ward}, ${user.district}`}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Giới tính:</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                  ${user.gender === 'MALE' ? 'bg-primary/10 text-primary' : 
                    user.gender === 'FEMALE' ? 'bg-pink-100 text-pink-600' : 
                    'bg-muted text-muted-foreground'}`}
                >
                  {user.gender === 'MALE' ? 'Nam' : user.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                className="bg-blue-500 text-white rounded-md flex-1"
                onPress={() => handleEdit(user)}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Sửa
              </Button>
              <Button
                size="sm"
                className="bg-red-500 text-white rounded-md flex-1"
                onPress={() => handleDelete(user.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Xóa
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table
            aria-label="Bảng người dùng"
            removeWrapper
            className="min-w-[800px]"
            classNames={{
              th: "bg-muted/50 text-muted-foreground font-medium text-xs py-3 border-b border-border",
              td: "py-3 text-foreground text-sm border-b border-border",
              tr: "hover:bg-muted/50 transition-colors"
            }}
          >
            <TableHeader>
              <TableColumn>STT</TableColumn>
              <TableColumn>Họ tên</TableColumn>
              <TableColumn>SĐT</TableColumn>
              <TableColumn>Địa chỉ</TableColumn>
              <TableColumn>Giới tính</TableColumn>
              <TableColumn className="text-center">Hành động</TableColumn>
            </TableHeader>
            <TableBody emptyContent={
              <div className="text-center py-8">
                <Users className="w-14 h-14 mx-auto text-muted-foreground/20 mb-3" />
                <p className="text-muted-foreground">Không có dữ liệu người dùng</p>
              </div>
            }>
              {(users?.data ?? []).map((user: User, index: number) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="text-foreground">{index + 1}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar 
                        src={user.avatarUrl || "https://i.pravatar.cc/150?u=a042581f4e29026024d"}
                        size="sm"
                        className="flex-shrink-0"
                      />
                      <div>
                        <div className="font-medium text-foreground">{user.fullName}</div>
                        <div className="text-muted-foreground text-xs">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-foreground">{user.phone}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-foreground max-w-xs truncate">
                      {`${user.address}, ${user.ward}, ${user.district}`}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                      ${user.gender === 'MALE' ? 'bg-primary/10 text-primary' : 
                        user.gender === 'FEMALE' ? 'bg-pink-100 text-pink-600' : 
                        'bg-muted text-muted-foreground'}`}
                    >
                      {user.gender === 'MALE' ? 'Nam' : user.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        size="sm"
                        className="bg-blue-500 text-white rounded-md min-w-10 h-10 flex items-center justify-center"
                        onPress={() => handleEdit(user)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-500 text-white rounded-md min-w-10 h-10 flex items-center justify-center"
                        onPress={() => handleDelete(user.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <ModalAddUse
        editUser={editUser}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        modalMode={modalMode}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleModalSubmit}
        accessToken={accessToken}
        reload={reload}
        setReload={setReload}
      />
      
      {loading && <Loading />}
    </div>
  )
}