import React, { useEffect, useRef, useState } from 'react';
import PhonelinkLockIcon from '@mui/icons-material/PhonelinkLock';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './signup.css';
import Button from 'react-bootstrap/esm/Button';
import axios from 'axios';
import { api } from '../utils/apiConfig';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSuccess, updateCountDown } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinners from '../utils/Spinner';

function OtpVerification() {
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const { userInfo, countdown } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(new Array(6).fill(''));

  useEffect(() => {
    const handlePaste = (event) => {
      event.preventDefault();
      const pasteData = event.clipboardData?.getData('text') || '';

      let index = 0;
      const newOtp = [...otp];
      for (
        let i = 0;
        i < pasteData?.length && index < inputRefs?.current?.length;
        i++
      ) {
        inputRefs.current[index].value = pasteData[i];
        newOtp[index] = pasteData[i];
        index++;
      }
      setOtp(newOtp);

      for (let i = 0; i < inputRefs?.current?.length - 1; i++) {
        inputRefs?.current[i].addEventListener('input', () => {
          if (inputRefs?.current[i]?.value?.length === 1) {
            inputRefs?.current[i + 1].focus();
          }
        });
      }
    };

    const otpForm = document.getElementById('otpForm');
    otpForm?.addEventListener('paste', handlePaste);

    return () => {
      otpForm?.removeEventListener('paste', handlePaste);
    };
  }, []);

  const handleInputChange = (index) => (event) => {
    const value = event.target.value;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < inputRefs?.current?.length - 1) {
      inputRefs?.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index) => (event) => {
    if (event.key === 'Backspace' && !otp[index]) {
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`${api}/api/users/verification`, {
        email: userInfo?.user?.email || userInfo.email,
        otpCode: otp.join(''),
        fingerprint: userInfo?.user?.rdt,
        resetPasswordOtp: userInfo?.user.resetPasswordOtp,
      });

      dispatch(fetchSuccess(data));
      navigate('/');
      setLoading(false);
      if (data?.user?.firstname) {
        toast.success(`Welcome! ${data?.user?.firstname}`, {
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
      console.log(error);
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
     if(!userInfo?.user?.resetPasswordOtp){
      await axios.post(`${api}/api/users/resendOtp`, {
        email: userInfo?.user?.email || userInfo?.email,
        fingerprint: userInfo?.user?.rdt || userInfo?.rdt,
      });
     }else{
      await axios.post(`${api}/api/users/resetpassword`, {
        email: userInfo?.user?.email,
        fingerprint: userInfo?.user?.rdt,
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
    if (userInfo?.user?._id) {
      navigate('/');
    } else if (userInfo?.user?.urlf) {
      navigate(`/newpassword/change/${userInfo?.user?.urlf}/change`);
    } else {
    }
  });

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
            <div className="d-flex flex-column text-center ">
              <strong className="fs-3 fw-bold">{userInfo?.user?.resetPasswordOtp  ? 'Email verification': 'Verify this device' }</strong>
              <span>
               {userInfo?.user?.resetPasswordOtp ? `For us to know that you are the owner of this account, `:''} <br /> A verification code has been sent to{' '}
                <strong>{`${'*'.repeat(
                  userInfo?.user?.email?.length - 13
                )}${userInfo?.user?.email?.slice(-13)}`}</strong>
              </span>
              <form
                id="otpForm"
                className="d-flex gap-2 my-4 justify-content-center align-items-center "
                onSubmit={handleVerification}
              >
                {[...Array(6)].map((_, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    className="otpInput border-success fw-bold text-center"
                    maxLength="1"
                    size="1"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onChange={handleInputChange(index)}
                    onKeyDown={handleKeyDown(index)}
                    value={otp[index]}
                  />
                ))}
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
                  disabled={otp.includes('')}
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
