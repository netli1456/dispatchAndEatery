import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { api, useFingerprint } from '../utils/apiConfig';
import axios from 'axios';
import { fetchSuccess } from '../redux/userSlice';
import { toast } from 'react-toastify';
import ResetPassword from './ResetPassword';

function ChangePassword() {
  const [password, setPassword] = useState('');
 
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);
  const fingerprint = useFingerprint();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${api}/api/users/changepassword`, {
        email: userInfo.user.email,
        password: password,
        fingerprint: fingerprint,
      });
      dispatch(fetchSuccess(data));
      setLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.user?._id) {
      navigate(`/`);
    }
  }, [userInfo, navigate]);

  return (
    <div>
      <ResetPassword
        handleResetPassword={handleResetPassword}
        setPassword={setPassword}
        isPassword={true} loading={loading}
      />
    </div>
  );
}

export default ChangePassword;
