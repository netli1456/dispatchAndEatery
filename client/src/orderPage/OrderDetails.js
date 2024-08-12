import React from 'react';
import Button from 'react-bootstrap/esm/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from 'react-router-dom';
import { Skeleton } from '@mui/material';

function OrderDetails({ data, smallScreen, loading }) {
  return (
    <Card>
      <ListGroup variant="flush">
        {(loading ? Array.from(new Array(1)) : data?.products)?.map(
          (item, index) => (
            <ListGroup.Item key={index}>
              {item ? (
                <Link
                  to={`/product/${item?.productId}`}
                  className="parentorder d-flex align-items-center gap-3"
                >
                  <div className={smallScreen ? 'list box6' : 'box1 list'}>
                    <img src={item.img} alt="" />
                  </div>
                  <div className="list box2">
                    <span>
                      {smallScreen && item.name.length > 11
                        ? `${item.name.slice(0, 11)}...`
                        : item.name}
                    </span>
                  </div>
                  <div className="list box3">
                    <span className="d-flex align-item-center flex-wrap">
                      {item.category === 'food'
                        ? `${item.quantity} plate`
                        : item.category === 'meat'
                        ? ` ${item.quantity} pieces`
                        : `${item.quantity} pieces 
                                `}
                      <span className="text-danger">({`N${item.price}`})</span>
                    </span>
                  </div>
                  {!smallScreen && (
                    <div className=" box4 ">
                      <div className="d-flex gap-2 align-items-center justify-content-center border">
                        <Button
                          disabled
                          variant="success"
                          className="botn border border-success "
                        >
                          -
                        </Button>
                        <Button
                          disabled
                          variant="success"
                          className="botn border border-grey"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  )}
                  <div className=" box5">
                    <div className="d-flex gap-2 align-items-center justify-content-center border">
                      <Button disabled variant="danger" className="botn1">
                        Remove
                      </Button>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="d-flex justify-content-between align-items-center">
                  <Skeleton  height={40} width="20%"/>
                  <Skeleton height={40} width="20%"/>
                  <Skeleton height={40} width="10%"/>
                  <Skeleton height={40} width="10%" />
                </div>
              )}
            </ListGroup.Item>
          )
        )}
      </ListGroup>
    </Card>
  );
}

export default OrderDetails;
