import express from 'express';
import {
  getProducts,
  kitchenCat,
  kitchenItems,
  postProduct,
  relatedProducts,
  singleProduct,
} from '../controllers/products.js';

import { upload,  } from '../config/multer.js';
import { authMiddleware } from '../middleWareAuth/midleware.js';

const productRouter = express.Router();
const uploads = upload;

productRouter.post('/post/:fingerprint', authMiddleware, uploads.array('imgs'), postProduct);
productRouter.get('/', getProducts);
productRouter.get('/find/:id', singleProduct);
productRouter.get('/kitchen/:userId', kitchenItems);
productRouter.get('/kitchen/cat/:userId', kitchenCat);
productRouter.post('/recommended', relatedProducts);

export default productRouter;
