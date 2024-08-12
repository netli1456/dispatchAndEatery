import Flutterwave from 'flutterwave-node-v3';
import User from '../models/User.js';
import { flw } from '../index.js';
import Account from '../models/accounts.js';
import crypto from 'crypto';

export const createVirtuaAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.email !== '') {
      const details = {
        email: user.email,
        is_permanent: false,
        amount: 1,
      };
      const response = await flw.VirtualAcct.create(details);
      console.log(response);
      if (response.status === 'success') {
        const account = new Account({
          bank: response.data.bank_name,
          userId: user._id,
          accountNumber: response.data.account_number,
          order_ref: response.data.order_ref,
        });

        user.wallet = true;
        await user.save();
        await account.save();
        return res
          .status(200)
          .json({ bank: account.bank, accountNumber: account.accountNumber });
      } else {
        return res.status(500).json({ message: 'unsuccessful' });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deposited = async (req, res) => {
  try {
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
    const hash = req.get('verif-hash');

    const expectedHash = crypto
      .createHmac('sha256', WEBHOOK_SECRET)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash !== expectedHash) {
      console.error('Invalid webhook request: hash mismatch');
      return res.status(401).send('Unauthorized');
    }
    const eventData = req.body;
    console.log('Received webhook data:', eventData);

    // Extract relevant transaction details

    if (eventData.data && eventData.data.processor_response === 'success') {
      const updateDetails = await User.findOne({
        email: eventData.data.customer.email,
      });
      if (updateDetails) {
        updateDetails.balance += +eventData.data.amount;
        await updateDetails.save();
        const account = await Account.findByIdAndUpdate(
          updateDetails._id,
          {
            balance: updateDetails.balance,
          },
          { new: true }
        );
        await account.save();
        return res.status(200).json(account);
      }
    } else {
      return res.status(400).json({ message: 'Transaction failed' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const initTrans = async () => {
  try {
    const payload = {
      account_bank: '044', //This is the recipient bank code. Get list here :https://developer.flutterwave.com/v3.0/reference#get-all-banks
      account_number: '67100155',
      amount: 5500,
      narration: 'Akhlm Pstmn Trnsfr xx007',
      currency: 'NGN',
      reference: 'akhlm-pstmnpyt-r02ens007_PMCKDU_1', //This is a merchant's unique reference for the transfer, it can be used to query for the status of the transfer
      callback_url: 'https://www.flutterwave.com/ng/',
      debit_currency: 'NGN',
    };

    const response = await flw.Transfer.initiate(payload);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

export const fetch = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const account = await Account.findOne({ userId: user._id.toString() });
    if (!account) {
      return res.status(401).json({ message: 'you dont have an account yet' });
    }

    const payload = {
      order_ref: account.order_ref +'12',
    };
    const response = await flw.VirtualAcct.fetch(payload);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};
