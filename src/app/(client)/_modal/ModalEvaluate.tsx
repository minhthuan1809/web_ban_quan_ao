"use client"
import React, { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Textarea, Card, CardBody, Divider } from "@nextui-org/react"
import { Star, MessageSquare, Camera } from 'lucide-react'
import InputTakeImg from '@/app/_util/ui/InputTakeImg';
import { createEvaluate_API } from '@/app/_service/Evaluate';
import { toast } from 'react-toastify';
import useAuthInfor from '@/app/customHooks/AuthInfor';
import { uploadToCloudinary } from '@/app/_util/upload_img_cloudinary';
    
interface ModalEvaluateProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
}
const { userInfo } = useAuthInfor();
const ratingLabels = {
  1: "Rất không hài lòng",
  2: "Không hài lòng", 
  3: "Bình thường",
  4: "Hài lòng",
  5: "Rất hài lòng"
};

export default function ModalEvaluate({ isOpen, onClose, orderId }: ModalEvaluateProps) {
    const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [images, setImages] = useState<(string | File)[]>([]);
  const [hoveredStar, setHoveredStar] = useState<number>(0);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
        const uploadedImages = await uploadToCloudinary(images, "kick-style");
        const data = {
            "userId": userInfo?.id,
            "orderId": orderId,
            "rating": rating,
            "comment": comment,
                "images": uploadedImages
          }
      const res = await createEvaluate_API(data);
      if(res.status === 200){
        toast.success("Gửi đánh giá thành công");
        onClose();
      }else{
        toast.error("Gửi đánh giá thất bại");
      }
      setRating(5);
      setComment("");
      setImages([]);
      onClose();
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarClick = (star: number) => {
    setRating(star);
  };

  const handleStarHover = (star: number) => {
    setHoveredStar(star);
  };

  const handleStarLeave = () => {
    setHoveredStar(0);
  };

  const displayRating = hoveredStar || rating;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="2xl"
      classNames={{
        backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        header: "hidden",
        base: "max-w-[600px] w-full"
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
      
            <ModalBody className="px-6 py-4 max-h-[70vh] overflow-y-auto">
              <div className="flex flex-col gap-6">
                {/* Rating Section */}
                <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 border-none shadow-sm">
                  <CardBody className="flex flex-col items-center gap-3 py-6">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleStarClick(star)}
                          onMouseEnter={() => handleStarHover(star)}
                          onMouseLeave={handleStarLeave}
                          className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                        >
                          <Star
                            size={36}
                            className={`${
                              star <= displayRating
                                ? "fill-yellow-400 text-yellow-400 drop-shadow-sm"
                                : "fill-none text-gray-300 hover:text-yellow-200"
                            } transition-all duration-200`}
                          />
                        </button>
                      ))}
                    </div>
                    
                    <div className="text-center">
                      <p className="text-lg font-medium text-default-700">
                        {ratingLabels[displayRating as keyof typeof ratingLabels]}
                      </p>
                      <p className="text-sm text-default-500">
                        {displayRating} trên 5 sao
                      </p>
                    </div>
                  </CardBody>
                </Card>

                <Divider />

                {/* Image Upload Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Camera className="text-default-500" size={20} />
                    <h3 className="text-medium font-medium text-default-700">
                      Thêm hình ảnh
                    </h3>
                    <span className="text-xs text-default-400 bg-default-100 px-2 py-1 rounded-full">
                      Tùy chọn
                    </span>
                  </div>
                  
                  <Card className="border-2 border-dashed border-default-200 bg-default-50">
                    <CardBody className="py-4">
                      <InputTakeImg
                        images={images}
                        setImages={setImages}
                        onChange={setImages}
                        numberImg={5}
                      />
                      <p className="text-xs text-default-400 mt-2 text-center">
                        Tối đa 5 hình ảnh, mỗi ảnh không quá 5MB
                      </p>
                    </CardBody>
                  </Card>
                </div>

                <Divider />

                {/* Comment Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="text-default-500" size={20} />
                    <h3 className="text-medium font-medium text-default-700">
                      Nhận xét chi tiết
                    </h3>
                  </div>
                  
                  <Textarea
                    placeholder="Hãy chia sẻ chi tiết về chất lượng sản phẩm, dịch vụ giao hàng, đóng gói... để giúp người mua khác có quyết định tốt hơn"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    minRows={4}
                    maxRows={8}
                    className="w-full"
                    classNames={{
                      input: "resize-none",
                      inputWrapper: "bg-default-50 border-default-200 hover:border-default-300 focus-within:border-primary"
                    }}
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-default-400">
                      Tối thiểu 10 ký tự để đánh giá có ý nghĩa
                    </span>
                    <span className="text-xs text-default-400">
                      {comment.length}/500
                    </span>
                  </div>
                </div>
              </div>
            </ModalBody>
            
            <ModalFooter className="px-6 py-4">
              <Button 
                color="default" 
                variant="light" 
                onPress={onClose}
                className="font-medium"
              >
                Hủy bỏ
              </Button>
              <Button
                color="primary"
                onPress={handleSubmit}
                isLoading={isSubmitting}
                className="font-medium px-8 bg-gradient-to-r from-primary to-primary-600"
                isDisabled={comment.length < 10}
              >
                {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}