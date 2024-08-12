import express from 'express';
import {
  createVirtuaAccount,
  deposited,
  fetch,
  initTrans,
} from '../controllers/flutter.js';

const flutterRouter = express.Router();

flutterRouter.post('/create/:id', createVirtuaAccount);
flutterRouter.post('/webhook', deposited);
flutterRouter.post('/transfer', initTrans);
flutterRouter.get('/account/:id', fetch);

export default flutterRouter;
