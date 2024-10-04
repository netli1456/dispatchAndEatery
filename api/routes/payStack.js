import express from 'express';
import { verifyPayment } from '../controllers/orders.js';


const paymentRouter = express.Router();
paymentRouter.post('/', verifyPayment)


export default paymentRouter