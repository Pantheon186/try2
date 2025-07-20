import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, MessageSquare, Flag, CheckCircle, Send, User } from 'lucide-react';
import { MockDataService } from '../services/MockDataService';
import { Review } from '../data/mockData';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';

interface ReviewSystemProps {
  itemType: 'Cruise' | 'Hotel';
  itemId: string;
  itemName: string;
  canAddReview?: boolean;
  className?: string;
}

const ReviewSystem: React.FC<ReviewSystemProps> = ({
  itemType,
  itemId,
  itemName,
  canAddReview = false,
  className = ''
}) => {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotifications();
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: '',
    comment: ''
  });

  useEffect(() => {
    loadReviews();
  }, [itemType, itemId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const itemReviews = await MockDataService.getItemReviews(itemType, itemId);
      setReviews(itemReviews);
    } catch (error) {
      console.error('Failed to load reviews:', error);
      showError('Error', 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      showError('Authentication Required', 'Please log in to submit a review');
      return;
    }

    if (newReview.rating === 0 || !newReview.title.trim() || !newReview.comment.trim()) {
      showError('Validation Error', 'Please fill in all fields and provide a rating');
      return;
    }

    try {
      const reviewData = {
        itemType,
        itemId,
        itemName,
        customerName: user.name,
        customerEmail: user.email,
        rating: newReview.rating,
        title: newReview.title.trim(),
        comment: newReview.comment.trim(),
        verified: true,
        helpful: 0
      };

      await MockDataService.createReview(reviewData);
      
      setNewReview({ rating: 0, title: '', comment: '' });
      setShowAddReview(false);
      loadReviews();
      
      showSuccess('Review Submitted', 'Thank you for your feedback!');
    } catch (error) {
      console.error('Failed to submit review:', error);
      showError('Submission Failed', 'Failed to submit review. Please try again.');
    }
  };

  const handleHelpfulClick = async (reviewId: string) => {
    try {
      await MockDataService.updateReviewHelpful(reviewId);
      loadReviews();
      showSuccess('Thank You', 'Your feedback has been recorded');
    } catch (error) {
      console.error('Failed to update helpful count:', error);
      showError('Error', 'Failed to record your feedback');
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((total / reviews.length) * 10) / 10;
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const averageRating = calculateAverageRating();
  const ratingDistribution = getRatingDistribution();

  if (loading) {
    return (
      <div className={`bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Star className="text-yellow-500" size={24} />
          <h3 className="text-xl font-bold text-gray-800">Customer Reviews</h3>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
            {reviews.length} review{reviews.length !== 1 ? 's' : ''}
          </span>
        </div>
        {canAddReview && user && (
          <button
            onClick={() => setShowAddReview(true)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
          >
            <Star size={16} />
            Write Review
          </button>
        )}
      </div>

      {/* Review Summary */}
      {reviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Overall Rating */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-800 mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  className={`${
                    star <= averageRating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-600">Based on {reviews.length} reviews</p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = ratingDistribution[rating as keyof typeof ratingDistribution];
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm w-8">{rating}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Review Form */}
      {showAddReview && (
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Write a Review</h4>
          
          <div className="space-y-4">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Rating *
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                    className="transition-colors duration-200"
                  >
                    <Star
                      size={24}
                      className={`${
                        star <= newReview.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300 hover:text-yellow-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Title *
              </label>
              <input
                type="text"
                value={newReview.title}
                onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Summarize your experience"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={100}
              />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review *
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Share your detailed experience..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={500}
              />
              <div className="text-sm text-gray-500 mt-1">
                {newReview.comment.length}/500 characters
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddReview(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
              >
                <Send size={16} />
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white/80 rounded-lg border border-gray-200 p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                  {review.customerName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          className={`${
                            star <= review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    {review.verified && (
                      <span className="flex items-center gap-1 text-green-600 text-sm">
                        <CheckCircle size={14} />
                        Verified
                      </span>
                    )}
                  </div>
                  <h4 className="font-semibold text-gray-800">{review.title}</h4>
                  <p className="text-sm text-gray-600">
                    by {review.customerName} • {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>

            {/* Review Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleHelpfulClick(review.id)}
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <ThumbsUp size={14} />
                  <span className="text-sm">Helpful ({review.helpful})</span>
                </button>
                <button className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors">
                  <Flag size={14} />
                  <span className="text-sm">Report</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Star size={48} className="mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
            <p>Be the first to share your experience with {itemName}!</p>
            {canAddReview && user && (
              <button
                onClick={() => setShowAddReview(true)}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
              >
                Write the First Review
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSystem;