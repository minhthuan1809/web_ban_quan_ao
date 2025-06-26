"use client"
import { searchUsers_API, deleteUser_API } from '@/app/_service/user';
import useAuthInfor from '@/app/customHooks/AuthInfor';
import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Avatar, Card, Badge, Chip, Skeleton, Input, Dropdown, 
  DropdownTrigger, DropdownMenu, DropdownItem
} from "@nextui-org/react";
import { 
  User, UserPlus, Edit3, Trash2, Users, Search, Filter, 
  MoreVertical, Shield, ShieldCheck, Mail, Phone, MapPin, Plus,
  ChevronDown
} from 'lucide-react';
import Loading from '@/app/_util/Loading';
import { toast } from 'react-toastify';
import ModalAddUse from './ModalAddUse';
import showConfirmDialog from '@/app/_util/Sweetalert2';
import { CustomerSkeleton } from '../_skeleton';
import { useAdminSearchStore } from '@/app/_zustand/admin/SearchStore';

interface UserData {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  district: string;
  ward: string;
  roleId: number;
  avatarUrl: string | null;
  gender: string;
  isVerify: boolean;
  createdAt: number;
  updatedAt: number;
}


const INITIAL_FORM_DATA = {
  fullName: '',
  email: '',
  password: '',
  phone: '',
  address: '',
  district: '',
  ward: '',
  gender: 'MALE',
  roleId: 1
};

const FILTER_OPTIONS = [
  { key: 'all', label: 'Tất cả' },
  { key: '1', label: 'Người dùng' },
  { key: '2', label: 'Admin' }
];

export default function PageUser() {        
  const [users, setUsers] = useState<any | null>(null);
  const { accessToken } = useAuthInfor();
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editUser, setEditUser] = useState<UserData | null>(null);
  const [filterRole, setFilterRole] = useState<'all' | '1' | '2'>('all');
  const [reload, setReload] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { search: searchQuery, type: searchType, setType } = useAdminSearchStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [totalPage, setTotalPage] = useState(1);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const response = await searchUsers_API(accessToken, {
        search: searchQuery,
        page: currentPage,
        limit: limit
      });
      setUsers({ data: response.data.data });
      setTotalPage((response.data as any)?.pagination?.totalPages || 1);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [accessToken, currentPage, limit, reload, searchQuery]);

  // Set type khi vào trang customers
  useEffect(() => {
    setType('user');
  }, [setType]);

  // Debounce search
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    // Chỉ call API khi type là 'user' hoặc rỗng
    if (searchType === 'user' || searchType === '') {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        fetchUsers();
      }, 400);
    }
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [fetchUsers, reload, searchQuery, searchType]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    if (!users?.data) return [];
    
      return users.data.filter((user: any)   => {
        const matchesSearch = !searchQuery || 
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone.includes(searchQuery);
      
      const matchesRole = filterRole === 'all' || user.roleId.toString() === filterRole;
      
      return matchesSearch && matchesRole;
    });
  }, [users?.data, searchQuery, filterRole]);

  // Handlers
  const handleAdd = useCallback(() => {
    setModalMode('add');
    setFormData(INITIAL_FORM_DATA);
    setEditUser(null);
    setShowModal(true);
  }, []);

  const handleEdit = useCallback((user: UserData) => {
    setModalMode('edit');
    setEditUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      password: '',
      phone: user.phone,
      address: user.address,
      district: user.district,
      ward: user.ward,
      gender: user.gender,
      roleId: user.roleId ?? 1
    });
    setShowModal(true);
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    const result = await showConfirmDialog({
      title: 'Xác nhận xóa?',
      text: 'Bạn có chắc chắn muốn xóa người dùng này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    });
    
    if (result.isConfirmed && accessToken) {
      setLoading(true);
      try {
        await deleteUser_API(id, accessToken!);
        toast.success('Xóa người dùng thành công!');
        setReload(!reload);
      } catch (error) {
        toast.error('Xóa người dùng thất bại!');
      } finally {
        setLoading(false);
      }
    }
  }, [accessToken, reload]);

  // Utility functions
  const getRoleConfig = useCallback((roleId: number) => ({
    color: roleId === 2 ? 'danger' : 'primary',
    text: roleId === 2 ? 'Admin' : 'User',
    icon: roleId === 2 ? ShieldCheck : Shield
  }), []);

  const getGenderConfig = useCallback((gender: string) => ({
    color: gender === 'MALE' ? 'primary' : gender === 'FEMALE' ? 'secondary' : 'default',
    text: gender === 'MALE' ? 'Nam' : gender === 'FEMALE' ? 'Nữ' : 'Khác'
  }), []);

  // Loading skeleton
  if (loading && !users) {
    return <CustomerSkeleton />;
  }

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Mobile View */}

      <div>
        <Button
          color="primary"
          variant="flat"
          onPress={handleAdd}
          startContent={<Plus className="w-4 h-4" />}
        >
          Thêm người dùng
        </Button>
      </div>
      <div className="block lg:hidden space-y-4">
        {filteredUsers.map((user: UserData) => {
          const roleConfig = getRoleConfig(user.roleId);
          const genderConfig = getGenderConfig(user.gender);
          const RoleIcon = roleConfig.icon;

          return (
            <Card 
              key={user.id} 
              className="p-5 shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                  <Avatar 
                    src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.fullName}&background=random`}
                    size="lg"
                    className="shadow-md ring-2 ring-white"
                  />
                  {user.isVerify && (
                    <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                      <ShieldCheck className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-800 truncate">{user.fullName}</h3>
                    <Chip 
                      size="sm" 
                      color={roleConfig.color as any}
                      variant="flat"
                      startContent={<RoleIcon className="w-3 h-3" />}
                    >
                      {roleConfig.text}
                    </Chip>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                    <Mail className="w-3 h-3" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Phone className="w-3 h-3" />
                    <span>{user.phone}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600 line-clamp-2">
                    {`${user.address}, ${user.ward}, ${user.district}`}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Giới tính:</span>
                  <Chip 
                    size="sm" 
                    color={genderConfig.color as any}
                    variant="flat"
                  >
                    {genderConfig.text}
                  </Chip>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  color="primary"
                  variant="flat"
                  onPress={() => handleEdit(user)}
                  startContent={<Edit3 className="w-4 h-4" />}
                  className="flex-1"
                >
                  Chỉnh sửa
                </Button>
                <Button
                  size="sm"
                  color="danger"
                  variant="flat"
                  onPress={() => handleDelete(user.id)}
                  startContent={<Trash2 className="w-4 h-4" />}
                  className="flex-1"
                >
                  Xóa
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Desktop Table */}
      <Card className="hidden lg:block shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
        <Table
          aria-label="Bảng người dùng"
          removeWrapper
          classNames={{
            th: "bg-gray-50/80 text-gray-700 font-semibold text-sm py-4 first:rounded-l-lg last:rounded-r-lg border-b-2 border-gray-200",
            td: "py-4 text-gray-700 border-b border-gray-100",
            tr: "hover:bg-blue-50/50 transition-colors duration-200"
          }}
        >
          <TableHeader>
            <TableColumn>STT</TableColumn>
            <TableColumn>THÔNG TIN</TableColumn>
            <TableColumn>LIÊN HỆ</TableColumn>
            <TableColumn>ĐỊA CHỈ</TableColumn>
            <TableColumn>GIỚI TÍNH</TableColumn>
            <TableColumn>VAI TRÒ</TableColumn>
            <TableColumn className="text-center">HÀNH ĐỘNG</TableColumn>
          </TableHeader>
          <TableBody emptyContent={
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg font-medium">Không có dữ liệu người dùng</p>
              <p className="text-gray-400">Thêm người dùng mới để bắt đầu</p>
            </div>
          }>
            {filteredUsers.map((user: UserData, index: number) => {
              const roleConfig = getRoleConfig(user.roleId);
              const genderConfig = getGenderConfig(user.gender);
              const RoleIcon = roleConfig.icon;

              return (
                <TableRow key={user.id} className="group">
                  <TableCell>
                    <div className="font-medium text-gray-600">#{index + 1}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar 
                          src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.fullName}&background=random`}
                          size="md"
                          className="shadow-md ring-2 ring-white"
                        />
                        {user.isVerify && (
                          <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                            <ShieldCheck className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{user.fullName}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-3 h-3 text-gray-400" />
                      <span>{user.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600 line-clamp-2">
                          {`${user.address}, ${user.ward}, ${user.district}`}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      size="sm" 
                      color={genderConfig.color as any}
                      variant="flat"
                    >
                      {genderConfig.text}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      size="sm" 
                      color={roleConfig.color as any}
                      variant="flat"
                      startContent={<RoleIcon className="w-3 h-3" />}
                    >
                      {roleConfig.text}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        onPress={() => handleEdit(user)}
                        startContent={<Edit3 className="w-4 h-4" />}
                      >
                        Sửa
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        onPress={() => handleDelete(user.id)}
                        startContent={<Trash2 className="w-4 h-4" />}
                      >
                        Xóa
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {/* Modal */}
      {accessToken && (
        <ModalAddUse
          editUser={editUser as any}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          modalMode={modalMode}
          formData={formData}
          setFormData={setFormData}
          accessToken={accessToken!}
          reload={reload}
          setReload={setReload}
        />
      )}
    </div>
  );
}