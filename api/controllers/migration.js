// import mongoose from 'mongoose';
// import User from '../models/userModel.js';
// import Product from '../models/Product.js';
// // import dotenv from 'dotenv';
// // import User from '../models/User.js';
// // import Order from '../models/Order.js';
// // import Product from '../models/Product.js';
// // import Account from '../models/accounts.js';
// // import Review from '../models/Review.js';
// // import TransactionHistory from '../models/TransactionHistory.js';

// // Connect to both local and MongoDB Atlas databases
// const localConnection = mongoose.createConnection('mongodb://127.0.0.1:27017/dispatchandeatery-project');
// const atlasConnection = mongoose.createConnection("mongodb+srv://netlif456:netlif456@cluster0.txq7b9r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

// export const inserLoclToOnline = async function migrateData() {
//   try {
//     // Retrieve data from local database
//     const localUsers = await Product.find().lean(); // Assuming User is your Mongoose model

//     // Insert data into MongoDB Atlas database
//     await atlasConnection.collection('products').insertMany(localUsers);

//     console.log('Data migration successful');
//   } catch (error) {
//     console.error('Data migration failed:', error);
//   } finally {
//     // Close connections to release resources
//     localConnection.close();
//     atlasConnection.close();
//   }
// };
