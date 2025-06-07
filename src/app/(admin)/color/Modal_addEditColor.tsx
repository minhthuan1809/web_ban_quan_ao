import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react'
import React, { useEffect, useRef } from 'react'

export default function Modal_addEditColor({
  isOpen,
  setIsOpen,
  setEditColor,
  setName,
  name,
  code,
  setCode,
  handleAddSize,
  loadingBtn,
  editColor
}: {
  isOpen: boolean,
  setIsOpen: (value: boolean) => void,
  setEditColor: (value: any) => void,
  setName: (value: string) => void,
  name: string,
  code: string,
  setCode: (value: string) => void,
  handleAddSize: () => void,
  loadingBtn: boolean,
  editColor: boolean
}) {
  const colorInputRef = useRef<HTMLInputElement>(null)

  const handleClose = () => {
    setIsOpen(false)
    setEditColor(null)
    setName("")
  }


  return (
    <Modal 
      isOpen={isOpen}
      onClose={handleClose}
      placement="center"
      backdrop="blur"
      size="md"
      className="mt-[20vh]"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold">
            {editColor ? "Sửa màu sắc" : "Thêm màu sắc"}
          </h1>
        </ModalHeader>
                
        <ModalBody>
          <div className="flex flex-col gap-4">
            <Input
              label="Tên màu sắc"
              placeholder="Nhập tên màu sắc"
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="bordered"
              labelPlacement="outside"
              classNames={{
                label: "font-medium"
              }}
            />

            <div className="flex flex-col gap-2">
              <label className="font-medium">Mã màu sắc</label>
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-full border cursor-pointer"
                  style={{ backgroundColor: code }}
                  onClick={() => colorInputRef.current?.click()}
                ></div>
                <span style={{ color: code }} className="text-lg font-medium">
                  {code}
                </span>
                <input
                  ref={colorInputRef}
                  type="color"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-0 h-0 opacity-0 absolute"
                />
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            color="danger"
            variant="light"
            onPress={handleClose}
          >
            Hủy
          </Button>
          <Button
            color="primary"
            onPress={handleAddSize}
            isLoading={loadingBtn}
          >
            {editColor ? "Sửa màu sắc" : "Thêm màu sắc"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}