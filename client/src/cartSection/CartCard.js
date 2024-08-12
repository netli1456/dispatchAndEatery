import React from 'react';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';

import ListGroup from 'react-bootstrap/ListGroup';

import Card from 'react-bootstrap/Card';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addCart, removeCart } from '../redux/cartSlice';
import Button from 'react-bootstrap/Button';

function CartCard(props) {
  const location = useLocation();
  const { cartItems } = useSelector((state) => state.cart);
  const { product } = props;
  const dispatch = useDispatch();

  const handleRemoveCart = (id) => {
    dispatch(removeCart(id));
  };

  const handlequantity = (item, quantity) => {
    dispatch(addCart({ ...item, quantity }));
  };
  return (
    <div>
      {location.pathname !== '/cart' && (
        <Card>
          <Card.Body>
            <strong>
              Total({cartItems?.length} Items):{' '}
              {`N${cartItems
                ?.reduce((a, c) => a + c.price * c.quantity, 0)
                .toFixed(2)}`}
            </strong>
          </Card.Body>
        </Card>
      )}

      <ListGroup className="mt-2 bor">
        {location.pathname !== '/cart' && (
          <span className="text-center fw-bold border-bottom border-dark fs-5">
            Your Cart Items
          </span>
        )}

        {(location.pathname === `/product/${product}`
          ? cartItems?.slice(0, 3)
          : cartItems
        )?.map((item) => (
          <ListGroup.Item
            className={' d-flex mb-2 border gap-1 '}
            key={item._id}
          >
            <Link
              to={`/product/${item._id}`}
              style={{ width: '60%', height: '100px' }}
            >
              {' '}
              <img
                src={item?.imgs[0]}
                alt=""
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Link>
            <div
              style={{ width: '100%', height: '100%' }}
              className="d-flex justify-content-center align-items-center flex-column "
            >
              <span className="fw-bold text-capitalize text-secondary">
                {item?.name}
              </span>
              <span className="  text-secondary">{item?.desc}</span>

              <strong className=" text-success">
                N{item?.price.toFixed(2)}
              </strong>
              <div className="d-flex align-items-center gap-1">
                {' '}
                <Button
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                  }}
                  variant="success"
                  className=" bg-success d-flex justify-content-center align-items-center fs-3 text-white"
                  onClick={() => handlequantity(item, item?.quantity - 1)}
                  disabled={item.quantity === 1}
                >
                  -
                </Button>{' '}
                {item?.quantity}{' '}
                <Button
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                  }}
                  variant="success"
                  className=" bg-success d-flex justify-content-center align-items-center fs-4 text-white"
                  onClick={() => handlequantity(item, item?.quantity + 1)}
                >
                  +
                </Button>{' '}
              </div>
            </div>

            <span
              style={{
                position: 'absolute',
                top: 1,
                right: 2,
                cursor: 'pointer',
              }}
              className="text-danger  "
              onClick={() => handleRemoveCart(item?._id)}
            >
              <HighlightOffOutlinedIcon />
            </span>
          </ListGroup.Item>
        ))}
        
      </ListGroup>
    </div>
  );
}

export default CartCard;
