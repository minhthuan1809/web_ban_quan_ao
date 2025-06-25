'use client'
import { addCategory_API, deleteCategory_API, getCategory_API, updateCategory_API } from '@/app/_service/category';
import React, { useCallback, useEffect, useState } from 'react'
import { Button, Input, Spinner } from "@nextui-org/react";
import { Plus, Search } from 'lucide-react';

import ModalAdd_Edit_Category_Material from '../_modal/ModalAdd_Edit_Category_Material';
import useAuthInfor from '@/app/customHooks/AuthInfor';
import { toast } from 'react-toastify';
import Loading from '@/app/_util/Loading';
import RenderTable from '../_conponents/RenderTable';
import TitleSearchAdd from '@/app/components/ui/TitleSearchAdd';

interface Category {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
}

export default function Category() {
    const [category, setCategory] = useState<Category[]>([]);
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
            const response = await getCategory_API({
                search: searchValue,
                page: currentPage,
                pageSize: rowsPerPage,
                sort: "createdAt:desc",
                filter: ""
            });
            setCategory(response.data.reverse());
            setTotalPage(response.pagination?.totalPages || 1);
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
        if (!accessToken) {
            toast.error("Vui lòng đăng nhập lại");
            return;
        }
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
            const response: any = await addCategory_API(name, accessToken as string); 
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
            const response: any = await updateCategory_API(editCategory.id as string, name, accessToken as string   );
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

    if (loading) {
        return <Loading/>
    }

    
    return (
        <div className="p-6 w-full">
          <TitleSearchAdd
            title={{
              title: "Danh Mục",
              search: "Tìm kiếm phân loại...",
              btn: "Thêm Danh Mục"
            }}
            onSearch={(value) => setSearchValue(value)}
            onAdd={() => {
                setEditCategory(null)
                setName("")
                setIsOpen(true)
            }}
          />

            { loading ? <Loading/>: <RenderTable data={category as any  } handleDelete={handleDelete} handleEdit={handleEdit} totalPage={totalPage} currentPage={currentPage} setCurrentPage={setCurrentPage} title="danh mục"/>}
            {/* modal thêm sửa danh mục */}
            <ModalAdd_Edit_Category_Material
                isOpen={loading ? false : isOpen}
                onClose={() => {
                    setIsOpen(false);
                    setEditCategory(null);
                    setName("");
                }}
                title={editCategory ? "Sửa danh mục" : "Thêm danh mục"}
                titleInput="Tên danh mục"
                name={name}
                setName={setName}
                handleFinish={editCategory ? handleFinishEdit : handleAddCategory}
                loadingBtn={loadingBtn}
                dataEdit={editCategory}
            />
        </div>
    );
}   
