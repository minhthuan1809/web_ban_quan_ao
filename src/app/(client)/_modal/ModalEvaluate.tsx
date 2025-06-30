"use client"
import React, { useState } from 'react'
import { Modal, ModalContent, ModalBody, ModalFooter, Button, Textarea, Card, CardBody, Divider } from "@nextui-org/react"
import { Star, MessageSquare, Camera } from 'lucide-react'
import InputTakeImg from '@/app/_util/ui/InputTakeImg';
import { createEvaluate_API } from '@/app/_service/Evaluate';
import { toast } from 'react-toastify';
import useAuthInfor from '@/app/customHooks/AuthInfor';
import { uploadToCloudinary } from '@/app/_util/upload_img_cloudinary';
import Image from 'next/image';


interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  totalPrice: number;
  unitPrice: number;
  variantId: number;
  variantInfo: {
    sizeName: string;
    colorName: string;
    productCode: string;
  };
}

interface ModalEvaluateProps {
  isOpen: boolean;
  onClose: () => void;
  dataOrder: {
    id: number;
    orderItems: OrderItem[];
  };
}

interface ProductEvaluation {
  rating: number;
  comment: string;
  images: (string | File)[];
  hoveredStar: number;
}

const ratingLabels = {
  1: "Rất không hài lòng",
  2: "Không hài lòng", 
  3: "Bình thường",
  4: "Hài lòng",
  5: "Rất hài lòng"
};

export default function ModalEvaluate({ isOpen, onClose, dataOrder}: ModalEvaluateProps) {
  const { user : userInfo, accessToken } = useAuthInfor();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluations, setEvaluations] = useState<ProductEvaluation[]>(
    dataOrder.orderItems.map(() => ({
      rating: 5,
      comment: "",
      images: [],
      hoveredStar: 0
    }))
  );

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      for (let i = 0; i < dataOrder.orderItems.length; i++) {
        const item = dataOrder.orderItems[i];
        const evaluation = evaluations[i];
        const uploadedImages = await uploadToCloudinary(evaluation.images, process.env.NEXT_PUBLIC_FOLDER || "");
        
        const data = {
          "userId": userInfo?.id || 0,
          "orderId": dataOrder.id || 0,
          "rating": evaluation.rating,
          "productId": item.productId || 0,
          "comment": evaluation.comment,
          "images": uploadedImages,
          "isAdmin": true
        }
        
        const res = await createEvaluate_API(data, accessToken || "");
        if(res.status !== 200) {
          toast.error(`Gửi đánh giá thất bại cho sản phẩm ${item.productName}`);
          return;
        }
      }
      toast.success("Gửi tất cả đánh giá thành công");
      onClose();
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      toast.error("Có lỗi xảy ra khi gửi đánh giá");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarClick = (index: number, star: number) => {
    const newEvaluations = [...evaluations];
    newEvaluations[index].rating = star;
    setEvaluations(newEvaluations);
  };

  const handleStarHover = (index: number, star: number) => {
    const newEvaluations = [...evaluations];
    newEvaluations[index].hoveredStar = star;
    setEvaluations(newEvaluations);
  };

  const handleStarLeave = (index: number) => {
    const newEvaluations = [...evaluations];
    newEvaluations[index].hoveredStar = 0;
    setEvaluations(newEvaluations);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody className="p-4">
              <div className="space-y-8">
                {dataOrder.orderItems.map((item, index) => (
                  <div key={item.productId} className="space-y-4">
                    <Card>
                      <CardBody className="flex gap-4">
                        <div className="w-24 h-24 relative">
                          <Image 
                            src={`/products/${item.variantInfo.productCode}.jpg`}
                            alt={item.productName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3>{item.productName}</h3>
                          <p>
                            {item.variantInfo.sizeName} - {item.variantInfo.colorName}
                          </p>
                          <p>
                            Số lượng: {item.quantity}
                          </p>
                          <p>
                            {item.unitPrice.toLocaleString('vi-VN')}đ
                          </p>
                        </div>
                      </CardBody>
                    </Card>

                    <Card>
                      <CardBody>
                        <div className="flex justify-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => handleStarClick(index, star)}
                              onMouseEnter={() => handleStarHover(index, star)}
                              onMouseLeave={() => handleStarLeave(index)}
                            >
                              <Star
                                size={24}
                                className={star <= (evaluations[index].hoveredStar || evaluations[index].rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                              />
                            </button>
                          ))}
                        </div>
                        <p className="text-center mt-2">
                          {ratingLabels[(evaluations[index].hoveredStar || evaluations[index].rating) as keyof typeof ratingLabels]}
                        </p>
                      </CardBody>
                    </Card>

                    <div>
                      <h3 className="mb-2">Thêm hình ảnh</h3>
                      <InputTakeImg
                        images={evaluations[index].images}
                        setImages={(newImages) => {
                          const newEvaluations = [...evaluations];
                          newEvaluations[index].images = newImages;
                          setEvaluations(newEvaluations);
                        }}
                        onChange={(newImages) => {
                          const newEvaluations = [...evaluations];
                          newEvaluations[index].images = newImages;
                          setEvaluations(newEvaluations);
                        }}
                        numberImg={5}
                      />
                    </div>

                    <div>
                      <h3 className="mb-2">Nhận xét</h3>
                      <Textarea
                        placeholder="Nhập nhận xét của bạn"
                        value={evaluations[index].comment}
                        onChange={(e) => {
                          const newEvaluations = [...evaluations];
                          newEvaluations[index].comment = e.target.value;
                          setEvaluations(newEvaluations);
                        }}
                        minRows={4}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        {evaluations[index].comment.length}/500 ký tự
                      </p>
                    </div>

                    {index < dataOrder.orderItems.length - 1 && <Divider className="my-4"/>}
                  </div>
                ))}
              </div>
            </ModalBody>
            
            <ModalFooter>
              <Button 
                color="default"
                onPress={onClose}
              >
                Hủy
              </Button>
              <Button
                color="primary"
                onPress={handleSubmit}
                isLoading={isSubmitting}
                isDisabled={evaluations.some((evaluation) => evaluation.comment.length < 10)}
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