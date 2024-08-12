import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import './riders.css';
import Navbar from '../navSection/Navbar';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Rating from '../component/Rating';
import { api } from '../utils/apiConfig';

const RiderCard = () => {
  const params = useParams();
  const { id } = params;
  const page = 1;

  const [riderData, setRiderData] = useState({});
  const handleRiderReview = async () => {
    try {
      const riderData = {
        userId: '65e48b46c484cd486363262e',
        msg: 'good vendor buy from them👍👍',
        reviewerId: '65e2ee0f9d83c58da94fed0a',
        positive: true,
      };
      const { data } = await axios.post(
        `${api}/api/reviews`,
        riderData
      );
      
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleRiderInfo = async () => {
      try {
        const { data } = await axios.get(
          `${api}/api/users/find/${id}?page=${page}`
        );

        setRiderData(data);
      } catch (error) {
        console.log(error);
      }
    };
    handleRiderInfo();
  }, [id]);

  
  return (
    <div>
      <Navbar />
      <Container>
        <Card className=" my-4 border-0" variant="flush">
          <div className="d-flex justify-content-center   align-items-center gap-3">
            <div className="imageRide">
              <img src="/images/ghanajolof.jpg" alt="" />{' '}
            </div>
            <div>
              {riderData?.user?.balance && (
                <Card.Text className="text-end px-3">
                  Available balance:{' '}
                  <strong>NGN{riderData?.user?.balance?.toFixed(2)}</strong>
                </Card.Text>
              )}
              <Card.Title className="text-capitalize">
                {riderData?.user?.name}
              </Card.Title>
            </div>
          </div>
          {/* Add the URL of the rider's image */}
          <Card.Body className=" ">
            <ListGroup className="list-group-flush">
              <ListGroup.Item className="d-flex align-items-center">
                {' '}
                Rating: <Rating product={riderData?.user} />
              </ListGroup.Item>
              <ListGroup.Item>Status: 173 rides completed</ListGroup.Item>
              <ListGroup.Item>
                Delivery duration: {riderData?.user?.deliveryRate}hr
              </ListGroup.Item>
              <ListGroup.Item>{riderData?.user?.km}km away</ListGroup.Item>
              <ListGroup.Item>
                {' '}
                <div>
                  {' '}
                  <strong>Reviews({riderData?.reviews?.length})</strong>
                  {riderData?.reviews?.map((item) => (
                    <div
                      key={item._id}
                      className="d-flex align-items-cente gap-1 my-2"
                    >
                      <div className="imageReview">
                        <img src={item?.reviewerImg} alt="" />{' '}
                      </div>
                      <div className="d-flex flex-column">
                        <span className="fw-bold text-capitalize">
                          {item?.reviewerName}{' '}
                        </span>
                        {item?.msg}
                      </div>
                    </div>
                  ))}
                  <div className="text-center ">
                    <Button
                      onClick={handleRiderReview}
                      variant="primary"
                      className="px-5"
                    >
                      See More
                    </Button>
                  </div>
                </div>
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default RiderCard;
