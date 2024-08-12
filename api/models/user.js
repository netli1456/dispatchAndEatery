import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    surname: { type: String },
    firstname: { type: String },
    password: { type: String, required: true },
    businessName: { type: String },
    businessImg: { type: String },
    wallet: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    physicalAddress: { type: String },
    img: { type: String },
    suspended: { type: Boolean, default: false },
    blocked: { type: Boolean, default: false },
    deliveryRate: { type: Number, default: 1 },
    km: { type: Number, default: 57 },
    timeOpen: { type: String },
    balance: { type: Number, default: 0 },
    isDispatcher: { type: Boolean, default: false },
    age: { type: Date },
    state: { type: String },
    country: { type: String },
    email: { type: String, required: true, unique: true },
    isBusinessOwner: { type: Boolean, default: false },
    lga: { type: String },
    otp: { type: String },
    

    otpIsVerified: { type: Boolean, default: false },
    otpCreatedAt: {
      type: Date,
      default: Date.now(),
    },
    placesCanDeliverTo: { type: Array, default: [] },
  },
  { timestamps: true }
);
const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
