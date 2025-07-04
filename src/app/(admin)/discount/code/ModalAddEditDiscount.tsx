'use client'
import React, { useEffect, useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, Checkbox, Select, SelectItem, RadioGroup, Radio } from "@nextui-org/react"
import { format } from 'date-fns'
import InputUse from '@/app/components/ui/InputUse'
import { createCoupon_API, updateCoupon_API } from '@/app/_service/discount'
import { toast } from 'react-toastify'
import useAuthInfor from '@/app/customHooks/AuthInfor'
import { getUserById_API } from '@/app/_service/user'

export default function ModalAddEditDiscount({ isOpen, onClose, initialData, onSuccess }: any) {
  const isEditing = !!initialData?.id
  const { accessToken } = useAuthInfor()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
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
  const [applyToAllUsers, setApplyToAllUsers] = useState(false)
  const [allUserIds, setAllUserIds] = useState<number[]>([])
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value.toUpperCase())
  }

  const validateMaximumDiscount = (value: number) => {
    if (value < 0) return 'Giá trị không được âm';
    if (value === 0) return 'Vui lòng nhập giá trị giảm giá tối đa';
    return '';
  }

  useEffect(() => {
    if (applyToAllUsers) {
      const getAllUserIds = async () => {
        try {
          const res = await getUserById_API(accessToken || "");
          const ids = res.data.data.map((user: any) => user.id);
          setAllUserIds(ids);
        } catch (error) {
          toast.error("Không thể lấy danh sách người dùng");
          setApplyToAllUsers(false);
        }
      };
      getAllUserIds();
    }
  }, [applyToAllUsers, accessToken]);

  // Validate giá trị giảm giá khi thay đổi loại giảm giá
  useEffect(() => {
    if (discountType === 'PERCENTAGE' && discountValue > 100) {
      setDiscountValue(100);
    }
  }, [discountType]);

  const handleDiscountValueChange = (value: string) => {
    const numValue = parseInt(value);
    if (isNaN(numValue)) {
      setDiscountValue(0);
      return;
    }

    if (discountType === 'PERCENTAGE') {
      if (numValue < 0) {
        setDiscountValue(0);
      } else if (numValue > 100) {
        setDiscountValue(100);
      } else {
        setDiscountValue(numValue);
      }
    } else {
      setDiscountValue(numValue >= 0 ? numValue : 0);
    }
  };

  const handleSubmit = async () => {
    if (!accessToken) {
      toast.error('Không có quyền truy cập');
      return;
    }

    // Validate maximumDiscount
    const maxDiscountError = validateMaximumDiscount(maximumDiscount);
    if (maxDiscountError) {
      setErrors(prev => ({ ...prev, maximumDiscount: maxDiscountError }));
      return;
    }

    setIsLoading(true)
    setIsSubmitting(true)
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
        "userSpecific": !applyToAllUsers && userSpecific,
        "userIds": applyToAllUsers ? allUserIds : userIds,
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
      setIsSubmitting(false)
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
    setApplyToAllUsers(false)
    setAllUserIds([])
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
      size="3xl"
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
        
        <ModalBody>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cột trái */}
            <div className="flex flex-col gap-4">
              <Input
                label="MÃ GIẢM GIÁ"
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
                classNames={{
                  label: "font-medium text-default-700"
                }}
              />
              
              <Input
                label="Tên mã giảm giá"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên mã giảm giá"
                variant="bordered"
                labelPlacement="outside"
                isRequired
                classNames={{
                  label: "font-medium text-default-700"
                }}
              />
              
              <Textarea
                label="Mô tả"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập mô tả mã giảm giá"
                variant="bordered"
                labelPlacement="outside"
                minRows={3}
                classNames={{
                  label: "font-medium text-default-700"
                }}
              />
              
              <Select
                label="Loại giảm giá"
                placeholder="Chọn loại giảm giá"
                value={discountType}
                onChange={(e) => {
                  setDiscountType(e.target.value);
                  // Reset giá trị khi chuyển loại
                  setDiscountValue(0);
                }}
                variant="bordered"
                labelPlacement="outside"
                isRequired
                classNames={{
                  label: "font-medium text-default-700"
                }}
              >
                <SelectItem key="PERCENTAGE" value="PERCENTAGE">Phần trăm (%)</SelectItem>
                <SelectItem key="FIXED_AMOUNT" value="FIXED_AMOUNT">Số tiền cố định (VNĐ)</SelectItem>
              </Select>
            </div>
            
            {/* Cột phải */}
            <div className="flex flex-col gap-4">
              <Input
                type="number"
                label={discountType === 'PERCENTAGE' ? 'Phần trăm giảm giá (%)' : 'Số tiền giảm giá (VNĐ)'}
                value={discountValue.toString()}
                onChange={(e) => handleDiscountValueChange(e.target.value)}
                min={0}
                max={discountType === 'PERCENTAGE' ? 100 : undefined}
                step={1}
                placeholder={discountType === 'PERCENTAGE' ? 'Nhập phần trăm giảm (0-100)' : 'Nhập số tiền giảm'}
                variant="bordered"
                labelPlacement="outside"
                isRequired
                description={discountType === 'PERCENTAGE' ? 'Giá trị từ 0-100%' : undefined}
                classNames={{
                  label: "font-medium text-default-700"
                }}
              />

              <Input
                type="number"
                label="Giảm giá tối đa (VNĐ)"
                value={maximumDiscount.toString()}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setMaximumDiscount(value >= 0 ? value : 0);
                  if (errors.maximumDiscount) {
                    setErrors(prev => ({ ...prev, maximumDiscount: '' }));
                  }
                }}
                placeholder="Nhập số tiền giảm giá tối đa"
                variant="bordered"
                labelPlacement="outside"
                isRequired
                isInvalid={!!errors.maximumDiscount}
                errorMessage={errors.maximumDiscount}
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">VNĐ</span>
                  </div>
                }
                isDisabled={isSubmitting}
                classNames={{
                  label: "font-medium text-default-700"
                }}
              />

              <Input
                type="number"
                label="Số tiền để áp dụng mã giảm giá"
                value={minimumAmount.toString()}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setMinimumAmount(value >= 0 ? value : 0);
                }}
                placeholder="Nhập số tiền tối thiểu"
                variant="bordered"
                labelPlacement="outside"
                endContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">VNĐ</span>
                  </div>
                }
                classNames={{
                  label: "font-medium text-default-700"
                }}
              />

              <Input
                type="number"
                label="Số lần sử dụng tối đa"
                value={maxUsageCount.toString()}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setMaxUsageCount(value >= 1 ? value : 1);
                }}
                placeholder="Nhập số lần sử dụng tối đa"
                variant="bordered"
                labelPlacement="outside"
                isRequired
                min={1}
                classNames={{
                  label: "font-medium text-default-700"
                }}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  label="Ngày bắt đầu"
                  value={validFrom}
                  onChange={(e) => setValidFrom(e.target.value)}
                  variant="bordered"
                  labelPlacement="outside"
                  isRequired
                  classNames={{
                    label: "font-medium text-default-700"
                  }}
                />

                <Input
                  type="date"
                  label="Ngày kết thúc"
                  value={validTo}
                  onChange={(e) => setValidTo(e.target.value)}
                  variant="bordered"
                  labelPlacement="outside"
                  isRequired
                  classNames={{
                    label: "font-medium text-default-700"
                  }}
                />
              </div>

              <RadioGroup
                label="Đối tượng áp dụng"
                orientation="vertical"
                value={applyToAllUsers ? "all" : userSpecific ? "specific" : "none"}
                onChange={(e) => {
                  const value = e.target.value as string;
                  if (value === "all") {
                    setApplyToAllUsers(true);
                    setUserSpecific(false);
                  } else if (value === "specific") {
                    setApplyToAllUsers(false);
                    setUserSpecific(true);
                  } else {
                    setApplyToAllUsers(false);
                    setUserSpecific(false);
                  }
                }}
              >
                <Radio value="all">Áp dụng cho tất cả người dùng</Radio>
                <Radio value="specific">Áp dụng cho người dùng cụ thể</Radio>
              </RadioGroup>

              {userSpecific && !applyToAllUsers && (
                <InputUse setUse={setUserIds} use={userIds} />
              )}
            </div>
          </div>
        </ModalBody>
        
        <ModalFooter>
          <Button 
            color="danger" 
            variant="light" 
            onPress={onClose}
            isDisabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button 
            color="primary" 
            onPress={handleSubmit}
            isLoading={isSubmitting}
          >
            Tạo mã giảm giá
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}