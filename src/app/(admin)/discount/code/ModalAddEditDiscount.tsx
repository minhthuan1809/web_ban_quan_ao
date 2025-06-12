'use client'
import React, { useEffect, useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, Checkbox, Select, SelectItem } from "@nextui-org/react"
import { format } from 'date-fns'
import InputUse from '@/app/components/ui/InputUse'
import { createCoupon_API, updateCoupon_API } from '@/app/_service/discount'
import { toast } from 'react-toastify'
import useAuthInfor from '@/app/customHooks/AuthInfor'

export default function ModalAddEditDiscount({ isOpen, onClose, initialData, onSuccess }: any) {
  const isEditing = !!initialData?.id
  const [isLoading, setIsLoading] = useState(false)
  const { accessToken } = useAuthInfor()
  
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [discountValue, setDiscountValue] = useState(0)
  const [minimumAmount, setMinimumAmount] = useState(0)
  const [maximumDiscount, setMaximumDiscount] = useState(0)
  const [maxUsageCount, setMaxUsageCount] = useState(1)
  const [validFrom, setValidFrom] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [validTo, setValidTo] = useState(format(new Date(new Date().setMonth(new Date().getMonth() + 1)), 'yyyy-MM-dd'))
  const [userSpecific, setUserSpecific] = useState(false)
  const [userIds, setUserIds] = useState<number[]>([])

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      
      // Chuyển đổi date string thành ISO format
      const validFromISO = new Date(validFrom).toISOString()
      const validToISO = new Date(validTo).toISOString()
      
      const data = {
        "name": name,
        "description": description,
        "discountType": ["PERCENTAGE"],
        "discountValue": discountValue,
        "minimumAmount": minimumAmount,
        "maximumDiscount": maximumDiscount,
        "maxUsageCount": maxUsageCount,
        "validFrom": validFromISO,
        "validTo": validToISO,
        "userSpecific": userSpecific,
        "userIds": userIds
      }

      console.log(data)
      
      let res;
      if (isEditing) {
        res = await updateCoupon_API(initialData.id, data);
        if (res.status === 200) {
          toast.success('Cập nhật mã giảm giá thành công')
        }
      } else {
        res = await createCoupon_API(data)
        if (res.status === 200) {
          toast.success('Thêm mã giảm giá thành công')
        }
      }
      
      if (res.status === 200) {
        if (onSuccess) onSuccess();
        onClose()
        // Reset form
        resetForm()
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi xử lý mã giảm giá')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setName('')
    setDescription('')
    setDiscountValue(0)
    setMinimumAmount(0)
    setMaximumDiscount(0)
    setMaxUsageCount(1)
    setValidFrom(format(new Date(), 'yyyy-MM-dd'))
    setValidTo(format(new Date(new Date().setMonth(new Date().getMonth() + 1)), 'yyyy-MM-dd'))
    setUserSpecific(false)
    setUserIds([])
  }

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '')
      setDescription(initialData.description || '')
      setDiscountValue(initialData.discountValue || 0)
      setMinimumAmount(initialData.minimumAmount || 0)
      setMaximumDiscount(initialData.maximumDiscount || 0)
      setMaxUsageCount(initialData.maxUsageCount || 1)
      setValidFrom(initialData.validFrom ? format(new Date(initialData.validFrom), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'))
      setValidTo(initialData.validTo ? format(new Date(initialData.validTo), 'yyyy-MM-dd') : format(new Date(new Date().setMonth(new Date().getMonth() + 1)), 'yyyy-MM-dd'))
      setUserSpecific(initialData.userSpecific || false)
      setUserIds(initialData.userIds || [])
    } else {
      resetForm()
    }
  }, [initialData, isOpen])


  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSubmit()
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="5xl" 
      className='z-[100]'
      scrollBehavior="inside"
      backdrop="blur"
    >
      <ModalContent>
        <form onSubmit={handleFormSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold">
              {isEditing ? 'Sửa mã giảm giá' : 'Thêm mã giảm giá mới'}
            </h2>
          </ModalHeader>
          
          <ModalBody className="gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cột trái */}
              <div className="flex flex-col gap-4">
              
                
                <Input
                  label="Tên mã giảm giá"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập tên mã giảm giá"
                  variant="bordered"
                  labelPlacement="outside"
                  isRequired
                />
                
                <Textarea
                  label="Mô tả"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Nhập mô tả mã giảm giá"
                  variant="bordered"
                  labelPlacement="outside"
                  minRows={3}
                />
         
                
       
              </div>
              
              {/* Cột phải */}
              <div className="flex flex-col gap-4">
                <Input
                  type="number"
                  label="Giá trị đơn hàng tối thiểu"
                  value={minimumAmount.toString()}
                  onChange={(e) => setMinimumAmount(parseFloat(e.target.value) || 0)}
                  placeholder="0 = không giới hạn"
                  variant="bordered"
                  labelPlacement="outside"
                  endContent={
                    <span className="text-small text-default-400">VNĐ</span>
                  }
                />
                
                <Input
                  type="number"
                  label="Giảm giá tối đa"
                  value={maximumDiscount.toString()}
                  onChange={(e) => setMaximumDiscount(parseFloat(e.target.value) || 0)}
                  placeholder="0 = không giới hạn"
                  variant="bordered"
                  labelPlacement="outside"
                  endContent={
                    <span className="text-small text-default-400">VNĐ</span>
                  }
                />
                
                <Input
                  type="number"
                  label="Số lần sử dụng tối đa"
                  value={maxUsageCount.toString()}
                  onChange={(e) => setMaxUsageCount(parseInt(e.target.value) || 1)}
                  placeholder="Nhập số lần sử dụng"
                  variant="bordered"
                  labelPlacement="outside"
                  min={1}
                  isRequired
                />
                
                {/* Date Inputs - Sử dụng input type="date" */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Ngày bắt đầu *
                    </label>
                    <Input
                      type="date"
                      value={validFrom}
                      onChange={(e) => setValidFrom(e.target.value)}
                      variant="bordered"
                      isRequired
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Ngày kết thúc *
                    </label>
                    <Input
                      type="date"
                      value={validTo}
                      onChange={(e) => setValidTo(e.target.value)}
                      variant="bordered"
                      isRequired
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* User Specific Section */}
            <div className="border-t pt-4">
              <div className="flex items-center gap-3 mb-4">
                <Checkbox
                  isSelected={userSpecific}
                  onValueChange={(checked) => {
                    setUserSpecific(checked)
                    if (!checked) {
                      setUserIds([])
                    }
                  }}
                />
                <span className="text-sm font-medium">Áp dụng cho người dùng cụ thể</span>
              </div>
              
              {userSpecific && (
                <div className="ml-6">
                  <p className="text-sm text-default-500 mb-3">
                    Chọn người dùng được áp dụng mã giảm giá này:
                  </p>
                  <InputUse 
                    setUse={(value: any) => setUserIds(Array.isArray(value) ? value.map((id: any) => Number(id)) : [])} 
                    use={Array.isArray(userIds) ? userIds.map((id: any) => id.toString()) : []} 
                  />
                </div>
              )}
            </div>
          </ModalBody>
          
          <ModalFooter>
            <Button 
              color="danger" 
              variant="light" 
              onPress={onClose} 
              isDisabled={isLoading}
            >
              Hủy
            </Button>
            <Button 
              color="primary" 
              type="submit" 
              isLoading={isLoading}
              className="font-medium"
            >
              {isEditing ? 'Cập nhật' : 'Tạo mã giảm giá'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}