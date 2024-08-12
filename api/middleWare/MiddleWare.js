import Product from '../models/Product.js';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';



export const sanitizeUser = (user) => {
  const { password, ...userData } = user.toObject();
  return userData;
};

export const sanitizeKitchen = (kitchen) => {
  const { password, ...kitchenData } = kitchen.toObject();
  return kitchenData;
};

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      surname: user.surname,
      email: user.email,
      firstname: user.firstname,
    },
    process.env.JWT_SECRET
  );
};

export const queryFit = async (req, res) => {
  try {
    const searchQuery = query.query;
    const page = query.page || '';
    const pageSize = query.pageSize || PAGE_SIZE;

    const order = query.order || '';
    const rating = query.rating || '';
    const category = query.category || '';
    const price = query.price || '';

    const queryFitter =
      searchQuery && searchQuery !== 'all'
        ? {
            name: { regex: searchQuery, options: 'i' },
            type: { regex: searchQuery, options: 'i' },
          }
        : {};

    const categoryFilter =
      category && category !== all
        ? {
            category: { category },
          }
        : {};

    const ratingFilter =
      rating && rating !== 'all' ? { rating: { $gte: Number(rating) } } : '';

    priceFilter =
      price && price !== 'all'
        ? {
            price: {
              $gte: Number(price.split('_')[0]),
              $lte: Number(price.split('_')[1]),
            },
          }
        : {};
    const products = await Product.find({
      ...priceFilter,
      ...queryFitter,
      ...categoryFilter,
      ...ratingFilter,
    });
    const uniqueKitchenIds = new Set(products.map((product) => product.userId));
    const uniqueKitchens = await User.find({
      _id: { $in: Array.from(uniqueKitchenIds) },
    })
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countProducts = uniqueKitchens.countDocuments();
    res
      .status(200)
      .json({
        kitchens: uniqueKitchens,
        countProducts,
        page,
        pages: Math.ceil(countProducts / pageSize),
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const generateOtp = async (user) => {
  
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  const saltRounds = 10;
  let otp = '';
  const characters = '0123456789';
  for (let i = 0; i < 6; i++) {
    otp += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  let hashOtp = bcrypt.hashSync(otp, saltRounds);
    console.log(otp)
  await transporter.sendMail({
    to: user.email,
    from: process.env.USER,
    subject: 'M-bite Verification code',
    text: `Your M-bite verification code is ${otp}. Do not disclose this code to anyone`,
  });

  return hashOtp;
};