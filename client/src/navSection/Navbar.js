import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import MenuIcon from '@mui/icons-material/Menu';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Badge from 'react-bootstrap/Badge';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ListGroup from 'react-bootstrap/ListGroup';
import { clearUserInfo } from '../redux/userSlice';
import { clearCart } from '../redux/cartSlice';
import { clearShipping } from '../redux/shippingSlice';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Button from 'react-bootstrap/Button';
import { clearLocation } from '../redux/searchSlice';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useOpen } from '../utils/isOpenState';

function Navbar(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const { searchedLocation } = useSelector((state) => state.searching);
  const { setOpenNow, } = props;

  const handleLogOut = () => {
    dispatch(clearUserInfo());
    dispatch(clearCart());
    dispatch(clearShipping());
    // dispatch(clearUserInfo());
    dispatch(clearLocation());
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

  const handleLocationOpen = () => {
    setOpenNow();
  };

  const {isOpen, toggle} =useOpen()

  return (
    <div className="bg-success py-2" style={{ width: '100%' ,  }}>
      <Container className="text-white py-1 d-flex justify-content-between align-items-center">
        <div className="d-flex gap-3 align-items-center navbarIcon px-2">
          <MenuIcon className="fs-2 fw-bold" />
          <Link to="/" className="text-decoration-none text-dark">
            <strong className="fw-bold fs-5">M-bite</strong>
          </Link>
        </div>
        {searchedLocation && (
          <Button variant="success" className="bg-success ">
            <strong
              className="d-flex align-items-center gap-1 text-uppercase"
              onClick={handleLocationOpen}
            >
              <LocationOnIcon />
              {isSmallScreen && searchedLocation.length >= 8
                ? `${searchedLocation.slice(0, 5)}..`
                : searchedLocation}
              <KeyboardArrowDownIcon className="fw-bold fs-5" />
            </strong>
          </Button>
        )}
        <div className="d-flex align-items-center gap-3">
          <div
            onClick={() => navigate('/cart')}
            style={{ position: 'relative', cursor: 'pointer' }}
          >
            < AddShoppingCartIcon
              className={
                location.pathname === '/cart'
                  ? 'fs-2 fw-bold  border border-white text-white color-white rounded'
                  : 'fs-2 fw-bold bor'
              }
            />

            <Badge
              pill
              bg="danger"
              style={{ position: 'absolute', right: -5, top: -2 }}
            >
              {cartItems?.length}
            </Badge>
          </div>
          {userInfo?.user?._id ? (
            <div
              className={
                location.pathname === '/profile'
                  ? 'd-flex border border-white rounded gap-1 align-items-center'
                  : 'd-flex bor gap-1 align-items-center'
              }
              style={{ cursor: 'pointer', position: 'relative' }}
            >
              <div
                className="d-flex align-items-center"
                onClick={() => toggle()}
              >
                {' '}
                <AccountCircleIcon className="fs-2 fw-bold" />
                <span className="d-none d-md-flex fw-bold align-items-center text-capitalize">
                  {userInfo?.user?.firstname} <ArrowDropDownIcon />
                </span>
              </div>
              {isOpen && (
                <ListGroup
                  style={{
                    position: 'absolute',
                    top: 35,
                    
                    right: 0,
                    minWidth: '200px',
                  }}
                >
                  <ListGroup.Item>
                    <Link
                      to={`/profile/${userInfo?.user?._id}`}
                      className="text-decoration-none text-success fw-bold d-flex flex-column align-items-center px-3"
                      onClick={()=>toggle()}
                    >
                      Account
                    </Link>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Link className="text-decoration-none text-success fw-bold d-flex flex-column align-items-center">
                      Order History
                    </Link>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Link
                      className="d-flex flex-column align-items-center text-decoration-none text-success fw-bold pb-5"
                      onClick={handleLogOut}
                    >
                      LogOut
                    </Link>
                  </ListGroup.Item>
                </ListGroup>
              )}
            </div>
          ) : (
            <Link className="text-white" to="/signin">
              Log-in
            </Link>
          )}
        </div>
      </Container>
    </div>
  );
}

export default Navbar;
