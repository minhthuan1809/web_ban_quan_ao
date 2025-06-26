'use client'
import React, { useEffect, useState, useCallback } from 'react'
import { addSize_API, DeleteSize_API, GetAllSize_API, updateSize_API } from '@/app/_service/size'
import { Card, CardBody } from "@nextui-org/react"
import ModalAdd_Edit_Category_Material from '../_modal/ModalAdd_Edit_Category_Material'
import useAuthInfor from '@/app/customHooks/AuthInfor'
import { toast } from 'react-toastify'
import RenderTable from '../_conponents/RenderTable'
import showConfirmDialog from '@/app/_util/Sweetalert2'
import { SizeSkeleton } from '../_skeleton'
import { Button } from "@nextui-org/react"
import { Plus } from "lucide-react"
import { useAdminSearchStore } from '@/app/_zustand/admin/SearchStore'

interface SizeData {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

interface Metadata {
  page: number;
  page_size: number;
  total: number;
  total_page: number;
  ranger: {
    from: number;
    to: number;
  };
}

export default function page() {
  const [size, setSize] = useState<SizeData[]>([])
  const { search: searchValue, type: searchType } = useAdminSearchStore()
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState("")
  const [loadingBtn, setLoadingBtn] = useState(false)
  const [editSize, setEditSize] = useState<SizeData | null>(null)
  const [metadata, setMetadata] = useState<Metadata>({
    page: 0,
    page_size: 0,
    total: 0,
    total_page: 0,
    ranger: {
      from: 0,
      to: 0
    }
  })
  const [currentPage, setCurrentPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const { accessToken } = useAuthInfor()

  const fetchData = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const res = await GetAllSize_API(searchValue || "", currentPage, accessToken || "");
      setSize(res.data);
      setMetadata(res.metadata);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchValue, currentPage, accessToken]);

  useEffect(() => {
    if (searchType === 'size' || searchType === '') {
      const timer = setTimeout(() => {
        fetchData();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [fetchData, searchType]);

  const handleAddSize = async () => {
    try {
      setLoadingBtn(true)
      const res = await addSize_API(name, accessToken || "")
      if (res.status === 200) {
        toast.success('Thêm kích cỡ thành công')
        setIsOpen(false)
        setName("")
        fetchData()
      }
    } catch (error: any) {
      toast.error(error.message || 'Thêm kích cỡ thất bại')
    } finally {
      setLoadingBtn(false)
    }
  }

  const handleDelete = async (id: string) => {
    const result = await showConfirmDialog({
      title: 'Xác nhận xóa?',
      text: `Bạn có chắc chắn muốn xóa kích cỡ này?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    })
    if (result.isConfirmed) {
        try {
      setLoadingBtn(true)
      const res = await DeleteSize_API(id, accessToken || "")
      if (res.status === 204 ) {
        toast.success('Xóa kích cỡ thành công')
        fetchData()
      } else {
        toast.error('Xóa kích cỡ thất bại')
      }
    } catch (error: any) {
      toast.error(error.message || 'Xóa kích cỡ thất bại')
    } finally {
      setLoadingBtn(false)
    }
    }
  }     

  const handleEdit = async (item: SizeData) => {
    setEditSize(item)
    setIsOpen(true)
    setName(item.name)
  }

  const handleEditSize = async () => {
    try {
      setLoadingBtn(true)
      const res = await updateSize_API(editSize?.id.toString() || "", name, accessToken || "")
      if (res.status === 200) {
        toast.success('Sửa kích cỡ thành công')
        setIsOpen(false)
        setName("")
        setEditSize(null)
        fetchData()
      } else {
        toast.error('Sửa kích cỡ thất bại')
      }
    } catch (error: any) {
      toast.error(error.message || 'Sửa kích cỡ thất bại')
    } finally {
      setLoadingBtn(false)
    }
  }

  return (
    <div className="p-4">
      <Card className="shadow-sm border border-border rounded-lg bg-background">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-border mb-4 gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Button
              color="primary"
              className="h-[40px] font-medium w-full sm:w-auto"
              startContent={<Plus size={18} />}
              onClick={() => {
                setIsOpen(true)
                setEditSize(null)
                setName("")
              }}
            >
              Thêm kích cỡ
            </Button>
          </div>
        </div>
        <CardBody>
          {loading ? (
            <SizeSkeleton />
          ) : (
            <RenderTable 
              data={size} 
              handleDelete={handleDelete} 
              handleEdit={handleEdit} 
              totalPage={metadata.total_page} 
              currentPage={currentPage} 
              setCurrentPage={setCurrentPage} 
              title="kích cỡ"
            />
          )}
        </CardBody>
      </Card>

      <ModalAdd_Edit_Category_Material
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
          setEditSize(null)
          setName("")
        }}
        title={editSize ? "Sửa kích cỡ" : "Thêm kích cỡ"}
        titleInput="Tên kích cỡ"
        name={name}
        setName={setName}
        handleFinish={editSize ? handleEditSize : handleAddSize}
        loadingBtn={loadingBtn}
        dataEdit={editSize}
      />
    </div>
  )
} 
