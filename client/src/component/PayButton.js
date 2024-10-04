import React, { useEffect, useState } from 'react';
import { PaystackButton } from 'react-paystack';
import { fetchSuccess } from '../redux/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import './test.css';
import { shippingSuccess } from '../redux/shippingSlice';
import { toast } from 'react-toastify';

const PayButton = ({ amount, email }) => {
  const publicKey = 'pk_test_47269eaf48549862609f2d6e6640579716bedee3';
  const dispatch = useDispatch();

  const componentProps = {
    email,
    amount: amount * 100,

    metadata: {
      name: 'no name man',
      phone: 'no name phonenumber',
    },
    publicKey,
    text: 'Pay Now',

    onSuccess: (reference) => {
      toast.success('Payment successful' + reference.reference, {
        toastId: 'unique-toastId',
      });

      dispatch(shippingSuccess({ reference: reference.reference }));
    },
    onClose: () =>
      toast.error('Payment cancelled', { toastId: 'unique-toastId' }),
  };

 

  return (
    <div>
      <PaystackButton className="paystack-btn" {...componentProps} />
    </div>
  );
};

export default PayButton;
