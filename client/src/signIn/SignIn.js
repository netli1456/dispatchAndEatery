import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../footerSection/Footer';
import axios from 'axios';
import HttpsIcon from '@mui/icons-material/Https';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSuccess, updateCountDown } from '../redux/userSlice';

import { toast } from 'react-toastify';
import { api } from '../utils/apiConfig';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Spinners from '../utils/Spinner';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [data, setData] = useState({});

  axios.defaults.withCredentials = true;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fp = await FingerprintJS.load();

    const result = await fp.get();
    const fingerprint = result.visitorId;
    try {
      const { data } = await axios.post(`${api}/api/users/signin`, {
        email: email,
        password: password,
        fingerprint: fingerprint,
      });
      dispatch(fetchSuccess(data));

      if (data.user.firstname) {
        toast.success(`Signed in as ${data?.user?.firstname}`, {
          autoClose: true,
          theme: 'light',
          toastId: 'unique-toast-id',
        });
      }else{toast.error("comfirm your email", {
        autoClose: true,
        theme: 'dark',
        toastId: 'unique-toast-id',
      });}

      setLoading(false);

      setData(data);
      dispatch(updateCountDown(60));
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
    if (userInfo?.user?._id) {
      navigate('/');
    }
  });

  useEffect(() => {
    if (data?.user?.url) {
      navigate(`/verification/${data?.user?.url}/auth`);
    }
  }, [data, navigate]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1200);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  return (
    <div>
      <div
        style={{
          backgroundColor: 'lightgrey',
          overflowX: 'hidden',
          position: 'relative',
          height: '750px',
        }}
      >
        <img
          src="/mbite.jpeg"
          alt=""
          style={{
            width: '100%',
            opacity: '0.1',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <div style={{ position: 'absolute', left: 0, width: '100vw', top: 20 }}>
          <Row>
            <Col
              md={6}
              className="d-flex mb-3  justify-content-center  flex-column align-items-center"
            >
              <div
                className="bg-light p-3 border rounded-3 d-flex flex-column align-items-center"
                style={{ width: '100%' }}
              >
                <h3>Join M-Bite global market today</h3>
                <p>
                  {' '}
                  We are one of the fastest growing online market <br /> you can
                  buy and sell your products.
                  <br /> create a store today in a reliable enviroment to sell
                  your products{' '}
                </p>
              </div>
            </Col>
            <Col md={6}>
              <div
                className="d-flex  justify-content-center  flex-column align-items-center m-auto"
                style={{ width: '95%' }}
              >
                <Button
                  variant="success"
                  className="bg-success opacity-75 p-1"
                  style={{ borderRadius: '50%' }}
                >
                  <HttpsIcon />
                </Button>
                <strong className="mb-2">Sign In</strong>
                <div
                  className="bg-light p-3 border d-flex flex-column justify-content-center rounded-4"
                  style={{
                    height: '50vh',
                    minWidth: !isSmallScreen ? ' 60%' : '100%',
                  }}
                >
                  <Form onSubmit={handleLogin}>
                    <div>
                      <strong>Email *</strong>
                      <InputGroup className="   ">
                        <Form.Control
                          className=" "
                          type="text"
                          required
                          placeholder="write here"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </InputGroup>
                    </div>
                    <div className="my-3   ">
                      <strong>Password *</strong>
                      <InputGroup>
                        <Form.Control
                          className=" "
                          type="password"
                          required
                          placeholder="write here"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </InputGroup>
                    </div>

                    <div
                      className="d-grid my-3 fw-bold"
                      style={{ position: 'relative' }}
                    >
                      <Button
                        variant="success"
                        className="bg-success fw-bold border rounded-5"
                        type="submit"
                      >
                        Login
                      </Button>
                      {loading && (
                        <div
                          style={{ position: 'absolute', top: 2, left: '45%' }}
                        >
                          {' '}
                          <Spinners />
                        </div>
                      )}
                    </div>
                    <Link to="/recover/account">forgot password</Link>
                  </Form>
                </div>
                <div className="my-3">
                  <strong>
                    {' '}
                    New customer ? <Link to="/signup"> sign up here</Link>
                  </strong>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SignIn;
