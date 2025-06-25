import { AuthUser } from './auth';
import { Product } from './product';

// Review/Evaluate Types
export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'hidden';
export type ReviewRating = 1 | 2 | 3 | 4 | 5;

// Main Review Interface
export interface Review {
  id: number;
  userId: number;
  productId: string;
  orderId?: string;
  rating: ReviewRating;
  title?: string;
  comment: string;
  status: ReviewStatus;
  
  // Media attachments
  imageUrls?: string[];
  videoUrls?: string[];
  
  // Admin actions
  adminResponse?: string;
  adminResponseAt?: number;
  adminId?: number;
  
  // Helpfulness tracking
  helpfulCount: number;
  notHelpfulCount: number;
  
  // Verification
  isVerifiedPurchase: boolean;
  
  // Timestamps
  createdAt: number;
  updatedAt: number;
  approvedAt?: number;
  
  // Relations
  user?: AuthUser;
  product?: Product;
  admin?: AuthUser;
  
  // User interaction (for current user)
  userHelpfulVote?: 'helpful' | 'not_helpful' | null;
}

// Review Statistics
export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  verifiedPurchaseRate: number;
  responseRate: number;
  totalHelpfulVotes: number;
}

// Product Review Summary
export interface ProductReviewSummary {
  productId: string;
  totalReviews: number;
  averageRating: number;
  ratingDistribution: ReviewStats['ratingDistribution'];
  recentReviews: Review[];
  topReviews: Review[]; // most helpful reviews
}

// Review Filter and Search
export interface ReviewFilter {
  rating?: ReviewRating[];
  status?: ReviewStatus[];
  isVerifiedPurchase?: boolean;
  hasImages?: boolean;
  hasAdminResponse?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
  productId?: string;
  userId?: number;
}

export interface ReviewSearchParams {
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: 'newest' | 'oldest' | 'rating_high' | 'rating_low' | 'most_helpful';
  filter?: ReviewFilter;
}

export interface ReviewResponse {
  data: Review[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  stats?: ReviewStats;
}

// Create/Update Review Types
export interface CreateReviewData {
  productId: string;
  orderId?: string;
  rating: ReviewRating;
  title?: string;
  comment: string;
  imageUrls?: string[];
  videoUrls?: string[];
}

export interface UpdateReviewData {
  rating?: ReviewRating;
  title?: string;
  comment?: string;
  imageUrls?: string[];
  videoUrls?: string[];
}

// Admin Review Management
export interface AdminReviewAction {
  reviewId: number;
  action: 'approve' | 'reject' | 'hide' | 'respond';
  adminResponse?: string;
  reason?: string;
}

export interface BulkReviewAction {
  action: 'approve' | 'reject' | 'hide' | 'delete';
  reviewIds: number[];
  reason?: string;
}

// Review Helpfulness
export interface ReviewHelpfulnessVote {
  reviewId: number;
  userId: number;
  vote: 'helpful' | 'not_helpful';
  createdAt: number;
}

// Review Analytics
export interface ReviewAnalytics {
  // Time-based stats
  reviewsOverTime: {
    date: string;
    count: number;
    averageRating: number;
  }[];
  
  // Product performance
  topRatedProducts: {
    productId: string;
    productName: string;
    averageRating: number;
    reviewCount: number;
  }[];
  
  // User engagement
  mostActiveReviewers: {
    userId: number;
    userName: string;
    reviewCount: number;
    averageRating: number;
  }[];
  
  // Response metrics
  responseMetrics: {
    totalResponses: number;
    averageResponseTime: number; // in hours
    responseRate: number; // percentage
  };
}

// Review Form Types
export interface ReviewFormData {
  rating: ReviewRating;
  title: string;
  comment: string;
  images: File[];
  videos: File[];
}

export interface ReviewFormErrors {
  rating?: string;
  title?: string;
  comment?: string;
  images?: string;
  videos?: string;
}

// Review Moderation
export interface ReviewModerationRule {
  id: number;
  name: string;
  description: string;
  conditions: {
    minRating?: ReviewRating;
    maxRating?: ReviewRating;
    keywords?: string[];
    hasImages?: boolean;
    isVerifiedPurchase?: boolean;
  };
  action: 'auto_approve' | 'auto_reject' | 'require_review';
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

// Review Notification Types
export interface ReviewNotification {
  id: number;
  type: 'new_review' | 'review_approved' | 'review_rejected' | 'admin_response';
  reviewId: number;
  userId: number;
  isRead: boolean;
  createdAt: number;
  data?: {
    productName?: string;
    reviewRating?: ReviewRating;
    adminMessage?: string;
  };
} 