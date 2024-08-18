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
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import Spinners from '../utils/Spinner';
import FingerprintJS from '@fingerprintjs/fingerprintjs';


function SignUp() {
  const [surname, setSurname] = useState('');
  const [firstName, setFirstName] = useState('');
  const [comfirmPassword, setComfirmPassword] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {  countdown } = useSelector((state) => state.user);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fp = await FingerprintJS.load();
   
    const result = await fp.get();
    
    const fingerprint = result.visitorId;
    if (comfirmPassword.toString() === password.toString()) {
      try {
        const { data } = await axios.post(`${api}/api/users/register`, {
          surname: surname,
          firstname: firstName,
          password: password,
          age: age,
          country: country,
          state: state,
          email: email,
          fingerprint:fingerprint
        });
        dispatch(fetchSuccess(data));

        navigate(`/verification/${data?.user?.url}/auth`);
        setLoading(false);
        dispatch(updateCountDown(60));
        toast.error('verify your email', {
          autoClose: true,
          theme: 'dark',
          toastId: 'unique-toast-id',
        });
      } catch (error) {
        toast.error(error.response.data.message, {
          autoClose: true,
          theme: 'colored',
          toastId: 'unique-toast-id',
        });
        setLoading(false);
      }
    } else {
      toast.error('password not match', {
        autoClose: true,
        theme: 'colored',
        toastId: 'unique-toast-id',
      });
      setLoading(false);
    }
  };

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


  return (
    <div>
      <div
        style={{
          backgroundColor: 'lightgrey',
          overflowX: 'hidden',
          position: 'relative',
          height: '1200px',
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
        <div style={{ position: 'absolute', left: 0, width: '100vw', top: 10 }}>
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
                className=" d-flex  justify-content-center  flex-column align-items-center m-auto"
                style={{ width: '95%' }}
              >
                <Button
                  variant="success"
                  className="bg-success opacity-75 p-1"
                  style={{ borderRadius: '50%' }}
                >
                  <HttpsIcon />
                </Button>
                <strong className="mb-2">Sign Up</strong>
                <div
                  className=""
                  style={{ minWidth: !isSmallScreen ? ' 60%' : '100%' }}
                >
                  <Form
                    onSubmit={handleSignUp}
                    className="bg-light p-3 border rounded-4"
                  >
                    <div className="my-2">
                      <strong>First-Name *</strong>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          required
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="First name "
                        />
                      </InputGroup>
                    </div>
                    <div className="mb-2">
                      <strong>Last-Name *</strong>
                      <InputGroup className="">
                        <Form.Control
                          type="text"
                          required
                          onChange={(e) => setSurname(e.target.value)}
                          placeholder="Last name "
                        />
                      </InputGroup>
                    </div>

                    <div className="mb-2">
                      <strong>State *</strong>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          required
                          onChange={(e) => setState(e.target.value)}
                          placeholder="state "
                        />
                      </InputGroup>
                    </div>
                    <div className="mb-2">
                      <strong>Country *</strong>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          required
                          onChange={(e) => setCountry(e.target.value)}
                          placeholder="country"
                        />
                      </InputGroup>
                    </div>
                    <div className="mb-2">
                      <strong>Age *</strong>
                      <InputGroup>
                        <Form.Control
                          type="Date"
                          required
                          onChange={(e) => setAge(e.target.value)}
                        />
                      </InputGroup>
                    </div>
                    <div className="mb-2">
                      <strong>Email *</strong>
                      <InputGroup className=" ">
                        <Form.Control
                          type="email"
                          required
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email"
                        />
                      </InputGroup>
                    </div>
                    <div className="mb-2">
                      <strong>Password *</strong>
                      <InputGroup>
                        <Form.Control
                          type="password"
                          required
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Password"
                        />
                      </InputGroup>
                    </div>
                    <div className="mb-2">
                      <strong>Comfirm Password *</strong>
                      <InputGroup>
                        <Form.Control
                          type="password"
                          required
                          onChange={(e) => setComfirmPassword(e.target.value)}
                          placeholder=" Password"
                        />
                      </InputGroup>
                    </div>

                    <div
                      className="d-flex align-items-center justify-content-center my-3"
                      style={{ position: 'relative' }}
                    >
                      <Button
                        disabled={
                          !surname ||
                          !firstName ||
                          !password ||
                          !comfirmPassword ||
                          !age ||
                          !country ||
                          !state ||
                          !email
                        }
                        variant="success"
                        className="bg-success border fw-bold rounded-5 px-5"
                        type="submit"
                      >
                        Sign Up
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
                  </Form>
                </div>
                <div className="my-3">
                  <strong>
                    {' '}
                    Have an account ? <Link to="/signin"> sign in here</Link>
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

export default SignUp;
