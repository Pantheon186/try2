import React, { useState } from 'react';
import { Star, ThumbsUp, MessageSquare, Flag, CheckCircle } from 'lucide-react';
import { Rate, Button, Modal, Form, Input, Select } from 'antd';
import { Review, ReviewAspect } from '../../types/enhanced';
import { Formatters } from '../../utils/formatters';

interface ReviewSystemProps {
  reviews: Review[];
  canAddReview?: boolean;
  onAddReview?: (review: Omit<Review, 'id' | 'createdAt' | 'verified' | 'helpful'>) => void;
  onHelpfulClick?: (reviewId: string) => void;
  onReportReview?: (reviewId: string, reason: string) => void;
  loading?: boolean;
}

const ReviewSystem: React.FC<ReviewSystemProps> = ({
  reviews,
  canAddReview = false,
  onAddReview,
  onHelpfulClick,
  onReportReview,
  loading = false
}) => {
  const [showAddReview, setShowAddReview] = useState(false);
  const [form] = Form.useForm();

  const reviewAspects = [
    { name: 'Service Quality', key: 'service' },
    { name: 'Value for Money', key: 'value' },
    { name: 'Cleanliness', key: 'cleanliness' },
    { name: 'Food & Dining', key: 'food' },
    { name: 'Entertainment', key: 'entertainment' },
    { name: 'Staff Friendliness', key: 'staff' }
  ];

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

  const handleSubmitReview = async (values: any) => {
    if (!onAddReview) return;

    const aspects: ReviewAspect[] = reviewAspects.map(aspect => ({
      name: aspect.name,
      rating: values[aspect.key] || 0
    }));

    const review = {
      rating: values.rating,
      title: values.title,
      comment: values.comment,
      aspects
    };

    await onAddReview(review);
    setShowAddReview(false);
    form.resetFields();
  };

  const averageRating = calculateAverageRating();
  const ratingDistribution = getRatingDistribution();

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">Customer Reviews</h3>
          {canAddReview && (
            <Button
              type="primary"
              onClick={() => setShowAddReview(true)}
              icon={<Star size={16} />}
            >
              Write Review
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Overall Rating */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-800 mb-2">
              {averageRating.toFixed(1)}
            </div>
            <Rate disabled value={averageRating} className="text-yellow-400 mb-2" />
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
      </div>

      {/* Individual Reviews */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Rate disabled value={review.rating} className="text-yellow-400 text-sm" />
                  {review.verified && (
                    <span className="flex items-center gap-1 text-green-600 text-sm">
                      <CheckCircle size={14} />
                      Verified
                    </span>
                  )}
                </div>
                <h4 className="font-semibold text-gray-800">{review.title}</h4>
              </div>
              <span className="text-sm text-gray-500">
                {Formatters.relativeTime(review.createdAt)}
              </span>
            </div>

            <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>

            {/* Aspect Ratings */}
            {review.aspects && review.aspects.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {review.aspects.map((aspect, index) => (
                  <div key={index} className="text-sm">
                    <span className="text-gray-600">{aspect.name}:</span>
                    <Rate
                      disabled
                      value={aspect.rating}
                      className="text-yellow-400 ml-2"
                      style={{ fontSize: '12px' }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Review Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onHelpfulClick?.(review.id)}
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <ThumbsUp size={14} />
                  <span className="text-sm">Helpful ({review.helpful})</span>
                </button>
                <button
                  onClick={() => onReportReview?.(review.id, 'inappropriate')}
                  className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <Flag size={14} />
                  <span className="text-sm">Report</span>
                </button>
              </div>

              {review.response && (
                <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors">
                  <MessageSquare size={14} />
                  <span className="text-sm">View Response</span>
                </button>
              )}
            </div>

            {/* Management Response */}
            {review.response && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-blue-800">Management Response</span>
                  <span className="text-sm text-blue-600">
                    {Formatters.relativeTime(review.response.respondedAt)}
                  </span>
                </div>
                <p className="text-blue-700">{review.response.message}</p>
              </div>
            )}
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Star size={48} className="mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
            <p>Be the first to share your experience!</p>
          </div>
        )}
      </div>

      {/* Add Review Modal */}
      <Modal
        title="Write a Review"
        open={showAddReview}
        onCancel={() => setShowAddReview(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitReview}
          className="space-y-4"
        >
          <Form.Item
            name="rating"
            label="Overall Rating"
            rules={[{ required: true, message: 'Please provide a rating' }]}
          >
            <Rate className="text-yellow-400" />
          </Form.Item>

          <Form.Item
            name="title"
            label="Review Title"
            rules={[{ required: true, message: 'Please provide a title' }]}
          >
            <Input placeholder="Summarize your experience" />
          </Form.Item>

          <Form.Item
            name="comment"
            label="Your Review"
            rules={[{ required: true, message: 'Please write your review' }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Share your detailed experience..."
            />
          </Form.Item>

          {/* Aspect Ratings */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Rate Specific Aspects
            </label>
            {reviewAspects.map((aspect) => (
              <Form.Item
                key={aspect.key}
                name={aspect.key}
                label={aspect.name}
                className="mb-2"
              >
                <Rate className="text-yellow-400" />
              </Form.Item>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button onClick={() => setShowAddReview(false)}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              Submit Review
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ReviewSystem;