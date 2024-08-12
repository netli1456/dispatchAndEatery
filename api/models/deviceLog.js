import mongoose from 'mongoose';

const devices = new mongoose.Schema({
  userId: { type: String, required: true },
  devices: [
    {
      fingerprint: { type: String },
      device: { type: String },
      ip: { type: String },
      location: { type: String },
      browser: { type: String },
      otp: { type: String },
      otpIsVerified: { type: Boolean, default: false },
      otpCreatedAt: { type: Date, default: Date.now() },
    },
  ],
});

const Device = mongoose.model('Device', devices);
export default Device;
