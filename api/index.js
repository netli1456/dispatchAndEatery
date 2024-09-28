import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import productRouter from './routes/product.js';
import reviewRouter from './routes/reviews.js';
import OrderRouter from './routes/orders.js';
import Flutterwave from 'flutterwave-node-v3';
import flutterRouter from './routes/flutter.js';
import transactionRouter from './routes/transactionHistory.js';
import cookieParser from 'cookie-parser';
import { authMiddleware } from './middleWareAuth/midleware.js';
import userRouter from './routes/userRoutes.js';

dotenv.config();
const app = express();

export const flw = new Flutterwave(
  process.env.FLUTTER_PUBLIC_KEY,
  process.env.FLUTTER_SECRET_KEY
);

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: 'https://mbitee.onrender.com',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/orders', OrderRouter);
app.use('/api/payment', flutterRouter);
app.use('/api/transactions/:fingerprint', authMiddleware, transactionRouter);

const port = process.env.PORT;
mongoose
  .connect(process.env.MONGODB)
  .then(() => {
    console.log('connected DB');
  })
  .catch((error) => console.log(error));
app.listen(port, () => {
  console.log('server connected @ port ' + port);
});
