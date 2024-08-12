import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import SearchBar from './SearchBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/esm/Button';
import Carousel from 'react-bootstrap/Carousel';
import { useNavigate } from 'react-router-dom';

const Map = (props) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const navigate = useNavigate();
  const [mapData, setMapData] = useState(false);
  const { setOpen } = props;

  useEffect(() => {
    const latitude = 6.5244;
    const longitude = 3.3792;

    const mapUrl = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d126844.06348606381!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sng!4v1706517127493!5m2!1sen!2sng`;
    setMapData(mapUrl);
  },[]);

  const data = [
    {
      img: '/images/2.jpeg',
      title: '50% Off Your Next Order!',
      desc: "Don't miss out on this incredible offer!",
    },
    {
      img: '/images/1.jpeg',
      title: 'Fast Delivery!',
      desc: ' we prioritize speed as much as we do taste!',
    },

    {
      img: '/images/3.jpeg',
      title: 'Join Our Happy Family Today!',
      desc: ' Experience the warmth of our food community',
    },
    {
      img: '/images/4.jpeg',
      title: 'Enjoy 50% Off All Burgers!',
      desc: " Don't miss out on this sizzling deal",
    },
    {
      img: '/images/5.jpeg',
      title: 'Say goodbye to meal planning stress! ',
      desc: 'Your Breakfast, Lunch, and Dinner Are Set!',
    },
    {
      img: '/images/6.jpeg',
      title: '24/7 at Your Service!',
      desc: "Need food delivered at any hour? We've got you covered! ",
    },
    {
      img: '/images/7.jpeg',
      title: 'You Smile, We smile!',
      desc: 'nothing brings us more joy than seeing your satisfaction.',
    },
    {
      img: '/images/8.jpeg',
      title: 'Pocket-Friendly and Delicious!',
      desc: 'Indulge in mouthwatering delicacies without breaking the bank!',
    },
  ];

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

  

  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      {mapData ? (
        <Form className="searchP">
          <iframe
            width="100%"
            height="300"
            title="Google Map Embed"
            id="map-iframe"
            src={mapData}
            style={{ border: '0' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
          <div className="mb-3 searchbar">
            <SearchBar setOpen={setOpen} bg={true} />
          </div>
        </Form>
      ) : (
        <div>
          {
            <div
              className="d-flex gap-4 align-items-center px-3 py-1"
              style={{ fontSize: '77px' }}
            >
              <span className="sponsoredfont">powered by META</span>
              <span className="sponsoredfont">BDC approved</span>
              <span className="sponsoredfont">logistics</span>
            </div>
          }
          <div
            className={!isSmallScreen ? `bgg  rounded p-4 ` : 'bgg pt-2'}
            style={{ width: '100%', margin: 'auto' }}
          >
            <Row className="bg-white rounded">
              <Col md={6} className="rounded p-0">
                <Carousel>
                  {data.map((item, index) => (
                    <Carousel.Item key={index}>
                      <div
                        style={{ width: '100%', height: '390px' }}
                        className=""
                      >
                        <img
                          src={item?.img}
                          alt=""
                          style={{
                            width: '100%',
                            height: '390px',
                            objectFit: 'cover',
                          }}
                          className="picRound"
                        />
                      </div>
                      <Carousel.Caption>
                        <h3 className="text-outline">{item?.title}</h3>
                        <p className="text-center text-outline">
                          {item?.desc}.
                        </p>
                        {isSmallScreen && (
                          <Button
                            variant="success"
                            onClick={() => navigate('/search')}
                          >
                            Order Now
                          </Button>
                        )}
                      </Carousel.Caption>
                    </Carousel.Item>
                  ))}
                </Carousel>
              </Col>
              <Col
                md={6}
                className=" d-none d-md-flex justify-content-center flex-column align-items-center"
              >
                <h1 className="text-center mb-4">Discover Delicious Deals</h1>
                <p className="text-center">
                  Welcome to M-bite food app! Indulge your cravings with our
                  mouthwatering dishes while enjoying amazing discounts. Explore
                  a world of flavors right at your fingertips.
                </p>
                <Button variant="primary" className="mt-3">
                  Order Now
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
