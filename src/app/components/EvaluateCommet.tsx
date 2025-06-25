"use client"
import React, { useEffect, useState } from 'react';
import { Star, ThumbsUp } from 'lucide-react';
import { getReviews_API } from '../_service/Evaluate';
import { useParams } from 'next/navigation';
import { Pagination } from '@nextui-org/react';

interface User {
  id: number;
  fullName: string;
  email: string;
  avatarUrl: string | null;
}

interface Answer {
  id: number;
  answer: string;
  images: string[];
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
}

interface Review {
  id: number;
  user: User;
  rating: number;
  comment: string;
  images: string[] | null;
  createdAt: number;
  answers: Answer[];
  isDeleted: boolean;
}

interface ReviewResponse {
  data: Review[];
  metadata: {
    page: number;
    page_size: number;
    total: number;
    total_page: number;
    ranger: {
      from: number;
      to: number;
    };
  };
}

export default function SimpleEvaluateComment() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCounts, setRatingCounts] = useState<{ [key: number]: number }>({});
  const [imageCount, setImageCount] = useState(0);
  const [metadata, setMetadata] = useState<ReviewResponse['metadata'] | null>(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const _params = params.slug;
  const productId = _params && Array.isArray(_params) ? _params[1] : null;
  const [page, setPage] = useState(1);
  const totalPage = metadata?.total_page || 1;

  // Tránh setState trong render
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    if (!productId) return;
    
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await getReviews_API(page, 10, '', productId);
        const reviewsData = response.data;
        const metadata = response.metadata;
        
        setReviews(reviewsData);
        setMetadata(metadata);
        
        // Calculate average rating
        const totalRating = reviewsData.reduce((sum: number, review: Review) => sum + review.rating, 0);
        const avg = reviewsData.length > 0 ? totalRating / reviewsData.length : 0;
        setAverageRating(Number(avg.toFixed(1)));

        // Calculate rating counts
        const counts: { [key: number]: number } = {};
        reviewsData.forEach((review: Review) => {
          counts[review.rating] = (counts[review.rating] || 0) + 1;
        });
        setRatingCounts(counts);

        // Calculate image count
        const imgCount = reviewsData.filter((review: Review) => review.images && review.images.length > 0).length;
        setImageCount(imgCount);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [productId, page]);

  if (!productId) {
    return <div>Không tìm thấy thông tin sản phẩm</div>;
  }

  if (loading) {
    return <div className="bg-white p-4 text-center">Đang tải đánh giá...</div>;
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={14}
        className={`text-yellow-500 ${index < rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`}
      />
    ));
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white p-4 ">
      <h2 className="text-lg font-medium mb-4 text-gray-900">
        ĐÁNH GIÁ SẢN PHẨM {metadata && `(${metadata.total})`}
      </h2>
      
      <div className="flex items-center gap-6 mb-6 pb-4 border-b">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 mb-1">{averageRating}</div>
          <div className="text-sm text-gray-600">trên 5</div>
          <div className="flex justify-center gap-1 mt-1">
            {renderStars(Math.round(averageRating))}
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          <div>
            {[5, 4, 3, 2, 1].map(rating => 
              ratingCounts[rating] ? (
                <span key={rating}>
                  {rating} Sao ({ratingCounts[rating]}){rating > 1 ? ' • ' : ''}
                </span>
              ) : null
            )}
          </div>
          <div className="mt-1">Có Hình Ảnh/Video ({imageCount})</div>
        </div>
      </div>

      <div className="space-y-5">
        {reviews.map((review) => (
          <div key={review.id} className="pb-5 border-b border-gray-100 last:border-b-0">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 text-sm overflow-hidden">
                {review.user?.avatarUrl ? (
                  <img 
                    src={review.user.avatarUrl}
                    alt={review.user?.fullName || 'User'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Hiển thị chữ cái đầu nếu ảnh không load được
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = (review.user?.fullName?.charAt(0)?.toUpperCase() || '?');
                      }
                    }}
                  />
                ) : (
                  (review.user?.fullName?.charAt(0)?.toUpperCase() || '?')
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-900">{review.user?.fullName || 'Người dùng'}</span>
                  <div className="flex gap-1">
                    {renderStars(review.rating)}
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 mb-3">
                  {formatDate(review.createdAt)}
                </div>
                
                <p className="text-gray-800 text-sm mb-3 leading-relaxed">
                  {review.comment}
                </p>
                
                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {review.images.map((image, index) => (
                      <div key={index} className="w-16 h-16 bg-gray-100 rounded">
                        <img 
                          src={image} 
                          alt={`Ảnh ${index + 1}`}
                          className="w-full h-full object-cover rounded"
                          onError={(e) => {
                            // Ẩn ảnh nếu không load được
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {review.answers && review.answers.length > 0 && (
                  <div className="mt-4 pl-4 border-l-2 border-gray-200">
                    {review.answers.map((answer) => (
                      <div key={answer.id} className="mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-blue-600">KICKSTYLE</span>
                          <span className="text-xs text-gray-500">{formatDate(answer.createdAt)}</span>
                        </div>
                        <p className="text-sm text-gray-700">{answer.answer}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='flex justify-center'>
        {totalPage > 1 && (
          <Pagination
            total={totalPage}
            page={page}
            onChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}