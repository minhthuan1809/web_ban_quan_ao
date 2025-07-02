'use client'
import { Modal, ModalContent, ModalBody } from "@nextui-org/react"

interface ImageViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

export default function ImageViewModal({ isOpen, onClose, imageUrl }: ImageViewModalProps) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="5xl"
      className="z-[100]"
    >
      <ModalContent>
        <ModalBody className="p-0">
          <div className="relative aspect-square">
            <img 
              src={imageUrl} 
              alt="Product overview" 
              className="w-full h-full object-contain"
            />
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
} 