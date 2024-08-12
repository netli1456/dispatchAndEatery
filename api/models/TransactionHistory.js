import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    businessId: { type: String, required: true },
    buyerId: { type: String, required: true },
    amount: { type: Number, required: true },
    orderId: { type: String, required: true },
    status: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const TransactionHistory = mongoose.model(
  'TransactionHistory',
  transactionSchema
);
export default TransactionHistory;
