import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderedItems: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        imgs: [{ type: String, required: true }],
        category: { type: String, required: true },
        quantity: { type: Number, required: true },
        productId: { type: String, required: true },
      },
    ],
    shippingAddress: {
      name: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      street: { type: String, required: true },
      localGvt: { type: String, required: true },
      phoneNumber: { type: Number, required: true },
    },
    isDelivered: { type: Boolean, default: false },
    isPaid: { type: Boolean, default: false },
    isCancelled: { type: Boolean, default: false },
    isTaken: { type: Date },
    buyerId: { type: String, required: true },
    businessId: { type: String, required: true },
    isDeliveredAt: { type: Date },
    isPaidAt: { type: Date },
    total: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
