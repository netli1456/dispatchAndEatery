import mongoose from 'mongoose';


const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  imgId: { type: String, required: true },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userId: { type: String, required: true },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
    content: [{ type: String, required: true }],
    imgs: [imageSchema],
    imgsId: [{ type: String, }],
    removed: { type: Boolean, default: false },
    category: { type: String, required: true },
    type: { type: String, required: true},
    visibility:{ type: String},
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
