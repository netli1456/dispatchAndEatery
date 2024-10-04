import React, { useEffect, useState } from 'react';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import './order.css';
import OrderDetails from './OrderDetails';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Rating from '../component/Rating';
import { api, useFingerprint } from '../utils/apiConfig';
import { Box, Skeleton } from '@mui/material';
import Error from '../utils/Error';
import LoadingBox from '../LoadingBox';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import PayButton from '../component/PayButton';

function Order() {
  const params = useParams();
  const { id } = params;
  const [data, setData] = useState({});
  const { userInfo } = useSelector((state) => state.user);
  const [smallScreen, setSmallScreen] = useState(false);
  const [cancelWarning, setCancelWarning] = useState(false);
  const [loading, setLoading] = useState('page' || false);
  const [error, setError] = useState(false);
  const { shipping } = useSelector((state) => state.shippingAddress);

  const navigate = useNavigate();
  const fingerprint = useFingerprint();

  useEffect(() => {
    const handleOrder = async () => {
      if (fingerprint) {
        try {
          setLoading(true);
          setError(false);
          const { data } = await axios.get(
            `${api}/api/orders/${fingerprint}/find/${id}/${userInfo?.user?._id}`
          );
          setData(data);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          setError(true);
        }
      }
    };
    handleOrder();
  }, [id, userInfo.user?._id, fingerprint]);

  const takeOrder = async (businessId, orderId) => {
    try {
      const res = await axios.put(
        `${api}/api/orders/${fingerprint}/takeorder/${businessId}/${orderId}`
      );
      const isTaken = res?.data;
      setData((prevData) => ({
        ...prevData,
        details: {
          ...prevData.details,
          isTaken: isTaken,
        },
      }));
    } catch (error) {
      toast.error(error?.response?.data?.message, {
        autoClose: 5000,
        theme: 'colored',
        toastId: 'unique-toast-id',
      });
    }
  };

  useEffect(() => {
    const smallSize = () => {
      setSmallScreen(window.innerWidth < 1200);
    };
    smallSize();
    window.addEventListener('resize', smallSize);

    return () => {
      window.removeEventListener('resize', smallSize);
    };
  }, []);

  const items = (data) => {
    return data?.products?.map((item, index) => (
      <span key={index} className="font1 ">
        {item.category === 'food'
          ? `${item.quantity} plate  of ${item.name},`
          : item.category === 'meat '
          ? ` ${item.quantity} pieces of ${item.name},`
          : `${item.quantity} pieces of ${item.name},
                                `}
      </span>
    ));
  };

  useEffect(() => {
    if (!userInfo?.user?._id) {
      navigate('/signin');
    }
  }, [userInfo?.user?._id, navigate]);

  const refundAndCancelOrder = async (orderId) => {
    try {
      const { data } = await axios.put(
        `${api}/api/orders/${fingerprint}/refund/${userInfo?.user?._id}/${orderId}`
      );

      setData((prevData) => ({
        ...prevData,
        details: { ...prevData.details, isCancelled: data },
      }));
    } catch (error) {
      toast.error(error?.response?.data?.message, {
        autoClose: 5000,
        theme: 'colored',
        toastId: 'unique-toast-id',
      });
    }
  };

  useEffect(() => {
    if (
      shipping?.reference !== '' &&
      shipping?.reference !== undefined &&
      shipping?.reference !== null
    ) {
      verifyPayment(shipping?.reference);
    }
  }, [shipping]);


  const orderId = data?.details?._id;

  const verifyPayment = async (reference) => {
    try {
      const { data } = await axios.post(`${api}/api/pay`, { reference });

      if (data.success === true) {
        const { data } = await axios.post(`${api}/api/orders/pay`, {
          reference,
          orderId: orderId,
        });
        setData((prevData) => ({
          ...prevData,
          details: {
            ...prevData.details,
            isPaid: data?.isPaid,
            isPaidAt: data?.isPaidAt,
          },
        }));
      } else {
        toast.error('error making payment');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {loading ? (
        <div style={{ height: '70vh', maxHeight: '70vh', overflow: 'hidden' }}>
          <LoadingBox />
        </div>
      ) : error === true ? (
        <Error />
      ) : (
        <>
          {data?.products?.length > 0 && (
            <>
              <Container className="my-3">
                <div>
                  <div className="fw-bold fs-5 text-center text-success">
                    Order Details({data && data?.products?.length} items)
                  </div>
                  <div className="d-flex  p-3 border   justify-content-between ">
                    {loading ? (
                      <Box sx={{ pt: 0.5 }}>
                        <Skeleton />
                        <Skeleton />
                        <Skeleton width="60%" />
                        <Skeleton width="80vw" />
                        <Skeleton width={'60%'} height={200} />
                      </Box>
                    ) : (
                      <div className="d-flex flex-column ">
                        <div>
                          <h3 className="d-none d-md-flex">
                            Order ID: {data?.details?._id}
                          </h3>
                          <h6 className="d-md-none">
                            Order ID: {data?.details?._id}
                          </h6>
                        </div>
                        <div className="d-flex flex-wrap  flex-column text-capitalize">
                          <div className="d-flex flex-wrap  gap-2">
                            <strong>Name: </strong>
                            <span className="font">
                              {data?.details?.shippingAddress?.name}
                            </span>
                          </div>
                          <div className="d-flex  gap-2">
                            <strong>phone number: </strong>
                            <span className="font">
                              {data?.details?.shippingAddress?.phoneNumber}
                            </span>
                          </div>
                          <div className="d-flex flex-wrap  gap-1">
                            <strong>Address:</strong>
                            <div>
                              {' '}
                              <span className="font">
                                {data?.details?.shippingAddress?.street}{' '}
                                {data?.details?.shippingAddress?.localGvt},{' '}
                                {data?.details?.shippingAddress?.state}{' '}
                                {data?.details?.shippingAddress?.country}
                              </span>
                            </div>
                          </div>
                        </div>
                        {data?.products &&
                          data?.products[0]?.businessId !== false &&
                          data?.details?.isCancelled === false && (
                            <>
                              {data?.details && !data?.details?.isTaken ? (
                                <div>
                                  {!cancelWarning && (
                                    <div className="d-flex align-items-center mt-2 gap-3">
                                      <Button
                                        variant="success"
                                        className="fw-bold d-flex align-items-center"
                                        onClick={() =>
                                          takeOrder(
                                            data?.details?.businessId,
                                            data?.details?._id
                                          )
                                        }
                                      >
                                        Accept
                                      </Button>
                                      <Button
                                        variant="danger"
                                        className="fw-bold d-flex align-items-center"
                                        onClick={() => setCancelWarning(true)}
                                      >
                                        Refund & Cancel
                                      </Button>
                                    </div>
                                  )}
                                  {cancelWarning && (
                                    <div
                                      className="d-flex p-2 align-items-center flex-column my-2 border rounded errors"
                                      style={{ width: 'fit-content' }}
                                    >
                                      <span className="text-white fw-bold">
                                        Are you sure you want cancel this order
                                        now?
                                      </span>
                                      <div className="d-flex align-items-center mt-2 gap-3">
                                        <Button
                                          variant="light"
                                          className="fw-bold d-flex align-items-center border border-danger"
                                          onClick={() =>
                                            setCancelWarning(false)
                                          }
                                        >
                                          No
                                        </Button>
                                        <Button
                                          variant="success"
                                          className="fw-bold d-flex align-items-center"
                                          onClick={() =>
                                            refundAndCancelOrder(
                                              data?.details?._id
                                            )
                                          }
                                        >
                                          Yes
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <>
                                  {userInfo?.user?._id !==
                                    data?.details?.buyerId && (
                                    <div className="font1bg my-3 p-2 border border-rounded">
                                      

                                      {data?.details?.isPaid && (
                                        <div className="d-flex justify-content-between">
                                          {' '}
                                          <span className="d-flex text-white fw-bold fs-4 align-items-center gap-1">
                                            <DoneAllIcon />
                                            Paid
                                          </span>{' '}
                                          <div className="d-flex flex-column mt-2 text-white">
                                            <span>
                                              Date{' '}
                                              {data?.details?.isPaidAt.slice(
                                                0,
                                                10
                                              )}
                                            </span>
                                            <span>
                                              Time{' '}
                                              {data?.details?.isPaidAt.slice(
                                                11,
                                                16
                                              )}
                                            </span>
                                          </div>
                                        </div>
                                      )}

                                      <span>
                                        Note: this order has been comfirmed, for
                                        futher enquiries or help, kindly report
                                        below{' '}
                                      </span>

                                      <Button
                                        variant="white"
                                        className="fw-bold text-danger border-danger mt-1 d-flex align-items-center"
                                      >
                                        Report/dispute
                                      </Button>
                                    </div>
                                  )}
                                </>
                              )}
                            </>
                          )}

                        {data?.details &&
                          data?.details?.isCancelled === false &&
                          data?.details?.buyerId === userInfo?.user?._id && (
                            <div className="font1bg my-3 p-2 border border-rounded">
                              <div
                                className={
                                  data?.details?.isPaid
                                    ? 'p-2 rounded  paid '
                                    : 'p-2 rounded  bg-danger '
                                }
                              >
                                {data?.details?.isPaid ? (
                                  <div className="d-flex justify-content-between">
                                    {' '}
                                    <span className="d-flex text-white fw-bold fs-4 align-items-center gap-1">
                                      <DoneAllIcon />
                                      Paid
                                    </span>{' '}
                                    <div className="d-flex flex-column mt-2 text-white">
                                      <span>
                                        Date{' '}
                                        {data?.details?.isPaidAt.slice(0, 10)}
                                      </span>
                                      <span>
                                        Time{' '}
                                        {data?.details?.isPaidAt.slice(11, 16)}
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="d-flex align-items-center justify-content-center gap-3 text-white ">
                                    <span className=" fw-bold fs-5">
                                      Not paid
                                    </span>
                                    <PayButton
                                      amount={data?.details?.total}
                                      email={'freshout1456@gmail.com'}
                                    />
                                  </div>
                                )}
                              </div>
                              <span>
                                Note: this order has been comfirmed, for futher
                                enquiries or help, kindly report below{' '}
                              </span>
                              <Button
                                variant="white"
                                className="fw-bold text-danger border-danger mt-1 d-flex align-items-center"
                              >
                                Report/dispute
                              </Button>
                              <div className="d-flex flex-column mt-2">
                                <span>
                                  Date {data?.details?.createdAt.slice(0, 10)}
                                </span>
                                <span>
                                  Time {data?.details?.createdAt.slice(11, 16)}
                                </span>
                              </div>
                            </div>
                          )}

                        {data?.details && data?.details?.isCancelled && (
                          <div className="bg-danger text-white my-3 p-2 border rounded">
                            {data?.details?.businessId ===
                            userInfo?.user?._id ? (
                              <strong>
                                Note: you cancelled this order and payment has
                                been refunded to the customer
                              </strong>
                            ) : (
                              <strong>
                                Your order was cancelled and your balance
                                refunded
                              </strong>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    <div>
                      <Button
                        onClick={() => navigate(`/profile/${userInfo._id}`)}
                        variant="success"
                        className="bg-success text-white fw-bold"
                      >
                        All Orders
                      </Button>
                    </div>
                  </div>
                  <div>
                    <div className="fs-4 fw-bold text-center my-3">
                      {loading ? <Skeleton /> : 'Items'}
                    </div>
                    <Row>
                      <Col md={8} className="mb-3">
                        <OrderDetails
                          loading={loading}
                          data={data}
                          smallScreen={smallScreen}
                        />
                      </Col>
                      <Col md={4}>
                        <ListGroup>
                          {loading ? (
                            <div>
                              {' '}
                              <Skeleton />
                              <Skeleton />
                              <Skeleton />
                              <Skeleton />
                            </div>
                          ) : (
                            <div>
                              <strong>Total:N{data?.details?.total}</strong>
                              <ListGroup.Item className="font1bg">
                                {items(data)}
                              </ListGroup.Item>
                              <ListGroup.Item className="font1bg">
                                <div className="d-grid">
                                  <Button variant="light">
                                    {userInfo?.user?._id ===
                                    data?.details?.buyerId ? (
                                      <div>
                                        <div className="d-flex  flex-column text-start">
                                          <span className="fw-bold">
                                            {' '}
                                            Business Details
                                          </span>
                                          <span>
                                            Name: {data?.details?.businessName}
                                          </span>
                                          <span>
                                            Reputation:{' '}
                                            <Rating product={data?.details} />{' '}
                                          </span>
                                          <Link
                                            className="fw-bold"
                                            to={`/kitchen/${data?.details?.businessId}`}
                                          >
                                            check store{' '}
                                          </Link>
                                        </div>
                                      </div>
                                    ) : (
                                      <div>
                                        <span className="d-flex flex-column text-start">
                                          Customer Details:
                                          <span>
                                            Name: {data?.details?.buyerName}
                                          </span>
                                          <span>Reputation: Average</span>
                                          <span>
                                            Id: {data?.details?.buyerId}
                                          </span>
                                        </span>
                                      </div>
                                    )}
                                  </Button>
                                </div>
                              </ListGroup.Item>
                            </div>
                          )}
                        </ListGroup>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Container>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Order;
