'use client'
import React, { useEffect, useState } from 'react'
import { addSize_API, DeleteSize_API, GetAllSize_API, updateSize_API } from '@/app/_service/size'
import { Card, CardBody } from "@nextui-org/react"
import TitleSearchAdd from '@/app/components/ui/TitleSearchAdd'
import ModalAdd_Edit_Category_Material from '../_modal/ModalAdd_Edit_Category_Material'
import useAuthInfor from '@/app/customHooks/AuthInfor'
import { toast } from 'react-toastify'
import RenderTable from '../_conponents/RenderTable'
import showConfirmDialog from '@/app/_util/Sweetalert2'
import { SizeSkeleton } from '../_skeleton'

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
  const [searchQuery, setSearchQuery] = useState("")
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
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const { accessToken } = useAuthInfor()

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await GetAllSize_API(searchQuery, currentPage, accessToken)
      setSize(res.data)
      setMetadata(res.metadata)
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (accessToken) {
      const timer = setTimeout(() => {
        fetchData()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [searchQuery, currentPage, accessToken])

  const handleAddSize = async () => {
    try {
      setLoadingBtn(true)
      const res = await addSize_API(name, accessToken)
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
      const res = await DeleteSize_API(id, accessToken)
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
      const res = await updateSize_API(editSize?.id.toString() || "", name, accessToken)
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
        <TitleSearchAdd 
          title={{
            title: "Quản lý kích cỡ",
            search: "Tìm kiếm kích cỡ...",
            btn: "Thêm kích cỡ"
          }}
          onSearch={(value) => setSearchQuery(value)}
          onAdd={() => {
            setEditSize(null)
            setName("")
            setIsOpen(true)
          }}
        />
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
