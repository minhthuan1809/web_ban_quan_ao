"use client";
import { addMaterial_API, deleteMaterial_API, getmaterial_API, updateMaterial_API } from "@/app/_service/category";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Input, Spinner } from "@nextui-org/react";
import { Plus, Search } from "lucide-react";
import RenderTable from "../_conponents/RenderTable";
import ModalAdd_Edit_Category_Material from "../_modal/ModalAdd_Edit_Category_Material";
import useAuthInfor from "@/app/customHooks/AuthInfor";
import { toast } from "react-toastify";
import Loading from "@/app/_util/Loading";
import { MaterialSkeleton } from "../_skeleton";
import type { Material } from '@/types/product';
import { useAdminSearchStore } from '@/app/_zustand/admin/SearchStore';

export default function Material() {
  const [material, setMaterial] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
  const [currentPage, setCurrentPage] = useState(0);
  const [searchValue, setSearchValue] = useState("");
=======
  const [currentPage, setCurrentPage] = useState(1);
  const { search: searchValue, type: searchType, setType, setSearch } = useAdminSearchStore();
>>>>>>> f0c633c967f0243bc80136c41a5c34cb4db6afa3
  const limit = 10;
  const [isOpen, setIsOpen] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [editMaterial, setEditMaterial] = useState<any>(null);
  const [totalPage, setTotalPage] = useState(10);

  const [name, setName] = useState("");
  const { accessToken } = useAuthInfor();

  const fetchCategory = useCallback(async () => {
    if (!accessToken) return;
    try {
      setLoading(true);
      const response = await getmaterial_API({
        search: searchValue,
        page: currentPage,
        pageSize: limit,
        sort: "createdAt:desc",
        filter: ""
      });
      // Đảm bảo id là number, createdAt là string
      const materialData = (response.data as any[]).map((item) => ({
        ...item,
        id: typeof item.id === 'string' ? Number(item.id) : item.id,
        createdAt: item.createdAt ? String(item.createdAt) : '',
        updatedAt: item.updatedAt ? String(item.updatedAt) : '',
      }));
      setMaterial(materialData.reverse());
      setTotalPage(response.pagination?.totalPages || 1);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [accessToken, currentPage, limit , refresh, searchValue]);
  
  // Set type khi vào trang material
  useEffect(() => {
    setType('material');
  }, [setType]);

  // debounce search
  useEffect(() => {
    // Chỉ call API khi type là 'material' hoặc rỗng
    if (searchType === 'material' || searchType === '') {
      const time = setTimeout(() => {
        fetchCategory();
      }, 1000);
      return () => clearTimeout(time);
    }
  }, [fetchCategory, searchValue, searchType]);

  // thêm vật liệu
  const handleAddMaterial = async () => {
    try {
      setLoadingBtn(true);
      const response: any = await addMaterial_API(name, accessToken || "");
      if (response.status === 200) {
        setIsOpen(false);
        setName("");
        toast.success("Thêm vật liệu thành công");
        setRefresh(!refresh);
      } else {
        toast.error("Thêm vật liệu thất bại");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thêm vật liệu");
    } finally {
      setLoadingBtn(false);
    }
  };

  // xóa vật liệu
  const handleDeleteMaterial = async (id: string) => {
    try {
      const response: any = await deleteMaterial_API(id || "", accessToken || "");
      if (response.status === 204) {
        toast.success("Xóa vật liệu thành công");
        setRefresh(!refresh);
      } else {
        toast.error("Xóa vật liệu thất bại");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa vật liệu");
    } finally {
      setLoadingBtn(false);
    }
  }
// sửa vật liệu
  const handleEditMaterial = (item: any) => {
    setEditMaterial(item);
    setIsOpen(true);
  }

  const handleFinishEdit = async () => {
    try {
      setLoadingBtn(true);
      if (editMaterial) {
        const response: any = await updateMaterial_API(editMaterial.id || "", name, accessToken || "");
        if (response.status === 200) {
          toast.success("Sửa vật liệu thành công");
          setRefresh(!refresh);
          setEditMaterial(null);
          setName("");
          setIsOpen(false);
        } else {
          toast.error("Sửa vật liệu thất bại");
        }
      } else {
        handleAddMaterial();
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi sửa vật liệu");
    } finally {
      setLoadingBtn(false);
    }
  }



  return (
    <div className="p-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-border mb-4 gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Button
            color="primary"
            className="h-[40px] font-medium w-full sm:w-auto"
            startContent={<Plus size={18} />}
            onClick={() => {
              setIsOpen(true)
              setEditMaterial(null)
              setName("")
            }}
          >
            Thêm chất liệu
          </Button>
        </div>
      </div>
      {/* render bảng */}
      {loading ? <MaterialSkeleton /> : (
        <RenderTable
          data={material.map(item => ({
            ...item,
            createdAt: item.createdAt ? String(item.createdAt) : '',
            updatedAt: item.updatedAt ? String(item.updatedAt) : '',
            isDeleted: item.isDeleted ?? false,
          }))}
          handleDelete={handleDeleteMaterial}
          handleEdit={handleEditMaterial}
          totalPage={totalPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          title="chất liệu"
        />
      )}
      {/*  modal thêm vật liệu */}
      <ModalAdd_Edit_Category_Material
        isOpen={loading ? false : isOpen}
        onClose={() => {
          setIsOpen(false);
          setEditMaterial(null);
          setName("");
        }}
        title="Thêm chất liệu"
        titleInput="Tên chất liệu"
        name={name}
        setName={setName}
        handleFinish={editMaterial ? handleFinishEdit : handleAddMaterial}
        loadingBtn={loadingBtn}
        dataEdit={editMaterial}
      />
    </div>
  );
}
