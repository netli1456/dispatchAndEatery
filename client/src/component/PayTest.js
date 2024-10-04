import React, { useEffect } from 'react';
import PayButton from './PayButton';
import { useSelector } from 'react-redux';
import { api } from '../utils/apiConfig';
import axios from 'axios';

function PayTest() {
  const { userInfo } = useSelector((state) => state.user);

  const amount = 200;
  const email = 'officialmbite@gmail.com';

  useEffect(() => {
    if (userInfo?.reference?.message === 'Approved') {
      verifyPayment(userInfo?.reference.reference);
    }
  }, [userInfo]);

  console.log(userInfo);

  const verifyPayment = async (reference) => {
    try {
      const { data } = await axios.post(`${api}/api/pay`, { reference });
      console.log('this is coming from useeffect', data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>pay Test</h1>
      <PayButton amount={amount} email={email} />
    </div>
  );
}

export default PayTest;
