'use client'
import React, { useEffect, useState } from 'react'
    import { Button, Card, CardBody, code, Input, Modal, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react"
import TitleSearchAdd from '@/app/components/ui/TitleSearchAdd'
import { ModalBody } from '@nextui-org/react'
import useAuthInfor from '@/app/customHooks/AuthInfor'
import { toast } from 'react-toastify'
import RenderTable from '../_conponents/RenderTable'
import { addColor_API, DeleteColor_API, GetAllColor_API, updateColor_API } from '@/app/_service/color'
import Modal_addEditColor from './Modal_addEditColor'

interface ColorData {
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
  const [color, setColor] = useState<ColorData[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [loadingBtn, setLoadingBtn] = useState(false)
  const [editColor, setEditColor] = useState<ColorData | null>(null)
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
            const res = await GetAllColor_API(searchQuery, currentPage, accessToken)
        setColor
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
      const res = await addColor_API(name, accessToken)
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
    if (!confirm('Bạn có chắc chắn muốn xóa kích cỡ này không?')) return
    try {
      setLoadingBtn(true)
      const res = await DeleteColor_API(id, accessToken)
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

  const handleEdit = async (item: ColorData) => {
    setEditColor(item)
    setIsOpen(true)
    setName(item.name)
  }

  const handleEditSize = async () => {
    try {
      setLoadingBtn(true)
      const res = await updateColor_API(editColor?.id.toString() || "", name, accessToken)
      if (res.status === 200) {
        toast.success('Sửa kích cỡ thành công')
        setIsOpen(false)
        setName("")
        setEditColor(null)
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
            title: "Quản lý màu sắc",
            search: "Tìm kiếm màu sắc...",
            btn: "Thêm màu sắc"
          }}
          onSearch={(value) => setSearchQuery(value)}
          onAdd={() => {
            setEditColor(null)
            setName("")
            setIsOpen(true)
          }}
        />
        <CardBody>
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <RenderTable 
              data={color} 
              handleDelete={handleDelete} 
              handleEdit={handleEdit} 
              totalPage={metadata.total_page} 
              currentPage={currentPage} 
              setCurrentPage={setCurrentPage} 
              title="màu sắc"
            />
          )}
        </CardBody>
      </Card>

      <Modal_addEditColor
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setEditColor={setEditColor}
        setName={setName}
        name={name}
        code={code}
        setCode={setCode}
        handleAddSize={handleAddSize}
        loadingBtn={loadingBtn}
        editColor={!!editColor}
      />
    </div>
  )
}
