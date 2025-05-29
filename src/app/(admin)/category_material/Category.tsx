'use client'
import { addCategory_API, deleteCategory_API, getCategory_API, updateCategory_API } from '@/app/_service/category';
import React, { useCallback, useEffect, useState } from 'react'
import { Button, Input, Spinner } from "@nextui-org/react";
import { Plus, Search } from 'lucide-react';
import getTable from './getTable';
import ModalAdd_Edit_Category_Material from './ModalAdd_Edit_Category_Material';
import useAuthInfor from '@/app/customHooks/AuthInfor';
import { toast } from 'react-toastify';
import Loading from '@/app/_util/Loading';

export default function Category() {
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState("");
    const rowsPerPage = 10;
    const [refresh, setRefresh] = useState(false);
    const [editCategory, setEditCategory] = useState<any>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [loadingBtn, setLoadingBtn] = useState(false);
    const [totalPage, setTotalPage] = useState(0);
    const { accessToken } = useAuthInfor();

    const fetchCategory = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getCategory_API(searchValue, currentPage, rowsPerPage, "", "");
            setCategory(response.data);
            setTotalPage(response.metadata.total_page);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
        }, [currentPage, searchValue, refresh, accessToken]);

    useEffect(() => {   
        const time = setTimeout(() => {
            fetchCategory();
        }, 1000);
        return () => clearTimeout(time);
    }, [fetchCategory,searchValue]);

    // xóa phân loại
    const handleDelete = async (id: string) => {
        try {
            setLoadingBtn(true);
            const response: any = await deleteCategory_API(id, accessToken);
            if (response.status === 204) {
                toast.success("Xóa phân loại thành công");
                setRefresh(!refresh);
            } else {
                toast.error("Xóa phân loại thất bại");
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra khi xóa phân loại");
        } finally {
            setLoadingBtn(false);
        }
    }   

    // thêm phân loại
    const handleAddCategory = async () => {
        try {
            setLoadingBtn(true);
            const response: any = await addCategory_API(name, accessToken); 
            if (response.status === 200) {
                toast.success("Thêm phân loại thành công");
                setRefresh(!refresh);
                setName("");
                setIsOpen(false);
            } else {
                toast.error("Thêm phân loại thất bại");
            }   
        } catch (error) {
            toast.error("Có lỗi xảy ra khi thêm phân loại");
        } finally {
            setLoadingBtn(false);
        }
    }

    // sửa phân loại

    const handleEdit = async (item: any) => {
        setEditCategory(item);
        setIsOpen(true);
    }

    const handleFinishEdit = async () => {
        try {
            setLoadingBtn(true);
            const response: any = await updateCategory_API(editCategory.id, name, accessToken);
            if (response.status === 200) {
                toast.success("Sửa phân loại thành công");
                setRefresh(!refresh);
                setEditCategory(null);
                setName("");
                setIsOpen(false);
            } else {
                toast.error("Sửa phân loại thất bại");
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra khi sửa phân loại");
        } finally {
            setLoadingBtn(false);
        }
    }

    
    return (
        <div className="p-6 w-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Phân loại</h1>
                <Button className="bg-blue-500 text-white" startContent={<Plus size={20} />} onPress={() => setIsOpen(true)}>
                    Thêm phân loại
                </Button>
            </div>

            <div className="flex justify-between items-center mb-6">
                <Input
                    placeholder="Tìm kiếm phân loại..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    startContent={<Search size={20} />}
                    className="w-80"
                />
            </div>

            { loading ? <div className="flex justify-center items-center min-h-[400px]"><Loading/></div> : getTable(category.reverse(), handleDelete, handleEdit, totalPage, currentPage, setCurrentPage)}
            {/* modal thêm sửa phân loại */}
            <ModalAdd_Edit_Category_Material
                isOpen={loading ? false : isOpen}
                onClose={() => {
                    setIsOpen(false);
                    setEditCategory(null);
                    setName("");
                }}
                title="Thêm phân loại"
                titleInput="Tên phân loại"
                name={name}
                setName={setName}
                handleFinish={editCategory ? handleFinishEdit : handleAddCategory}
                loadingBtn={loadingBtn}
                dataEdit={editCategory}
            />
        </div>
    );
}   
