"use client"
import { getReviews_API } from '@/app/_service/Evaluate';
import TitleSearchAdd from '@/app/components/ui/TitleSearchAdd';
import React, { useEffect, useState } from 'react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Tooltip, Button, Pagination, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input } from "@nextui-org/react";
import { Star, MessageCircle, Send } from 'lucide-react';
import Image from 'next/image';
import { formatDate } from 'date-fns';
import Loading from '@/app/_util/Loading';

export default function EvaluatePage() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [searchValue, setSearchValue] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
    const [isReplyModalOpen, setIsReplyModalOpen] = useState<boolean>(false);
    const [selectedReview, setSelectedReview] = useState<any>(null);
    const [replyText, setReplyText] = useState<string>('');

    useEffect(() => {
        const fetchEvaluate = async () => {
            setLoading(true);
            try {
                const response = await getReviews_API(currentPage, 15, searchValue);
                setReviews(response.data);
                setTotalPage(response.metadata.total_page);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setLoading(false);
            }
        }

        const timer = setTimeout(() => {    
            fetchEvaluate();
        }, 500);

        return () => clearTimeout(timer);
    }, [currentPage, searchValue]);

    const handleReply = async (review: any) => {
        setSelectedReview(review);
        setIsReplyModalOpen(true);
    };

    const handleSubmitReply = async () => {
        // Implement API call to submit reply
        console.log("Replying to review:", selectedReview?.id, replyText);
        setIsReplyModalOpen(false);
        setReplyText('');
    };

    const columns = [
        { name: "NGƯỜI DÙNG", uid: "user" },
        { name: "ĐÁNH GIÁ", uid: "rating" },
        { name: "BÌNH LUẬN", uid: "comment" },
        { name: "HÌNH ẢNH", uid: "images" },
        { name: "NGÀY TẠO", uid: "createdAt" },
        { name: "HÀNH ĐỘNG", uid: "actions" },
    ];

    const renderCell = (review: any, columnKey: React.Key) => {
        switch (columnKey) {
            case "user":
                return (
                    <User
                        name={review.user.fullName}
                        description={review.user.email}
                        avatarProps={{
                            src: review.user.avatarUrl ? review.user.avatarUrl : undefined,
                            name: review.user.fullName?.charAt(0)
                        }}
                    />
                );
            case "rating":
                return (
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span>{review.rating}</span>
                    </div>
                );
            case "comment":
                return (
                    <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        <span>{review.comment}</span>
                    </div>
                );
            case "images":
                return review.images ? (
                    <div className="flex gap-2">
                        {review.images.map((image: string, index: number) => (
                            <div 
                                key={index}
                                onClick={() => {
                                    setSelectedImage(image);
                                    setIsImageModalOpen(true);
                                }}
                                className="cursor-pointer"
                            >
                                <Image
                                    src={image}
                                    alt={`Review image ${index + 1}`}
                                    width={50}
                                    height={50}
                                    className="rounded-md object-cover hover:opacity-80 transition-opacity"
                                />
                            </div>
                        ))}
                    </div>
                ) : "Không có hình ảnh";
            case "createdAt":
                return formatDate(review.createdAt, 'dd/MM/yyyy');
            case "actions":
                return (
                    <Button
                        color="primary"
                        variant="flat"
                        size="sm"
                        onClick={() => handleReply(review)}
                    >
                        Trả lời
                    </Button>
                );
            default:
                return null;
        }
    };

    return (
        <div className='p-4'>
            <TitleSearchAdd
                title={{
                    title: "Đánh Giá",
                    search: "Tìm kiếm đánh giá...",
                }}
                onSearch={(value) => setSearchValue(value)}
            />

            {loading ? (
                <div className="flex justify-center items-center min-h-[400px]">
                    <Loading />
                </div>
            ) : reviews.length === 0 ? (
                <div className="flex justify-center items-center min-h-[400px]">
                    <p className="text-gray-500">Không có dữ liệu đánh giá</p>
                </div>
            ) : (
              <>
                <Table aria-label="Bảng đánh giá">
                    <TableHeader columns={columns}>
                        {(column) => (
                            <TableColumn key={column.uid}>
                                {column.name}
                            </TableColumn>
                        )}
                    </TableHeader>
                    <TableBody items={reviews}>
                        {(item) => (
                            <TableRow key={item.id}>
                                {(columnKey) => (
                                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                                )}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
          {totalPage > 1 && (
            <div className='flex justify-center mt-4'>
                <Pagination
                    total={totalPage}
                    page={currentPage}
                    onChange={(page) => setCurrentPage(page as number)}
                /> 
            </div>
          )}

                {/* Image Modal */}
                <Modal 
                    isOpen={isImageModalOpen} 
                    onClose={() => setIsImageModalOpen(false)}
                    size="2xl"
                >
                    <ModalContent>
                        <ModalBody>
                            <div className="flex justify-center">
                                <Image
                                    src={selectedImage}
                                    alt="Review image"
                                    width={800}
                                    height={600}
                                    className="object-contain"
                                />
                            </div>
                        </ModalBody>
                    </ModalContent>
                </Modal>

                {/* Reply Modal */}
                <Modal 
                    isOpen={isReplyModalOpen} 
                    onClose={() => setIsReplyModalOpen(false)}
                >
                    <ModalContent>
                        <ModalHeader>
                            <h3>Trả lời đánh giá</h3>
                        </ModalHeader>
                        <ModalBody>
                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="font-semibold text-black">{selectedReview?.user?.fullName}</p>
                                    <p className='text-sm text-black'>{selectedReview?.comment}</p>
                                </div>
                                <Input
                                    placeholder="Nhập nội dung trả lời..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                />
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={() => setIsReplyModalOpen(false)}>
                                Hủy
                            </Button>
                            <Button color="primary" onPress={handleSubmitReply}>
                                Gửi trả lời
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
              </>  
            )}
        </div>
    )
}
