'use client'
import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, Pagination, Input, Modal, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react"
import TitleSearchAdd from '@/app/components/ui/TitleSearchAdd'
import { ModalBody } from '@nextui-org/react'
import useAuthInfor from '@/app/customHooks/AuthInfor'
import { toast } from 'react-toastify'
import RenderTable from '../_conponents/RenderTable'
import { addColor_API, DeleteColor_API, GetAllColor_API, updateColor_API } from '@/app/_service/color'
import Modal_addEditColor from './Modal_addEditColor'
import { EditIcon, PencilIcon, TrashIcon } from 'lucide-react'
import showConfirmDialog from '@/app/_util/Sweetalert2'
import { ColorSkeleton } from '../_skeleton'

interface ColorData {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  hexColor: string;
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
      setColor(res.data)
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
      const res = await addColor_API(name, code, accessToken)
      if (res.status === 200) {
        toast.success('Thêm màu sắc thành công')
        setIsOpen(false)
        setName("")
        setCode("")
        fetchData()
      }
    } catch (error: any) {
      toast.error(error.message || 'Thêm màu sắc thất bại')
    } finally {
      setLoadingBtn(false)
    }
  }

  const handleDelete = async (id: string) => {
    const result = await showConfirmDialog({
      title: 'Xác nhận xóa?',
      text: `Bạn có chắc chắn muốn xóa màu sắc này?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    })
    if (result.isConfirmed) {
            try {
        setLoadingBtn(true)
        const res = await DeleteColor_API(id, accessToken)
        if (res.status === 204 ) {
          toast.success('Xóa màu sắc thành công')
          fetchData()
        } else {
          toast.error('Xóa màu sắc thất bại')
        }
      } catch (error: any) {
        toast.error(error.message || 'Xóa màu sắc thất bại')
      } finally {
        setLoadingBtn(false)
      }
    }
   
  }     

  const handleEdit = async (item: ColorData) => {
    setEditColor(item)
    setIsOpen(true)
    setName(item.name)
    setCode(item.hexColor)
  }

  const handleEditSize = async () => {
    try {
      setLoadingBtn(true)
      const res = await updateColor_API(editColor?.id.toString() || "", name, code, accessToken)
      if (res.status === 200) {
        toast.success('Sửa màu sắc thành công')
        setIsOpen(false)
        setName("")
        setCode("")
        setEditColor(null)
        fetchData()
      } else {
        toast.error('Sửa màu sắc thất bại')
      }
    } catch (error: any) {
      toast.error(error.message || 'Sửa màu sắc thất bại')
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
            setCode("")
            setIsOpen(true)
          }}
        />
        <CardBody>
          {loading ? (
            <ColorSkeleton />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-center">ID</th>
                    <th scope="col" className="px-6 py-3 text-center">Tên màu sắc</th>
                    <th scope="col" className="px-6 py-3 text-center">Mã màu</th>
                    <th scope="col" className="px-6 py-3 text-center">Màu sắc</th>
                    <th scope="col" className="px-6 py-3 text-center">Ngày tạo</th>
                    <th scope="col" className="px-6 py-3 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {color.length > 0 ? (
                    color.map((item) => (
                      <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4 text-center">{item.id}</td>
                        <td className="px-6 py-4 text-center">{item.name}</td>
                        <td className="px-6 py-4 text-center">{item.hexColor}</td>
                        <td className="px-6 py-4 flex justify-center">
                          <div 
                            className="w-8 h-8 rounded-full text-center" 
                            style={{ backgroundColor: item.hexColor }}
                          ></div>
                        </td>
                        <td className="px-6 py-4 text-center">{new Date(Number(item.createdAt)).toLocaleDateString('vi-VN')}</td>
                        <td className="px-6 py-4 text-center flex gap-2 justify-center">
                          <Button 
                            color="primary" 
                            size="sm" 
                            onClick={() => handleEdit(item)}
                          >
                            <PencilIcon className="w-4 h-4 text-white" />
                          </Button>
                          <Button 
                            color="danger" 
                            size="sm" 
                            onClick={() => handleDelete(item.id.toString())}
                          >
                            <TrashIcon className="w-4 h-4 text-white" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center">Không có dữ liệu</td>
                    </tr>
                  )}
                </tbody>
              </table>
              
              {metadata.total_page > 1 && (
                <div className="flex justify-center mt-4">
                  <Pagination
                    showControls
                    total={metadata.total_page}
                    initialPage={currentPage}
                    page={currentPage}
                    onChange={setCurrentPage}
                    size="sm"
                  />
                </div>
              )}
            </div>
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
        handleAddSize={editColor ? handleEditSize : handleAddSize}
        loadingBtn={loadingBtn}
        editColor={!!editColor}
      />
    </div>
  )
}
