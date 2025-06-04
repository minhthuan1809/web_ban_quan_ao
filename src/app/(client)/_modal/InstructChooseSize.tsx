import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import React from 'react'
import Image from 'next/image'

export default function InstructChooseSize({isOpen, onClose}: {isOpen: boolean, onClose: () => void}) {
  return (
    <div>
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalContent>
                <ModalHeader>
                    <h1 className='text-2xl font-bold'>Hướng dẫn chọn size</h1>
                </ModalHeader>
                <ModalBody>
                    <div className='flex flex-col items-center gap-4'>
                        <p className='text-gray-600'>Bảng size tham khảo cho áo bóng đá:</p>
                        <div className='relative w-full h-[400px]'>
                            <Image 
                                src="https://res.cloudinary.com/dv74xtpto/image/upload/v1748873281/dd34b83b-b4bd-4e6a-aec5-37d14df7cd24.png"
                                alt="Bảng size áo bóng đá" 
                                fill
                                className='object-contain'
                                priority
                            />
                        </div>
                        <p className='text-sm text-gray-500 italic'>* Bảng size chỉ mang tính chất tham khảo. Vui lòng liên hệ với chúng tôi để được tư vấn cụ thể.</p>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color='danger' variant='light' onPress={onClose}>
                        Đóng
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </div>
  )
}
