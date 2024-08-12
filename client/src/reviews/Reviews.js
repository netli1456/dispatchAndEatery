import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { api } from '../utils/apiConfig';
import PersonIcon from '@mui/icons-material/Person';
import ListGroup from 'react-bootstrap/esm/ListGroup';

function Reviews(props) {
  const [riderData, setRiderData] = useState({});

  const { id, bgReviews, setBgReviews } = props;

  useEffect(() => {
    const handleRiderInfo = async () => {
      try {
        const { data } = await axios.get(`${api}/api/users/reviews/${id}`);

        setRiderData(data);
        setBgReviews(data?.length > 0 ? true : false);
        console.log('riderData', data);
      } catch (error) {
        console.log(error);
      }
    };

    if (id) {
      handleRiderInfo();
    }
  }, [id, setBgReviews]);

  const handleRiderReview = async () => {
    try {
      const riderData = {
        userId: '65e48b46c484cd486363262e',
        msg: 'good vendor.',
        reviewerId: '65fb0766918aa0338e1d0142',
        positive: true,
      };
      const { data } = await axios.post(`${api}/api/reviews`, riderData);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {bgReviews && (
        <ListGroup variant="flush">
          {' '}
          {riderData?.length > 0 && (
            <strong className="text-center fw-bold">
              Reviews({riderData?.length})
            </strong>
          )}
          {riderData?.length > 0 &&
            riderData.map((item) => (
              <ListGroup.Item key={item._id} className="d-flex  gap-2 my-2">
                <div className="imageReview">
                  {item.reviewerImg ? (
                    <img src={item?.reviewerImg} alt="" />
                  ) : (
                    <div
                      className="border border-secondary rounded-5 d-flex align-items-center justify-content-center"
                      style={{}}
                    >
                      <PersonIcon />
                    </div>
                  )}
                </div>
                <div className="d-flex flex-column">
                  <span className="fw-bold d-flex align-items-center text-capitalize gap-3">
                    {item?.reviewerName}{' '}
                    <span
                      className={
                        item.positive === true
                          ? 'bg-success border rounded border-secondary text-white px-1'
                          : 'bg-danger border rounded border-secondary text-white px-1'
                      }
                    >
                      {item.positive === true ? 'Positive' : 'Negative'}{' '}
                    </span>
                  </span>
                  {item?.msg}
                </div>
              </ListGroup.Item>
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
        </ListGroup>
      )}
    </div>
  );
}

export default Reviews;
