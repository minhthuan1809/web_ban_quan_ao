"use client";

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import React from 'react'
import Image from 'next/image'

export default function InstructChooseSize({isOpen, onClose}: {isOpen: boolean, onClose: () => void}) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="2xl"
      classNames={{
        base: "bg-card",
        header: "border-b border-border",
        body: "py-6",
        footer: "border-t border-border",
        closeButton: "hover:bg-primary/10 active:bg-primary/30 text-foreground"
      }}
    >
      <ModalContent>
        <ModalHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            </div>
            <h1 className="text-xl font-semibold text-foreground">Hướng dẫn chọn size</h1>
          </div>
        </ModalHeader>

        <ModalBody>
          <div className="flex flex-col items-center gap-4">
            <p className="text-foreground">Bảng size tham khảo cho áo bóng đá:</p>
            <div className="relative w-full h-[400px]">
              <Image 
                src="https://res.cloudinary.com/dv74xtpto/image/upload/v1748873281/dd34b83b-b4bd-4e6a-aec5-37d14df7cd24.png"
                alt="Bảng size áo bóng đá" 
                fill
                className="object-contain"
                priority
              />
            </div>
            <p className="text-sm text-muted-foreground italic">* Bảng size chỉ mang tính chất tham khảo. Vui lòng liên hệ với chúng tôi để được tư vấn cụ thể.</p>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button 
            color="danger" 
            variant="light" 
            onPress={onClose}
            className="font-medium"
          >
            Đóng
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
