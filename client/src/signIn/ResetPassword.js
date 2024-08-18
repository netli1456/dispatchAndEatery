import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Link } from 'react-router-dom';
import Footer from '../footerSection/Footer';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Spinners from '../utils/Spinner';
import UserFrame from '../component/UserFrame';
import { useSelector } from 'react-redux';

function ResetPassword(props) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const { userInfo } = useSelector((state) => state.user);
  const { setEmail, handleResetPassword, setPassword, isPassword, loading } =
    props;
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 760);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  return (
    <Row
      style={{
        backgroundColor: isSmallScreen ? 'lightgrey' : '',
        width: '100%',
        margin: 'auto',
      }}
    >
      <Col
        md={12}
        className="d-flex flex-column align-items-center justify-content-center"
        style={{ height: '80vh', width: '100%', overflowX: 'hidden' }}
      >
        <div
          className="p-5  text-success"
          style={{
            minWidth: !isSmallScreen ? '450px' : '',
            backgroundColor: 'lightgrey',
            position: 'relative',
          }}
        >
          <h3 className="fw-bold ">
            {isPassword ? 'Change your password' : 'Find your account'}
          </h3>
          <p>
            {isPassword ? 'Enter a new password' : 'Enter your email address'}
          </p>
          {isPassword && (
            <div className="mb-2">
              {' '}
              <UserFrame
                name={userInfo?.user?.name}
                img={userInfo?.user?.img}
              />{' '}
            </div>
          )}

          <Form onSubmit={handleResetPassword}>
            <InputGroup>
              <Form.Control
                onChange={(e) =>
                  !isPassword
                    ? setEmail(e.target.value)
                    : setPassword(e.target.value)
                }
                type="text"
                placeholder={`${isPassword ? 'New Password*' : 'Email*'}`}
                required
              />
            </InputGroup>
            <p className="my-3 text-black">
              You may receive Email notifications from us <br /> for security
              and login purposes.
            </p>
            <div className=" text-center pt-3" style={{ position: 'relative' }}>
              {' '}
              <Button
                type="submit"
                className="bg-white px-4 fw-bold text-center text-success border "
              >
                Continue
              </Button>
              {loading && (
                <div style={{ position: 'absolute', top: 19, left: '45%' }}>
                  {' '}
                  <Spinners newColor={true} />
                </div>
              )}
            </div>
          </Form>
          <Link
            to="/signin"
            className="fw-bold text-success "
            style={{ position: 'absolute', top: 5, left: 10 }}
          >
            <ArrowBackIosNewIcon />
          </Link>
        </div>
      </Col>
      <Footer />
    </Row>
  );
}

export default ResetPassword;
