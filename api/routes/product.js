import express from 'express';
import { getProducts, kitchenCat, kitchenItems, postProduct, relatedProducts, singleProduct } from '../controllers/products.js';

const productRouter = express.Router();

productRouter.post('/post', postProduct)
productRouter.get('/', getProducts)
productRouter.get('/find/:id', singleProduct)
productRouter.get('/kitchen/:userId', kitchenItems)
productRouter.get('/kitchen/cat/:userId', kitchenCat)
productRouter.post('/recommended', relatedProducts)


export default productRouter