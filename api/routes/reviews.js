import express from 'express';
import { createReview } from '../controllers/reviews.js';

const reviewRouter = express.Router();

reviewRouter.post('/', createReview)

export default reviewRouter