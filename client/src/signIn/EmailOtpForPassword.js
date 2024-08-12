import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { api, useFingerprint } from '../utils/apiConfig';
import axios from 'axios';
import { fetchSuccess } from '../redux/userSlice';
import { toast } from 'react-toastify';
import ResetPassword from './ResetPassword';

function EmailOtpForPassword() {

    
  const [email, setEmail] = useState('');
  const [data, setData] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
   const [loading, setLoading] = useState(false)
    const fingerprint = useFingerprint();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${api}/api/users/resetpassword`, {
        email: email,
        fingerprint: fingerprint,
      });
     
      dispatch(fetchSuccess(data));
      setData(data);
      setLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data?.user?.url) {
      navigate(`/verification/${data?.user?.url}/auth`);
    }
  }, [data, navigate]);


  return (
    <div>
      <ResetPassword handleResetPassword={handleResetPassword} setEmail={setEmail} loading={loading}/>
    </div>
  )
}

export default EmailOtpForPassword
