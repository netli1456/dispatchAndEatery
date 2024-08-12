import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    reviewerId: { type: String, required: true },
    msg: { type: String, required: true },
    positive: { type: Boolean, default: true},
  },
  { timestamps: true }
);

const Review = mongoose.model('Review', ReviewSchema);
export default Review;
