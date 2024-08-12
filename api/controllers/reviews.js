
import Review from '../models/Review.js';

export const createReview = async (req, res) => {
  try {
    const review = new Review({...req.body});
    await review.save();
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
