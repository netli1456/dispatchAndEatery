import React, { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import AddIcon from '@mui/icons-material/Add';
import Container from 'react-bootstrap/Container';

import CartCard from './CartCard';
import Footer from '../footerSection/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Shipping from '../shipping/Shipping';
import ShippingDetails from '../shipping/ShippingDetails';
import { toast } from 'react-toastify';
import { clearCart } from '../redux/cartSlice';
import { api, useFingerprint } from '../utils/apiConfig';
import Recommended from '../recommended/Recommended';
import Spinners from '../utils/Spinner';
import PayButton from '../component/PayButton';

function Cart() {
  const { cartItems } = useSelector((state) => state.cart);
  const { shipping } = useSelector((state) => state.shippingAddress);
  const [shipOpen, setShipOpen] = useState(false);
  const cartItemTotal = cartItems?.reduce(
    (a, c) => a + c.price * c.quantity,
    0
  );
  const shippingFee = cartItemTotal > 5000 ? 1200 : 1500;
  const total = shippingFee + cartItemTotal;
  const { userInfo } = useSelector((state) => state.user);
  const businessId = cartItems[0]?.userId;
  const navigate = useNavigate();
  const [order, setOrder] = useState({});
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const product = cartItems[0];
  const fingerprint = useFingerprint();

  const handleOrder = async () => {
    setLoading(true);
    try {
      if (userInfo?.user?._id) {
        const { data } = await axios.post(
          `${api}/api/orders/${fingerprint}/${userInfo?.user?._id}/${businessId}`,
          {
            orderedItems: cartItems,
            shippingAddress: shipping,
            total: total,
            subtotal: cartItemTotal,
            shippingFee: shippingFee,
          }
        );
        setOrder(data);
        dispatch(clearCart());
        toast.success('order completed successfully');
        setLoading(false);
      } else {
        navigate('/signin');
      }
    } catch (error) {
      if (
        error.response.data.message === 'sorry! you can not buy from yourself'
      ) {
        toast.error(error.response.data.message, {
          autoClose: false,
          theme: 'colored',
          toastId: 'unique-toast-id',
        });
      } else if (error.response.data.message === 'Insufficient funds') {
        toast.error(error.response.data.message, {
          autoClose: false,
          theme: 'colored',
          toastId: 'unique-toast-id',
        });
      } else if (error.response.data.message === 'something went wrong') {
        toast.error(error.response.data.message, {
          autoClose: false,
          theme: 'colored',
          toastId: 'unique-toast-id',
        });
      } else {
        toast.error(
          'please fill the shipping address',
          error.response.data.message,
          {
            autoClose: false,
            theme: 'colored',
            toastId: 'unique-toast-id',
          }
        );
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (order._id) {
      navigate(`/order/${order?._id}`);
    }
  }, [navigate, order._id]);

  useEffect(() => {
    if (shipOpen === true) {
      window.document.body.style.overflowY = 'hidden';
      window.document.body.style.height = '100vh';
    } else {
      window.document.body.style.overflow = 'scroll';
      window.document.body.style.height = 'scroll';
    }
  }, [shipOpen]);

  return (
    <div>
      <Row className="m-3 ">
        <Card>
          <Card.Body>
            {cartItems?.length === 0 ? (
              <div
                className="d-flex justify-content-center align-items-center "
                style={{ height: '200px' }}
              >
                <h3>
                  Cart is empty{' '}
                  <Link to="/search" style={{ fontSize: '16px' }}>
                    Click here to see available kitchens
                  </Link>
                </h3>
              </div>
            ) : (
              <>
                <h5 className="text-center d-none d-md-flex justify-content-center">
                  You have ({cartItems?.length}) items in your cart
                </h5>
                <h5 className="text-center d-md-none">
                  Cart ({cartItems?.length})items{' '}
                </h5>
                <div className="d-flex flex-column  gap-1">
                  <div>
                    <strong className="border-bottom border-grey">
                      Total: {`N${total?.toFixed(2)}`}
                    </strong>
                  </div>
                  <div
                    className="d-flex align-items-center"
                    style={{ width: '100%' }}
                  >
                    {' '}
                    <Button
                      style={{ width: 'fit-content' }}
                      variant="light"
                      className="text-success"
                    >
                      <AddIcon />
                      Add payment method
                    </Button>{' '}
                  </div>
                  {shipping.name && <ShippingDetails shipping={shipping} />}
                  <div
                    className="d-flex align-items-center"
                    style={{ width: '100%' }}
                  >
                    <Button
                      style={{ width: 'fit-content' }}
                      variant="light"
                      className="text-success"
                      onClick={() => setShipOpen(true)}
                    >
                      {<AddIcon />}
                      {shipping.name ? 'Edit Shipping' : 'Add Shipping'}
                    </Button>{' '}
                  </div>
                </div>
              </>
            )}
          </Card.Body>
        </Card>
      </Row>
      {cartItems?.length > 0 && (
        <Container>
          <Row>
            <Col md={6}>
              <div>
                <CartCard />
              </div>
            </Col>
            <Col md={6}>
              <div style={{ width: '80%', margin: 'auto' }}>
                <Card className="border-">
                  <Card.Body>
                    <div className="d-flex flex-column gap-1">
                      <div>
                        <strong className="border-bottom border-grey">
                          SubTotal({cartItems?.length} items):{' '}
                          {`N${cartItems
                            .reduce((a, c) => a + c.price * c.quantity, 0)
                            .toFixed(2)}`}
                        </strong>
                      </div>
                      <div>
                        {' '}
                        <Button
                          style={{ width: 'fit-content' }}
                          variant="lighter"
                          className=" fw-bold"
                        >
                          Delivery Fee :{' '}
                          {cartItems.reduce(
                            (a, c) => a + c.price * c.quantity,
                            0
                          ) > 5000
                            ? `N1200.00`
                            : `N1500.00`}
                        </Button>{' '}
                      </div>
                      <div>
                        <Button
                          style={{ width: 'fit-content' }}
                          variant="lighter"
                          className=" border-bottom border-grey  fw-bold"
                        >
                          Total Amount :{`N${total.toFixed(2)}`}
                        </Button>{' '}
                        <div
                          className="d-grid"
                          style={{ position: 'relative' }}
                        >
                          <Button
                            style={{ width: '100%' }}
                            variant={!userInfo?.user?._id || !shipping?.name ? 'success' : 'light'}
                            className=" border-bottom border-grey fs-5  fw-bold"
                            onClick={handleOrder}
                          >
                            {!userInfo?.user?._id || !shipping.name ?  (
                              'Pay Now'
                            ) : (
                              <PayButton                                 
                                amount={total}
                                email={'freshout1456@gmail.com'}
                              />
                            )}
                          </Button>{' '}
                          {loading && (
                            <div
                              style={{
                                position: 'absolute',
                                top: 2,
                                left: '45%',
                              }}
                            >
                              {' '}
                              <Spinners />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      )}
      <div className="mb-3">
        <Recommended product={product} />
      </div>
      <Footer />
      {shipOpen && (
        <div className="ship">
          <Shipping shipOpen={shipOpen} setShipOpen={setShipOpen} />
        </div>
      )}
    </div>
  );
}

export default Cart;
