import React, { useEffect, useState } from 'react';
import PhonelinkLockIcon from '@mui/icons-material/PhonelinkLock';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './signup.css';
import Button from 'react-bootstrap/esm/Button';
import axios from 'axios';
import { api } from '../utils/apiConfig';
import { useDispatch, useSelector } from 'react-redux';
import { clearCount, fetchSuccess, updateCountDown } from '../redux/userSlice';
import {  useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinners from '../utils/Spinner';

function OtpVerification() {
  const [loading, setLoading] = useState(false);
  const { userInfo, countdown } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');

  const handleVerification = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`${api}/api/users/verification`, {
        email: userInfo?.user?.email || userInfo.email,
        otpCode: otp,
        fingerprint: userInfo?.user?.rdt || userInfo?.rdt,
        resetPasswordOtp:
          userInfo?.user.resetPasswordOtp || userInfo.resetPasswordOtp,
      });

      dispatch(fetchSuccess(data));
      navigate('/');
      setLoading(false);
      if (data?.user?.firstname || data.firstname) {
        toast.success(`Welcome! ${data?.user?.firstname || data.firstname}`, {
          autoClose: false,
          theme: 'light',
          toastId: 'unique-toast-id',
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message, {
        autoClose: true,
        theme: 'colored',
        toastId: 'unique-toast-id',
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleCount = () => {
      let count = countdown;
      const timer = setInterval(() => {
        if (count > 0) {
          count -= 1;
          dispatch(updateCountDown(count));
        } else {
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    };
    handleCount();
  }, [countdown, dispatch]);

  const handleCount = async () => {
    try {
      if (!userInfo?.user?.resetPasswordOtp || userInfo.resetPasswordOtp) {
        await axios.post(`${api}/api/users/resendOtp`, {
          email: userInfo?.user?.email || userInfo?.email,
          fingerprint: userInfo?.user?.rdt || userInfo?.user.fingerprint,
        });
      } else {
        await axios.post(`${api}/api/users/resetpassword`, {
          email: userInfo?.user?.email || userInfo?.email,
          fingerprint: userInfo?.user?.rdt || userInfo?.fingerprint,
        });
      }
      dispatch(updateCountDown(60));
      toast.success(`sent successfully, check your email.`, {
        autoClose: true,
        theme: 'light',
        toastId: 'unique-toast-id',
      });
    } catch (error) {
      toast.error(error.response.data.message, { toastId: 'unique-toast-id' });
    }
  };

  useEffect(() => {
    if (userInfo?.user?._id || userInfo?._id) {
      dispatch(clearCount());
      navigate('/');
    } else if (userInfo?.user?.urlf || userInfo?.urlf) {
      dispatch(clearCount());
      navigate(
        `/newpassword/change/${userInfo?.user?.urlf || userInfo?.urlf}/change`
      );
    } else if (!userInfo?.user?.url || userInfo?.urlf) {
      navigate('/signin');
    }
  });

  useEffect(() => {
    if (!userInfo?.user?.url) {
    }
  }, [userInfo, dispatch]);

  return (
    <div style={{ overflowX: 'hidden' }}>
      <Row>
        <Col
          className="border m-auto  "
          style={{ height: '80vh', overflowX: 'hidden' }}
        >
          <div
            className="d-flex flex-column justify-content-center align-items-center "
            style={{ height: '100%' }}
          >
            <div>
              <PhonelinkLockIcon
                className="text-success mb-3"
                style={{ width: '120px', height: '120px' }}
              />
            </div>
            <div className="d-flex flex-column text-center">
              <strong className="fs-3 fw-bold">
                {userInfo?.user?.resetPasswordOtp || userInfo?.resetPasswordOtp
                  ? 'Email verification'
                  : 'Verify this device'}
              </strong>
              <span>
                {userInfo?.user?.resetPasswordOtp || userInfo?.resetPasswordOtp
                  ? `For us to know that you are the owner of this account, `
                  : ''}{' '}
                <br /> A verification code has been sent to{' '}
                <strong>{`${'*'.repeat(
                  userInfo?.user?.email?.length - 13 ||
                    userInfo?.email?.length - 13
                )}${
                  userInfo?.user?.email?.slice(-13) ||
                  userInfo?.email?.slice(-13)
                } `}</strong>
                <br />
                check your email inbox or spam folder
              </span>
              <form
                className="d-flex gap-1 my-4 justify-content-center align-items-center "
                onSubmit={handleVerification}
              >
                <input
                  type="text"
                  className="rounded border-success fw-bold text-center"
                  maxLength="6"
                  size="20"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="enter code"
                  value={otp}
                />

                <button type="submit" style={{ display: 'none' }}></button>
              </form>
              <Button
                style={{ width: 'fit-content' }}
                disabled={countdown > 0}
                variant="light"
                className="my-4  "
                onClick={handleCount}
              >
                Resend Code{countdown > 0 && `(${countdown}s)`}
              </Button>
              <div className="d-grid" style={{ position: 'relative' }}>
                <Button
                  disabled={otp.length < 6}
                  variant="success"
                  className="text-success rounded text-white fw-bold"
                  onClick={handleVerification}
                >
                  Verify
                </Button>
                {loading && (
                  <div style={{ position: 'absolute', top: 2, left: '45%' }}>
                    {' '}
                    <Spinners />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default OtpVerification;
