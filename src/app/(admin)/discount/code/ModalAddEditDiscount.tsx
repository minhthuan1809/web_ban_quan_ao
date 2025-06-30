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
  const { accessToken } = useAuthInfor()
  const [isLoading, setIsLoading] = useState(false)
  
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [discountType, setDiscountType] = useState('PERCENTAGE')
  const [discountValue, setDiscountValue] = useState(10)
  const [minimumAmount, setMinimumAmount] = useState(0)
  const [maximumDiscount, setMaximumDiscount] = useState(0)
  const [maxUsageCount, setMaxUsageCount] = useState(1)
  const [validFrom, setValidFrom] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [validTo, setValidTo] = useState(format(new Date(new Date().setMonth(new Date().getMonth() + 1)), 'yyyy-MM-dd'))
  const [userSpecific, setUserSpecific] = useState(false)
  const [userIds, setUserIds] = useState<number[]>([])

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value.toUpperCase())
  }

  const handleSubmit = async () => {
    if (!accessToken) {
      toast.error('Không có quyền truy cập');
      return;
    }

    setIsLoading(true)
    try {
      // Chuyển đổi date string thành ISO format
      const validFromDate = new Date(validFrom)
      validFromDate.setHours(0, 0, 0, 0)
      const validFromISO = validFromDate.toISOString()
      
      const validToDate = new Date(validTo)
      validToDate.setHours(23, 59, 59, 999)
      const validToISO = validToDate.toISOString()
      
      const data = {
        "code": code,
        "name": name,
        "description": description,
        "discountType": discountType,
        "discountValue": discountValue,
        "minimumAmount": minimumAmount,
        "maximumDiscount": maximumDiscount,
        "maxUsageCount": maxUsageCount,
        "validFrom": validFromISO,
        "validTo": validToISO,
        "userSpecific": userSpecific,
        "userIds": userIds,
        "isAdmin": true
      }

      
      let res;
      if (isEditing) {
        res = await updateCoupon_API(initialData.id, data, accessToken);
        if (res.status === 200) {
          toast.success('Cập nhật mã giảm giá thành công')
        }
      } else {
        res = await createCoupon_API(data, accessToken)
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
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi xử lý mã giảm giá')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setCode('')
    setName('')
    setDescription('')
    setDiscountType('PERCENTAGE')
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
      setCode(initialData.code || '')
      setName(initialData.name || '')
      setDescription(initialData.description || '')
      setDiscountType(initialData.discountType || 'PERCENTAGE')
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
                  label="Mã giảm giá"
                  value={code}
                  onChange={e => {
                    const val = e.target.value
                      .toUpperCase()
                      .replace(/[^A-Z0-9_]/g, "");
                    setCode(val);
                  }}
                  placeholder="Nhập mã giảm giá (A-Z, 0-9, _)"
                  variant="bordered"
                  labelPlacement="outside"
                  isRequired
                  className="uppercase"
                />
                
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
                
                <Select
                  label="Loại giảm giá"
                  placeholder="Chọn loại giảm giá"
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                  variant="bordered"
                  labelPlacement="outside"
                  isRequired
                >
                  <SelectItem key="PERCENTAGE" value="PERCENTAGE">Phần trăm (%)</SelectItem>
                  <SelectItem key="FIXED_AMOUNT" value="FIXED_AMOUNT">Số tiền cố định (VNĐ)</SelectItem>
                </Select>
              </div>
              
              {/* Cột phải */}
              <div className="flex flex-col gap-4">
                <Input
                  type="number"
                  label="Giá trị giảm giá"
                  value={discountValue.toString()}
                  onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                  placeholder={discountType === 'PERCENTAGE' ? "Nhập % giảm giá" : "Nhập số tiền giảm giá"}
                  variant="bordered"
                  labelPlacement="outside"
                  endContent={
                    <span className="text-small text-default-400">
                      {discountType === 'PERCENTAGE' ? '%' : 'VNĐ'}
                    </span>
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
                  label="Số tiền để áp dụng mã giảm giá"
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
              onPress={handleSubmit}
              isLoading={isLoading}
              className="font-medium"
            >
              {isEditing ? 'Cập nhật' : 'Tạo mã giảm giá'}
            </Button>
          </ModalFooter>
      </ModalContent>
    </Modal>
  )
}