import express from 'express';
import {
  CreateOrder,
  getSingleOrder,
  orderedItems,
  refundAndCancelOrder,
  takeOrder,
} from '../controllers/orders.js';
import { authMiddleware } from '../middleWare/midleware.js';

const OrderRouter = express.Router();

OrderRouter.post(
  '/:fingerprint/:buyerId/:businessId',
  authMiddleware,
  CreateOrder
);
OrderRouter.get('/:fingerprint/allorders/:id', authMiddleware, orderedItems);
OrderRouter.get(
  '/:fingerprint/find/:orderId/:id',
  authMiddleware,
  getSingleOrder
);
OrderRouter.put(
  '/:fingerprint/takeorder/:businessId/:orderId',
  authMiddleware,
  takeOrder
);
OrderRouter.put(
  '/:fingerprint/refund/:id/:orderId',
  authMiddleware,
  refundAndCancelOrder
);
// OrderRouter.get('/test/:id', searchOrder)

export default OrderRouter;
