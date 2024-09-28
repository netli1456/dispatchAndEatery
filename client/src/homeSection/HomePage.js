import React, { useEffect, useState } from 'react';
import Map from '../component/Map';
import HouseOutlinedIcon from '@mui/icons-material/HouseOutlined';
import Cards from '../component/Cards';
import { Link, useLocation } from 'react-router-dom';
import './homePage.css';
import HomeFeatures from './HomeFeatures';
import Footer from '../footerSection/Footer';

import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '../utils/apiConfig';

import { Box, Skeleton } from '@mui/material';
import LetsDoItTogether from './LetsDoItTogether';
import CategoryLayout from './CategoryLayout';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { toast } from 'react-toastify';
import { clearCount } from '../redux/userSlice';
import { clearLocation } from '../redux/searchSlice';

function HomePage(props) {
  const [data, setData] = useState([]);
  const { setOpen } = props;
  const [carouselData, setCarouselData] = useState([]);
  const randomNum = Math.floor(Math.random() * 500);
  const page = 1;
  const { cartItems } = useSelector((state) => state.cart);
  const userId = cartItems?.length > 0 ? cartItems[0].userId : '';
  const [loading, setLoading] = useState(false);
  const { userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const productResponse = await axios.get(
          `${api}/api/products?query=${userId}`
        );

        setData(productResponse.data);
        setLoading(false);
      } catch (error) {
        toast.error('something went wrong', { toastId: 'unique-toast-id' });
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userResponse = await axios.get(
          `${api}/api/users/stores?page=${page}`
        );
        setLoading(false);
        setCarouselData(userResponse.data.stores);
      } catch (error) {
        setLoading(false);
        toast.error('something went wrong', { toastId: 'unique-toast-id' });
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (location.pathname !== `/verification/${userInfo?.user?.url}/auth`) {
      dispatch(clearCount());
    }
  }, [location, userInfo, dispatch]);

  const handleClear = () => {
    dispatch(clearLocation());
  };

  return (
    <div style={{ overflowX: 'hidden', backgroundColor: '' }}>
      <Map setOpen={setOpen} />

      <div className="my-5 d-flex justify-content-center">
        {' '}
        <h3 className="border-bottom border-secondary">
          We diliver to your door-step
          <HouseOutlinedIcon className="fs-1 text-success" />
        </h3>
      </div>
      {cartItems?.length > 0 && (
        <h5 className="font1bg text-danger p-2  fw-bold p-1 d-flex justify-content-center align-items-center">
          Recommended Items from the store in your cart
        </h5>
      )}
      <div>
        <ResponsiveMasonry
          columnsCountBreakPoints={{
            250: 1,
            300: 2,
            520: 3,
            815: 4,
            1000: 5,
            1200: 6,
          }}
        >
          <Masonry gutter="10px">
            {(loading ? Array.from(new Array(6)) : data).map((item, index) => (
              <Link
                to={`/kitchen/${item?.userId}`}
                key={`${index}`}
                className="bo  text-decoration-none "
                style={{
                  height: '270px',
                }}
              >
                {' '}
                {item ? (
                  <Cards loading={loading} item={item} />
                ) : (
                  <div>
                    <Skeleton
                      variant="rectangular"
                      width={'100%'}
                      height={118}
                    />
                    <Box sx={{ pt: 0.5 }}>
                      <Skeleton />
                      <Skeleton width="60%" />
                    </Box>
                  </div>
                )}
              </Link>
            ))}
          </Masonry>
        </ResponsiveMasonry>
        {data.length > 0 && (
          <div className="font1bg my-2 fw-bold py-2 d-flex justify-content-center align-items-center">
            <Link
              onClick={handleClear}
              to={`/search`}
              style={{ opacity: '0.7' }}
              variant="success"
              className="fw-bold px-4"
            >
              {' '}
              See All Stores
            </Link>
          </div>
        )}
      </div>
      <div className="text-center  my-5">
        <h1 className="pb-3">Browse our categories</h1>
        <CategoryLayout setOpen={setOpen} />
      </div>
      <div className="d-flex justify-content-center text-secondary  py-3">
        <div className="d-flex my-5 flex-column">
          <Link
            to="/search"
            className=" text-decoration-none fs-5  fw-bold text-secondary text-capitalize border-bottom border-danger"
          >
            See all available kitchens
          </Link>
          <span>
            {carouselData?.length < 50
              ? carouselData?.length + randomNum
              : carouselData}{' '}
            stores are currently online
          </span>
        </div>
      </div>
      <div className="rowParent2   ">
        <HomeFeatures loading={loading} carouselData={carouselData} />
      </div>
      <div style={{ marginTop: '120px' }}></div>
      <div className="my-5">
        <LetsDoItTogether />
      </div>

      <div className=" p-2">
        <Footer />
      </div>
    </div>
  );
}

export default HomePage;
