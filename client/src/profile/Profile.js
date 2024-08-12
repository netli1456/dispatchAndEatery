import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';

import SearchBar from '../component/SearchBar';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import './profile.css';
import Footer from '../footerSection/Footer';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearUserInfo, fetchSuccess } from '../redux/userSlice';
import { toast } from 'react-toastify';
import ProfileHeader from './ProfileHeader';
import { api } from '../utils/apiConfig';
import { Box, Skeleton } from '@mui/material';
import Button from 'react-bootstrap/esm/Button';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import DoNotDisturbOffIcon from '@mui/icons-material/DoNotDisturbOff';

const Profile = () => {
  const [data, setData] = useState([]);

  const { userInfo } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [openWallet, setOpenWallet] = useState(false);
  const [open, setOpen] = useState(false);
  const [arl, Setarl] = useState(false);
  const dispatch = useDispatch();
  const [counts, setCounts] = useState({});
  const [error, setError] = useState('');

  const [loading, setLoading] = useState('page' || false);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const query = sp.get('query') || 'pending';

  const handleQuery = (que) => {
    navigate(`/profile/${userInfo?.user?._id}?query=${que}`);
  };

  useEffect(() => {
    if (!userInfo.user?._id) {
      navigate(`/signin`);
    }
  });

  useEffect(() => {
    const handleOrder = async () => {
      setLoading('page');
      const fp = await FingerprintJS.load();

      const result = await fp.get();
      const fingerprint = result.visitorId;
      try {
        const { data } = await axios.get(
          `${api}/api/orders/${fingerprint}/allorders/${userInfo?.user?._id}?query=${query}`
        );
        setData(data);
        setLoading(false);
        setCounts(data?.counts);
      } catch (error) {
        toast.error(error?.response?.data?.message, {
          toastId: 'unique_toast_id',
        });
        setError(error?.response?.data?.message);
        setLoading(false);
      }
    };
    handleOrder();
  }, [userInfo?.user?._id, query, navigate]);

  const handleWalletDetails = async () => {
    setLoading('walletDetails');
    try {
      const { data } = await axios.get(
        `${api}/api/users/account/find/${userInfo?.user?._id}`
      );
      Setarl(data);
      setLoading(false);
      setOpenWallet(true);
    } catch (error) {
      toast.error('something went wrong');
      setLoading(false);
    }
  };

  const handleCreateWallet = async () => {
    try {
      setLoading('createWallet');
      const { data } = await axios.post(
        `${api}/api/payment/create/${userInfo?.user?._id}`
      );

      Setarl(data);
      setOpenWallet(true);
      setOpen(false);

      dispatch(
        fetchSuccess({ ...userInfo, user: { ...userInfo.user, wallet: true } })
      );
      setLoading(false);
    } catch (error) {
      toast.error('something went wrong', { toastId: 'unique-toast-id' });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      dispatch(clearUserInfo());

      navigate('/signin');
    }
  }, [navigate, dispatch, error]);

  const itemDelivered = (item) => {};

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      <Container>
        <ProfileHeader
          userInfo={userInfo}
          open={open}
          balance={data?.bal}
          handleWalletDetails={handleWalletDetails}
          setOpen={setOpen}
          handleCreateWallet={handleCreateWallet}
          openWallet={openWallet}
          setOpenWallet={setOpenWallet}
          arl={arl}
          loading={loading}
        />

        <SearchBar />
        <div className="my-3 ">
          <div className="text-center p-3 flex-wrap d-flex align-items-center justify-content-between mb-3 border-bottom border-grey">
            {' '}
            <Button
              variant="light"
              onClick={() => handleQuery('pending')}
              className={
                query === 'pending'
                  ? 'text-danger fw-bold  border-bottom'
                  : 'text-success  '
              }
            >
              Pending(
              {counts.pending > 0 ? counts?.pending : 0})
            </Button>
            <Button
              variant="light"
              onClick={() => handleQuery('dispatched')}
              className={
                query === 'dispatched'
                  ? 'text-danger fw-bold  border-bottom'
                  : 'text-success'
              }
            >
              Dispatched(
              {counts.dispatched > 0 ? counts?.dispatched : 0})
            </Button>
            <Button
              variant="light"
              onClick={() => handleQuery('delivered')}
              className={
                query === 'delivered'
                  ? 'text-danger fw-bold  border-bottom'
                  : 'text-success  '
              }
            >
              Delivered(
              {counts?.delivered > 0 ? counts?.delivered : 0})
            </Button>
            <Button
              variant="light"
              onClick={() => handleQuery('refunded')}
              className={
                query === 'refunded'
                  ? 'text-danger fw-bold  border-bottom'
                  : 'text-success  '
              }
            >
              Refunded(
              {counts.refunded > 0 ? counts?.refunded : 0})
            </Button>
            <Button
              variant="light"
              onClick={() => handleQuery('all')}
              className={
                query === 'all'
                  ? 'text-danger fw-bold  border-bottom'
                  : 'text-success  '
              }
            >
              View All(
              {counts?.all > 0 ? counts?.all : 0})
            </Button>
          </div>
          {data?.orders?.length === 0 ? (
            <div className="text-center my-5">
              {' '}
              <strong>No {query} orders</strong>{' '}
            </div>
          ) : (
            <ResponsiveMasonry
              columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 2 }}
            >
              <Masonry gutter="20px">
                {(loading === 'page'
                  ? Array.from(new Array(2))
                  : data?.orders
                )?.map((item, index) => (
                  <div key={`${index}-${item?.productId}`}>
                    {item ? (
                      <Link
                        to={`/order/${item?._id}`}
                        className="d-flex align-items-center imageCardParent text-decoration-none  gap-2 "
                        style={{ position: 'relative' }}
                      >
                        <div className="cardImage">
                          <img
                            src={item?.imgs}
                            alt=""
                            style={{
                              objectFit: 'cover',
                              borderRadius: '10px 0px 0px 10px',
                            }}
                          />
                        </div>

                        <div className="fw-bold d-flex gap-1 flex-wrap">
                          {item?.content?.slice(0, 3).map((content, index) => (
                            <div className="text-dark" key={index}>
                              {
                                <span>
                                  {content ? (
                                    content?.category === 'food' ? (
                                      `${content?.quantity} plate of ${content?.name}, `
                                    ) : content?.category === 'meat' ? (
                                      ` ${content?.quantity} pieces of ${content?.name}, `
                                    ) : (
                                      `${content?.quantity} pieces of ${
                                        content?.name
                                      }${
                                        item?.content?.length > 3 ? '...' : ''
                                      } `
                                    )
                                  ) : (
                                    <Skeleton />
                                  )}
                                </span>
                              }
                            </div>
                          ))}
                        </div>
                        <div className="opacity-40">
                          {item?.isDelivered ? (
                            <span
                              className="text-success"
                              style={{
                                position: 'absolute',
                                top: 0,
                                right: 6,
                              }}
                            >
                              delivered <DoneAllIcon />
                            </span>
                          ) : item?.isCancelled ? (
                            <span
                              className="text-danger"
                              style={{
                                position: 'absolute',
                                top: 0,
                                right: 6,
                              }}
                            >
                              cancelled <DoNotDisturbOffIcon className="" />
                            </span>
                          ) : (
                            <img
                              src="https://wonderingfair.files.wordpress.com/2014/12/new-logo.gif"
                              alt=""
                              style={{
                                width: '40px',
                                height: '40px',
                                position: 'absolute',
                                top: 0,
                                right: 6,
                              }}
                            />
                          )}
                        </div>
                      </Link>
                    ) : (
                      <div>
                        <Skeleton width="100%" height={100} />
                        <Box sx={{ pt: 0.5 }}>
                          <Skeleton />
                          <Skeleton width="60%" />
                        </Box>
                      </div>
                    )}{' '}
                  </div>
                ))}
              </Masonry>
            </ResponsiveMasonry>
          )}
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default Profile;
