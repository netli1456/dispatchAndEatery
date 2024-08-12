import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    balance: { type: Number, default: 0 },
    bank: { type: String, required: true },
    accountNumber: { type: String, required: true },
    order_ref: { type: String, required: true },
  },
  { timestamps: true }
);

const Account = mongoose.model('Account', accountSchema);
export default Account;
