import React, {  useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from 'react-router-dom';
import CircleIcon from '@mui/icons-material/Circle';

import Button from 'react-bootstrap/Button';
import Rating from '../component/Rating';

import { useDispatch, useSelector } from 'react-redux';
import { addCart } from '../redux/cartSlice';
import CartError from '../utils/CartError';
import { toast } from 'react-toastify';


function ProductDetails(props) {
  const { product,  isSmallScreen, currentImage, setCurrentImage,  } =
    props;

  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const addToCart = (product) => {
    if (cartItems.length === 0) {
      const existItem = cartItems?.find((item) => item._id === product._id);
      const quantity = existItem ? existItem.quantity + 1 : 1;
      dispatch(addCart({ ...product, quantity }));
      toast.success('Added', {
        autoClose: 300,
        theme: 'light',
        toastId: 'unique-toast-id',
      });
    } else if (cartItems.length >= 1 && product?.userId === cartItems[0]?.userId) {
      const existItem = cartItems?.find((item) => item._id === product._id);
      const quantity = existItem ? existItem.quantity + 1 : 1;
      dispatch(addCart({ ...product, quantity }));
      toast.success('Added', {
        autoClose: 300,
        theme: 'light',
        toastId: 'unique-toast-id',
      });
    } else {
      toast.warning('You can only add items from one store at a time. you already have an item from another store in your cart. ', {
        autoClose: false,
        theme: 'dark',
        toastId: 'unique-toast-id',
      });
    }
  };

  return (
    <Row>
      <Col md={9} className={isSmallScreen ? '' : 'rounded mt-5'}>
        <div style={{ height: '60vh' }}>
          <img
            src={currentImage}
            alt=""
            className="rounded"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
        <div className="d-flex my-2 gap-2 justify-content-center">
          {product?.imgs?.map((item) => (
            <Link key={item.imgId} style={{ maxWidth: '50px', height: '50px' }}>
              {' '}
              <img
                src={item?.url}
                alt=""
                style={{
                  maxWidth: '50px',
                  height: '50px',
                }}
                onClick={() => setCurrentImage(item?.url)}
                className={
                  product?.imgs && currentImage === item.url
                    ? 'border rounded border-success p-1'
                    : ''
                }
              />
            </Link>
          ))}
        </div>

        <div
          style={{width:'fit-content', minWidth: '60%' }}
          className="bg-success d-flex flex-column my-3  p-2 text-white rounded text-capitalize bg-opacity-"
        >
          <strong className="fs-5 fw-bold">
            {' '}
            Price:{' '}
            <span className="border-bottom border-grey">
              N{product?.price?.toFixed(2)}
            </span>
          </strong>

          <strong className="text-capitalize " style={{ width: 'fit-content' }}>
            Name:{' '}
            <span className="border-bottom border-grey"> {product?.name}</span>
          </strong>

          <span style={{ wordBreak: 'break-word' }}>
            <strong>Description: </strong>
            {product?.desc}
          </span>
          <div>
            <strong>Content: </strong>
            {product?.content}
          </div>
        </div>
      </Col>
      <Col md={3} className=" p-0">
        <ListGroup variant="flush">
          <ListGroup.Item>
            
              <div className="d-flex align-items-center gap-1">
                <Link to={`/kitchen/${product.userId}`} className="text-capitalize fw-bold text-secondary">
                  {product?.businessName}
                </Link>
                <img
                  src="https://cdn-icons-png.freepik.com/512/7641/7641727.png"
                  alt=""
                  style={{ width: '20px' }}
                />
              </div>
            
          </ListGroup.Item>
          <ListGroup.Item>
            <div className="d-flex flex-column">
              <span>Physical Address: </span>
              {product?.physicalAddress}
            </div>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex flex-column">
            <div>
              <span>
                Rating :{' '}
                {product?.businessRating > 0 ? product?.businessRating : 'none'}
              </span>
              <div className="d-flex align-items-center ">
                <Rating product={product} />
              </div>
            </div>
          </ListGroup.Item>

          <ListGroup.Item>
            <span className="text-capitalize">
              {product?.status === 'available' ? (
                <span className="d-flex align-items-center gap-1">
                  online
                  <CircleIcon
                    className="text-success "
                    style={{ width: '13px', height: '13px' }}
                  />
                </span>
              ) : (
                'last seen:  5 minutes ago'
              )}
            </span>

            <div className="rounded  d-flex flex-column">
              <span className="mb-1 ">
                {' '}
                {product?.verified
                  ? 'this user is verified'
                  : 'this user is not verified'}
              </span>
              <Button
                onClick={() => addToCart(product)}
                className="fw-bold"
                variant="success"
              >
                Add To Tray
              </Button>
            </div>
          </ListGroup.Item>
          <ListGroup.Item>
          
          </ListGroup.Item>
        </ListGroup>
      </Col>
      {error && (
        <div className="cartError d-flex align-items-center justify-content-center">
          <CartError
            kitchen={cartItems[0]?.userId}
            setError={setError}
            error={error}
          />
        </div>
      )}
    </Row>
  );
}

export default ProductDetails;
