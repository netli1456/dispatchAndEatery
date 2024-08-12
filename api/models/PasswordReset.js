import mongoose from 'mongoose';

const password = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    fingerprint: { type: String, required: true },
    otp: { type: String, required: true },
    otpIsVerified: { type: Boolean, default: false},
    otpCreatedAt: { type: Date, default: Date.now, }
  },
  { timestamps: true }
);

const ResetPassword = mongoose.model('ResetPassword', password);
export default ResetPassword;
