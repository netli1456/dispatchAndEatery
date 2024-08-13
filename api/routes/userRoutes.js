import express from 'express';

import { getRiderAndReviews, getStores, gettingKitchenByLocation, getUserAccount, getUserReviews, passwordChange, resendOtp, Riders, setPassword, userBalance, userLogin, userRegister, verifyOtp } from '../controllers/usersController.js';
import { authMiddleware } from '../middleWareAuth/midleware.js';


const userRouter = express.Router();

userRouter.post('/register', userRegister);
userRouter.post('/signin', authMiddleware, userLogin);

userRouter.get('/riders', Riders);
userRouter.get('/find/:id', getRiderAndReviews);
userRouter.get('/reviews/:id', getUserReviews);
userRouter.get('/account/find/:userId', getUserAccount);
userRouter.get('/acct/:id', userBalance);
userRouter.get('/location', gettingKitchenByLocation);
userRouter.get('/stores', getStores);


userRouter.post('/verification', verifyOtp);
userRouter.post('/resendOtp', resendOtp);
userRouter.post('/signin', userLogin);
userRouter.post('/resetpassword', passwordChange);
userRouter.post('/changepassword', setPassword);

export default userRouter;
