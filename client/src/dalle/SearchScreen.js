import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/esm/Container';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import './mybite.css';
import Navbar from '../navSection/Navbar';
import Footer from '../footerSection/Footer';
import SearchedItems from './SearchedItems';
import SearchBar from '../component/SearchBar';
import axios from 'axios';
import { api } from '../utils/apiConfig';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';
import TuneIcon from '@mui/icons-material/Tune';
import TapasIcon from '@mui/icons-material/Tapas';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import NearMeIcon from '@mui/icons-material/NearMe';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import RiceBowlIcon from '@mui/icons-material/RiceBowl';
import IcecreamIcon from '@mui/icons-material/Icecream';
import SetMealIcon from '@mui/icons-material/SetMeal';
import YoutubeSearchedForIcon from '@mui/icons-material/YoutubeSearchedFor';
import { toast } from 'react-toastify';
import LoadingBox from '../LoadingBox';

function SearchScreen(props) {
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const query = sp.get('query') || '';
  const popularFilter = sp.get('popularFilter') || '';
  const rating = sp.get('rating') || '';
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const { searchedLocation } = useSelector((state) => state.searching);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { setOpenLocation } = props;

  const locationQuery = searchedLocation === undefined ? '' : searchedLocation;

  const [products, setProducts] = useState([]);
  const location = useLocation();

  const dispatch = useDispatch();

  useEffect(() => {
    if (location.pathname !== '/') {
      setLoading(true);
      const handleSearch = async () => {
        try {
          const { data } = await axios.get(
            `${api}/api/users/stores?searchedLocation=${locationQuery}&query=${query}&page=${page}&popularFilter=${popularFilter}&rating=${rating}`
          );
          setProducts(data);
          setLoading(false);
        } catch (error) {
          toast.error('something went wrong, try again later', {
            autoClose: 3000,
            theme: 'colored',
            toastId: 'unique-toast-id',
          });
          setLoading(false);
        }
      };
      handleSearch();
    }
  }, [query, page, location, dispatch, popularFilter, locationQuery, rating]);

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

  const handleFilter = (filterData) => {
    if (filterData !== 'Near me') {
      navigate(
        `/search?searchedLocation=${locationQuery}&popularFilter=${filterData}`
      );
    } else {
      if (searchedLocation) {
        navigate(`/search?&searchedLocation=${searchedLocation}`);
      } else {
        setOpenLocation(true);
      }
    }
  };
  // const handleFilters = async () => {
  //   // navigate(`/search?searchedLocation=${locationQuery}&&rating=${rate}`);
  //   const { data } = await axios.post(`${api}/api/users/m`);
  // };

  return (
    <div>
      <div
        className=""
        style={{ position: 'sticky', width: '100%', top: 50, zIndex: 8 }}
      >
        {' '}
        <SearchBar />
      </div>
      {loading ? (
        <div
          style={{
            height: loading ? '50vh' : '',
            overflow: loading ? 'hidden' : '',
          }}
        >
          {' '}
          <LoadingBox />
        </div>
      ) : (
        <Container className="mb-5">
          <Row className="my-3">
            <Col
              md={isSmallScreen ? 12 : 3}
              className={isSmallScreen ? 'mb-3 ' : 'scrollable-column'}
            >
              <ListGroup
                variant="flush"
                className={isSmallScreen ? 'border-bottom' : ''}
              >
                <ListGroup.Item className={!isSmallScreen ? 'mb-3 ' : 'd-none'}>
                  <strong>Sort by:</strong>
                </ListGroup.Item>
                <ListGroup.Item 
                  onClick={() => handleFilter('Near me')}
                  className={!isSmallScreen ? 'mb-3 hovering ' : 'd-none'}
                >
                  <span className="d-flex align-items-center gap-3">
                    <NearMeIcon className="text-success" />
                    Near me
                  </span>
                </ListGroup.Item>
                <ListGroup.Item
                  className={!isSmallScreen ? 'mb-3 hovering' : 'd-none'}
                >
                  {' '}
                  <span className="d-flex align-items-center gap-3">
                    <ThumbUpIcon className="text-success" />
                    Rating
                  </span>
                </ListGroup.Item>

                <div className={!isSmallScreen ? 'my-5 ' : 'my-2'}>
                  <strong className={!isSmallScreen ? ' ' : 'd-none'}>
                    Popular filters
                  </strong>

                  <div
                    style={{
                      width: isSmallScreen ? '90%' : '',
                      margin: isSmallScreen ? 'auto' : '',
                    }}
                    className={
                      !isSmallScreen
                        ? 'd-flex flex-column gap-3 mt-3'
                        : 'd-flex fw-bold align-items-center justify-content-between my-2'
                    }
                  >
                    <div
                      className={`${
                        !isSmallScreen
                          ? 'd-none'
                          : 'd-flex flex-column p-1 align-items-center justify-content-center p-1 hovering p-2'
                      } ${popularFilter === '' ? 'active' : ''}`}
                      style={{
                        borderRadius: isSmallScreen ? '50%' : '',
                        height: isSmallScreen ? '50px ' : '',
                        width: isSmallScreen ? '50px' : '',
                      }}
                      onClick={() => handleFilter('')}
                    >
                      <span>
                        <TuneIcon className="text-success" />
                      </span>
                      <span>Filter</span>
                    </div>
                    <div
                      className={`${
                        !isSmallScreen
                          ? 'd-flex align-items-center  gap-3 hovering'
                          : 'd-flex flex-column  align-items-center justify-content-center hovering '
                      } ${popularFilter === 'swallow' ? 'active' : ''}`}
                      style={{
                        borderRadius: isSmallScreen ? '50%' : '',
                        height: isSmallScreen ? '55px ' : '',
                        width: isSmallScreen ? '55px' : '',
                      }}
                      onClick={() => handleFilter('swallow')}
                    >
                      <span className="text-success">
                        <TapasIcon />
                      </span>
                      <span>swallow</span>
                    </div>
                    <div
                      className={`${
                        !isSmallScreen
                          ? 'd-flex align-items-center p-1 gap-2 hovering'
                          : 'd-flex p-1 flex-column align-items-center justify-content-center hovering'
                      }  ${popularFilter === 'water' ? 'active' : ''}`}
                      style={{
                        borderRadius: isSmallScreen ? '50%' : '',
                        height: isSmallScreen ? '55px ' : '',
                        width: isSmallScreen ? '55px' : '',
                      }}
                      onClick={() => handleFilter('water')}
                    >
                      <span className="text-success">
                        <DinnerDiningIcon />
                      </span>
                      <span>water</span>
                    </div>

                    <div
                      className={`${
                        !isSmallScreen
                          ? 'd-flex align-items-center gap-2 hovering'
                          : 'd-flex flex-column align-items-center justify-content-center hovering p-2  rounded'
                      } ${popularFilter === 'local foods' ? 'active' : ''}`}
                      onClick={() => handleFilter('local foods')}
                    >
                      <span className="text-success">
                        <LocalDiningIcon />
                      </span>
                      <span>local food</span>
                    </div>
                  </div>
                </div>
              </ListGroup>

              <div className={!isSmallScreen ? 'mb-3 ' : 'd-none'}>
                <strong className="">More filters</strong>
                <ListGroup variant="flush" className="mt-3">
                  <ListGroup.Item
                    onClick={() => handleFilter('desert')}
                    className={popularFilter === 'desert' ? 'active "d-flex align-items gap-3 hovering "' : '"d-flex align-items gap-3 hovering "'}
                  >
                    <RiceBowlIcon className="text-success" /> Desert
                  </ListGroup.Item>
                  <ListGroup.Item
                    onClick={() => handleFilter('ice cream')}
                    className={popularFilter === 'ice cream' ? 'active d-flex align-items gap-3 hovering ' : 'd-flex align-items gap-3 hovering '}
                  >
                    <IcecreamIcon className="text-success" />
                    Ice cream
                  </ListGroup.Item>
                  <ListGroup.Item
                    onClick={() => handleFilter('sea food')}
                    className={popularFilter === 'sea food' ? 'active d-flex  gap-3 hovering ' : 'd-flex  gap-3 hovering '}
                  >
                    <SetMealIcon className="text-success" /> sea foods
                  </ListGroup.Item>
                </ListGroup>
              </div>
            </Col>
            <Col className="scrollable-column" md={!isSmallScreen ? 9 : 12}>
              {(query || popularFilter) && products?.length === 0 && (
                <div className="my-5">
                  <div className=" d-flex justify-content-center align-items-center flex-column">
                    <p className="fw-bold " style={{ height: '15vh' }}>
                      <strong className="border-bottom fs-5  border-primary text-danger">
                        No kitchen found.
                      </strong>{' '}
                    </p>

                    <YoutubeSearchedForIcon
                      style={{ width: '100px', height: '100px' }}
                      className="text-success "
                    />
                    <Link
                      to="/search"
                      on
                      variant="light"
                      className=" text-success fs-3 fw-bold"
                    >
                      Show All Stores
                    </Link>
                  </div>
                </div>
              )}

              <ResponsiveMasonry
                columnsCountBreakPoints={{ 350: 1, 765: 2, 900: 2 }}
              >
                <Masonry gutter="10px">
                  {products?.length > 0 &&
                    products?.map((item, index) => (
                      <Link
                        to={`/kitchen/${item?._id}`}
                        className="text-decoration-none kitchenHover border rounded  p-2 "
                        style={{ minHeight: '200px' }}
                        key={`${index}-${item._id}`}
                      >
                        {' '}
                        <SearchedItems item={item} />
                      </Link>
                    ))}
                </Masonry>
              </ResponsiveMasonry>
            </Col>
          </Row>
       
        </Container>
      )}

      {!loading &&
        products?.length >
          0 &&(
            <div className="navigation-button">
              <Button className="button1">see more</Button>
            </div>
          )}
      <Footer />
    </div>
  );
}

export default SearchScreen;
