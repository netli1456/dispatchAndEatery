import express from 'express';

import {
  getRiderAndReviews,
  getStores,
  gettingKitchenByLocation,
  getUserAccount,
  getUserReviews,
  logOut,
  passwordChange,
  resendOtp,
  Riders,
  setPassword,
  userBalance,
  userLogin,
  userRegister,
  vendorRegistration,
  verifyOtp,
} from '../controllers/usersController.js';
import { authMiddleware } from '../middleWareAuth/midleware.js';
import { upload } from '../config/multer.js';

const userRouter = express.Router();

const uploads = upload

userRouter.post('/register', userRegister);
userRouter.post('/signin', userLogin);
userRouter.post('/logout', logOut);

userRouter.get('/riders', Riders);
userRouter.get('/find/:id', getRiderAndReviews);
userRouter.get('/reviews/:id', getUserReviews);
userRouter.get('/account/find/:userId', authMiddleware, getUserAccount);
userRouter.get('/acct/:id', userBalance);
userRouter.get('/location', gettingKitchenByLocation);
userRouter.get('/stores', getStores);

userRouter.post('/verification', verifyOtp);
userRouter.post('/resendOtp', resendOtp);

userRouter.post('/resetpassword', passwordChange);
userRouter.post('/changepassword', setPassword);
userRouter.post(
  '/vendor/:fingerprint/registration/:userId',
  authMiddleware,
  uploads.single('businessImg'),
  vendorRegistration
);

export default userRouter;
