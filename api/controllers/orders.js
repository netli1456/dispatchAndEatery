import Order from '../models/Order.js';
import TransactionHistory from '../models/TransactionHistory.js';
import User from '../models/userModel.js';

export const CreateOrder = async (req, res) => {
  try {
    const { buyerId, businessId } = req.params;
    const shippingAddress = req.body.shippingAddress;
    const customer = await User.findById(buyerId);

    if (!customer) {
      return res.status(404).json({ message: 'not a registered  user' });
    }

    const orderedItems = req.body.orderedItems;
    if (customer._id.toString() !== businessId) {
      if (customer.balance >= req.body.total) {
        if (orderedItems) {
          const singleItem = orderedItems.map((item) => {
            return {
              name: item.name,
              price: item.price,
              imgs: item.imgs,
              quantity: item.quantity,
              productId: item._id,
              category: item.category,
            };
          });

          const business = await User.findById(businessId);
          if (business) {
            for (const item of orderedItems) {
              if (item.userId !== business._id.toString()) {
                return res
                  .status(401)
                  .json({ message: 'something went wrong' });
              }
            }
          }

          const order = new Order({
            ...req.body,
            orderedItems: singleItem,
            shippingAddress: shippingAddress,
            buyerId: customer._id,
            businessId: business._id,
            total: req.body.total,
            subtotal: req.body.subtotal,
            shippingFee: req.body.shippingFee,
          });

          const ordered = await order.save();

          if (ordered.total) {
            customer.balance = customer.balance - order.total;
            business.balance = business.balance + order.total;
            await customer.save();
            await business.save();
          } else {
            return res.status({ message: 'something went wrong' });
          }

          const transactionHistory = new TransactionHistory({
            businessId: business._id,
            buyerId: customer._id,
            amount: order.total,
            status: true,
            orderId: order._id,
          });
          await transactionHistory.save();
          return res.status(200).json({ _id: order._id });
        }
      } else {
        return res.status(404).json({ message: 'Insufficient funds' });
      }
    } else {
      return res
        .status(403)
        .json({ message: 'sorry! you can not buy from yourself' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const orderedItems = async (req, res) => {
  try {
    const { id } = req.params;
    const { query } = req.query;

    const orders = [];
    const searchConditions = { $or: [{ businessId: id }, { buyerId: id }] };

    switch (query) {
      case 'pending':
        searchConditions.isPaid = false;
        break;
      case 'delivered':
        searchConditions.isDelivered = true;
        searchConditions.isPaid = true;
        break;
      case 'refunded':
        searchConditions.isCancelled = true;
        break;
      case 'dispatched':
        searchConditions.isTaken = { $exists: true };
        break;
      default:
        break;
    }

    const isBusinessId = await User.findById(id);

    if (isBusinessId) {
      const order = await Order.find(searchConditions).sort({ createdAt: -1 });

      if (order.length !== 0) {
        for (const item of order) {
          const singleItem = item.orderedItems.map((items) => {
            return {
              name: items.name,
              category: items.category,
              quantity: items.quantity,
              productId: items.productId,
            };
          });

          const items = {
            content: singleItem,
            imgs: item.orderedItems[0].imgs[0],
            _id: item._id,
            isDelivered: item.isDelivered,
            isPaid: item.isPaid,
            isDispatched: item.isDispatched,
            isRefunded: item.isRefunded,
            isCancelled: item.isCancelled,
          };
          orders.push(items);
        }
      }

      const counts = {
        pending: await Order.countDocuments({
          $or: [{ businessId: id }, { buyerId: id }],
          isPaid: false,
        }),
        delivered: await Order.countDocuments({
          $or: [{ businessId: id }, { buyerId: id }],
          isDelivered: true,
          isPaid: true,
        }),
        refunded: await Order.countDocuments({
          $or: [{ businessId: id }, { buyerId: id }],
          isCancelled: true,
        }),
        dispatched: await Order.countDocuments({
          $or: [{ businessId: id }, { buyerId: id }],
          isTaken: { $exists: true },
        }),
        all: await Order.countDocuments({
          $or: [{ businessId: id }, { buyerId: id }],
        }),
      };

      res
        .status(200)
        .json({ orders: orders, bal: isBusinessId.balance, counts });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSingleOrder = async (req, res) => {
  try {
    const { id, orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId.toString(),
      $or: [{ businessId: id }, { buyerId: id }],
    });
    if (!order) {
      return res.status(404).json({ message: 'order not found' });
    }
    if (order.orderedItems.length !== 0) {
      const businessId = order.businessId === id && order.businessId;
      const orders = order.orderedItems.map((item) => {
        const price = item.price.toFixed(2) * item.quantity.toFixed(2);

        return {
          name: item.name,
          img: item.imgs[0],
          quantity: item.quantity,
          price: price,
          category: item.category,
          productId: item.productId,

          businessId: businessId,
        };
      });

      const { orderedItems, ...other } = order._doc;
      const buyer = await User.findById(order.buyerId);
      if (!buyer) {
        return res.status(404).json({ message: 'user not found' });
      }
      const business = await User.findById(order.businessId);
      if (!business) {
        return res.status(404).json({ message: 'user not found' });
      }
      const others = {
        ...other,
        buyerName: buyer.surname + buyer.firstname,
        businessName: business.businessName,
        businessId: business._id,
        buyerId: buyer._id,
        rating: business.rating,
      };

      res.status(200).json({ products: orders, details: others });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const takeOrder = async (req, res) => {
  try {
    const { businessId, orderId } = req.params;
    const user = await User.findById(businessId);
    if (!user) {
      return res.status(404).json({ message: 'auauthorized action' });
    }
    const order = await Order.findById(orderId);
    if (order.isTaken) {
      return res.status(400).json({ message: 'Order is already taken' });
    }
    if (user._id.toString() !== order.businessId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const takenOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        isTaken: Date.now(),
      },
      { new: true }
    );
    res.status(200).json(takenOrder.isTaken);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const refundAndCancelOrder = async (req, res) => {
  try {
    const { id, orderId } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'not a user' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'order not found' });
    }

    if (
      !order.isCancelled &&
      user.isBusinessOwner &&
      user._id.toString() === order.businessId
    ) {
      const canceledOrder = await Order.findByIdAndUpdate(
        orderId,
        {
          isCancelled: true,
          isTaken: Date.now(),
        },
        { new: true }
      );

      user.balance = user.balance - order.total;
      await user.save();
      const buyer = await User.findById(order.buyerId);
      buyer.balance = buyer.balance + order.total;
      await buyer.save();
      await canceledOrder.save();
      res.status(200).json(canceledOrder.isCancelled);
    } else {
      return res.status(403).json({ message: 'order already cancelled' });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
