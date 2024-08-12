import express from 'express';
import { getTransactions } from '../controllers/transactionHistory.js';



const transactionRouter = express.Router()

transactionRouter.get('/history/:id',  getTransactions)

export default transactionRouter