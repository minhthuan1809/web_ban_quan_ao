import React, { useEffect, useState } from 'react';
import { Star, ThumbsUp, Play } from 'lucide-react';
import { getReviews_API } from '../_service/Evaluate';
import { useParams } from 'next/navigation';

export default function SimpleEvaluateComment() {

  const params = useParams();
  const productId = params.slug;

  useEffect(() => {
    const fetchReviews = async () => {
      const reviews = await getReviews_API(Number(productId[1]));
      console.log("reviews", reviews);
    }
    fetchReviews();
  }, []);
  const reviews = [
    {
      id: 1,
      username: "l****8",
      date: "2021-07-11 15:32",
      rating: 5,
      comment: "Đặt mua cho ba mình 1m7 hơn 80kg, có bụng thì áo ôm khít luôn nha mọi người, tuy nhiên áo cho người trẻ nên form ôm cũng đúng thui. Chất lượng tốt so với giá tiền nê 👍👍",
      likes: 2,
      hasVideo: true,
      videoDuration: "0:06",
      images: [
        "/api/placeholder/60/60",
        "/api/placeholder/60/60", 
        "/api/placeholder/60/60"
      ]
    },
    {
      id: 2,
      username: "thanhzino",
      date: "2021-07-26 20:52",
      rating: 5,
      comment: "Hàng đẹp! Giao nhanh! Vải áo mỏng mát, vải quần có độ co giãn nhe! Với giá ntn mà dc bộ đồ Chất vậy mình tây quá Ok r a",
      likes: 4,
      hasVideo: true,
      videoDuration: "0:12",
      images: [
        "/api/placeholder/60/60",
        "/api/placeholder/60/60"
      ]
    }
  ];

  const renderStars = (rating: number ) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={14}
        className={`${index < rating ? 'fill-gray-800 text-gray-800' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="bg-white p-4 mx-auto">
      {/* Header */}
      <h2 className="text-lg font-medium mb-4 text-gray-900">ĐÁNH GIÁ SẢN PHẨM</h2>
      
      {/* Rating Summary - Simplified */}
      <div className="flex items-center gap-6 mb-6 pb-4 border-b">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 mb-1">4.8</div>
          <div className="text-sm text-gray-600">trên 5</div>
          <div className="flex justify-center gap-1 mt-1">
            {renderStars(5)}
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          <div>5 Sao (3,3k) • 4 Sao (273) • 3 Sao (108)</div>
          <div className="mt-1">Có Hình Ảnh/Video (472)</div>
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-5">
        {reviews.map((review) => (
          <div key={review.id} className="pb-5 border-b border-gray-100 last:border-b-0">
            <div className="flex gap-3">
              {/* User Avatar - Simplified */}
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 text-sm">
                {review.username.charAt(0).toUpperCase()}
              </div>
              
              <div className="flex-1">
                {/* User Info */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-900">{review.username}</span>
                  <div className="flex gap-1">
                    {renderStars(review.rating)}
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 mb-3">
                  {review.date}
                </div>
                
                {/* Comment */}
                <p className="text-gray-800 text-sm mb-3 leading-relaxed">
                  {review.comment}
                </p>
                
                {/* Media - Simplified */}
                <div className="flex gap-2 mb-3">
                  {review.hasVideo && (
                    <div className="relative">
                      <div className="w-16 h-16 bg-gray-100 rounded">
                        <img 
                          src={review.images[0]} 
                          alt="Video"
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black bg-opacity-50 rounded-full p-1">
                          <Play size={12} className="text-white fill-white" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 right-0 bg-black bg-opacity-70 text-white text-xs px-1 rounded-tl ">
                        {review.videoDuration}
                      </div>
                    </div>
                  )}
                  
                  {review.images.slice(1).map((image, index) => (
                    <div key={index} className="w-16 h-16 bg-gray-100 rounded">
                      <img 
                        src={image} 
                        alt={`Ảnh ${index + 1}`}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
                
                {/* Like Button - Simplified */}
                <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm">
                  <ThumbsUp size={14} />
                  <span>{review.likes}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}