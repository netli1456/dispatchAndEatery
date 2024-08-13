import Product from '../models/Product.js';
import User from '../models/userModel.js';

export const postProduct = async (req, res) => {
  try {
    const { userId } = req.query;
    const user = await User.findById(userId);
    if (user.businessName !== '') {
      const product = new Product({ ...req.body, userId: user._id });
      await product.save();
      res.status(200).json(product);
    } else {
      res.status(401).json({ message: 'not authorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const singleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const products = await Product.findById(id);
    if (products.name) {
      const kitchen = await User.findById(products.userId);
      const product = {
        name: products.name,
        desc: products.desc,
        price: products.price,
        _id: products._id,
        businessName: kitchen.businessName,
        rating: kitchen.rating,
        verified: kitchen.verified,
        physicalAddress: kitchen.physicalAddress,
        userId: kitchen._id,
        content: products.content,
        imgs: products.imgs,
        category: products.category,
        type: products.type,
      };
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProducts = async (req, res) => {
  const fetchedProductIds = new Set();
  try {
    const { price, category, query, page = 1, pageSize = 10 } = req.query;

    const skip = (page - 1) * pageSize;

    let aggregationPipeline = [];

    if (price) {
      aggregationPipeline.push({ $match: { price: parseInt(price) } });
    }
    if (category) {
      aggregationPipeline.push({ $match: { category: category } });
    }
    if (query) {
      aggregationPipeline.push({
        $match: {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { desc: { $regex: query, $options: 'i' } },
            { category: { $regex: query, $options: 'i' } },
            { type: { $regex: query, $options: 'i' } },
            { userId: { $regex: query, $options: 'i' } },
          ],
        },
      });
    }

    aggregationPipeline.push({
      $match: { _id: { $nin: Array.from(fetchedProductIds) } },
    });
    aggregationPipeline.push({ $sample: { size: parseInt(pageSize) } });

    const products = await Product.aggregate(aggregationPipeline);
    products.forEach((product) => fetchedProductIds.add(product._id));

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const kitchenItems = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, pageSize = 3 } = req.query;
    const skip = (page - 1) * pageSize;

    const query = req.query.query || 'all';
    const price = req.query.price || 'all';
    const category = req.query.category || 'all';

    const fetchKitchenProducts = new Set();

    const aggregationPipeline = [
      { $skip: skip },
      { $match: { userId: userId } },
    ];

    if (query !== 'all') {
      aggregationPipeline.push({
        $match: {
          $or: [
            { desc: { $regex: query, $options: 'i' } },
            { name: { $regex: query, $options: 'i' } },
            { category: { $regex: query, $options: 'i' } },
            { type: { $regex: query, $options: 'i' } },
          ],
        },
      });
    } else {
      {
      }
    }
    if (category !== 'all') {
      aggregationPipeline.push({ $match: { category: category } });
    } else {
      {
      }
    }
    if (price !== 'all') {
      aggregationPipeline.push({ $match: { price: parseInt(price) } });
    } else {
      {
      }
    }

    aggregationPipeline.push({
      $match: { _id: { $nin: Array.from(fetchKitchenProducts) } },
    });

    const products = await Product.aggregate(aggregationPipeline);
    const user = await User.findById(userId);

    res.status(200).json({
      products: products,
      businessName: user.businessName,
      verified: user.verified,
      businessImg: user.businessImg,
    });
  } catch (error) {
    res.status(500).json({ message: 'something went wrong' });
  }
};

export const kitchenCat = async (req, res) => {
  try {
    const { userId } = req.params;
    const products = await Product.find({ userId }).distinct('category');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const relatedProducts = async (req, res) => {
  try {
    const cartItems = req.body.cartItems;
    const product = req.body.product;
    const query =
      product.type > 2
        ? product.type.slice(0, 3)
        : product.type ||
          cartItems.map((item) =>
            item.type > 4 ? item.type.slice(0, 3) : item.type
          );

    const userId = product.userId || cartItems[0].userId;
    const id = product._id || cartItems[0]._id;

    let aggregationPipeline = [{ $match: { userId: userId } }];

    if (query) {
      aggregationPipeline.push({
        $match: {
          $or: [
            {
              desc: {
                $regex: query,
                $options: 'i',
              },
            },
            {
              name: {
                $regex: query,
                $options: 'i',
              },
            },
            {
              category: {
                $regex: query,
                $options: 'i',
              },
            },
            {
              type: {
                $regex: query,
                $options: 'i',
              },
            },
          ],
        },
      });

      const cartIds = cartItems.map((item) => item._id);
      const products = await Product.aggregate(aggregationPipeline);
      const filteredProduct = products.filter(
        (item) =>
          item._id.toString() !== id && !cartIds.includes(item._id.toString())
      );
      if (filteredProduct.length === 0) {
        const availableProducts = await Product.aggregate([
          { $match: { userId: userId } },
          { $sample: { size: 7 } },
        ]);
        const filteredProducts = availableProducts.filter(
          (item) =>
            item._id.toString() !== id && !cartIds.includes(item._id.toString())
        );
        return res.status(200).json(filteredProducts);
      }
      res.status(200).json(filteredProduct);
    }
  } catch (error) {
    res.status(500).json({ message: 'something went wrong' });
  }
};
