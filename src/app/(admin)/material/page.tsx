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
import TitleSearchAdd from "@/app/components/ui/TitleSearchAdd";

export default function Material() {
  const [material, setMaterial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const limit = 10;
  const [isOpen, setIsOpen] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const[refresh, setRefresh] = useState(false);
  const [editMaterial, setEditMaterial] = useState<any>(null);
  const [totalPage, setTotalPage] = useState(10);

  const [name, setName] = useState("");
  const { accessToken } = useAuthInfor();




  const fetchCategory = useCallback(async () => {
    if (!accessToken) return;
    try {
      
      setLoading(true);
      const response = await getmaterial_API(
        searchValue,
        currentPage,
        limit,
        "",
        ""
      );
      
      setMaterial(response.data.reverse());
      setTotalPage(response.metadata.total_page);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [accessToken, currentPage, limit , refresh]);
  

  // debounce search
  useEffect(() => {
    const time = setTimeout(() => {
      fetchCategory();
    }, 1000);
    return () => clearTimeout(time);
  }, [fetchCategory,searchValue]);


  // thêm vật liệu
  const handleAddMaterial = async () => {
    try {
      setLoadingBtn(true);
      const response: any = await addMaterial_API(name, accessToken);
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
      const response: any = await deleteMaterial_API(id, accessToken);
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
        const response: any = await updateMaterial_API(editMaterial.id, name, accessToken);
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
     <TitleSearchAdd
        title={{
          title: "Chất liệu",
          search: "Tìm kiếm chất liệu...",
          btn: "Thêm chất liệu"
        }}
        onSearch={(value) => setSearchValue(value)}
        onAdd={() => {
          setIsOpen(true)
          setEditMaterial(null)
          setName("")
        }}
      />  
      {/* render bảng */}
      {loading ? <div className="flex justify-center items-center min-h-[400px]"><Loading/></div> : <RenderTable data={material} handleDelete={handleDeleteMaterial} handleEdit={handleEditMaterial} totalPage={totalPage} currentPage={currentPage} setCurrentPage={setCurrentPage} title="chất liệu"/>}
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
