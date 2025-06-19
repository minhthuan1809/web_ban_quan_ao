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

interface Review {
  id: number;
  user: User;
  rating: number;
  comment: string;
  images: string[] | null;
  createdAt: number;
  answers: any[];
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

  const params = useParams();
  const productId = params.slug;
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalPage = metadata?.total_page || 1;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getReviews_API(page, 10, '');
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
      }
    };
    fetchReviews();
  }, [productId, page]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={14}
        className={`${index < rating ? 'fill-gray-800 text-gray-800' : 'text-gray-300'}`}
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
            {[5, 4, 3, 2, 1].map(rating => (
              ratingCounts[rating] ? `${rating} Sao (${ratingCounts[rating]})${rating > 1 ? ' • ' : ''}` : ''
            ))}
          </div>
          <div className="mt-1">Có Hình Ảnh/Video ({imageCount})</div>
        </div>
      </div>

      <div className="space-y-5">
        {reviews.map((review) => (
          <div key={review.id} className="pb-5 border-b border-gray-100 last:border-b-0">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 text-sm overflow-hidden">
                {review.user.avatarUrl ? (
                  <img 
                    src={review.user.avatarUrl}
                    alt={review.user.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  review.user.fullName.charAt(0).toUpperCase()
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-900">{review.user.fullName}</span>
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
                        />
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
        onChange={(page) => {
          setPage(page as number);
          setPageSize(10);
        }}
      />
    )}
   </div>
    </div>
  );
}