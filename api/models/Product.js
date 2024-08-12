import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userId: { type: String, required: true },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
    content: [{ type: String, required: true }],
    imgs: [{ type: String, required: true }],
    removed: { type: Boolean, default: false },
    category: { type: String, required: true },
    type: { type: String, required: true}
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
