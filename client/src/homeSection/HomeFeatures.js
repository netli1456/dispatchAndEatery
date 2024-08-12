import React from 'react';
import Col from 'react-bootstrap/Col';
import Carousel from 'react-bootstrap/Carousel';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { Box, Skeleton } from '@mui/material';

function HomeFeatures({ carouselData, loading }) {
  return (
    <Row className=" m-1">
      <Col md={6} className="mt-3 mb-3">
        <div className="d-flex justify-content-center bg-white rowfirstcol ">
          <ul >
            <li>Budget-friendly options for every customer</li>
            <li>Guaranteed 100% delivery success rate</li>
            <li>Wide variety of cuisines to satisfy diverse tastes</li>
            <li>Efficient and timely delivery services</li>
            <li>User-friendly mobile app for seamless ordering</li>
          </ul>
        </div>
      </Col>
      <Col md={6} className="mb-3">
        {loading ? (
          <div>
            <Skeleton variant="rectangular" height={200} />
            <Box sx={{ pt: 0.5 }}>
              <Skeleton />
              <Skeleton width="60%" />
            </Box>
          </div>
        ) : (
          <>
            {carouselData && carouselData?.length > 0 ? (
              <Carousel controls={true} indicators={false}  className="custom-carousel">
                {carouselData.map((item, index) => (
                  <Carousel.Item
                    key={`${item?._id}-${index}`}
                    className="carouselIte"
                  >
                    <div style={{ height: '380px' }}>
                      <Button className=" suggetWidth fw-bold border-bottom border-success bg-success text-white mt-3 mb-1">
                        suggested kitchens for you
                      </Button>
                      <Card>
                        <Link
                          className="text-decoration-none"
                          to={`/kitchen/${item?._id}`}
                        >
                          <Card.Title className="p-2 text-capitalize">
                            {' '}
                            <span className="text-capitalize d-flex gap-2 align-items-center text-succes">
                              {item?.businessName}
                              {item?.verified && (
                                <img
                                  src="https://cdn-icons-png.freepik.com/512/7641/7641727.png"
                                  alt=""
                                  style={{ width: '20px' }}
                                />
                              )}
                            </span>
                          </Card.Title>
                          <div>
                            {item ? (
                              <img
                                
                                style={{
                                  width: '100%',
                                  height: '200px',
                                  objectFit: 'cover',
                                }}
                                src={item?.businessImg}
                                alt=""
                              />
                            ) : (
                              <Skeleton variant="rectangular" height={200} />
                            )}
                          </div>

                          <Card.Body>
                            <div className="d-flex text-black   homefet flex-column mx-2">
                              <span>
                                Delivery time: {item?.deliveryRate}hour{' '}
                              </span>
                              <span>{`${item?.km}km`} away</span>
                            </div>
                          </Card.Body>
                        </Link>
                      </Card>
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
            ) : (
              <div
                className="text-center  d-flex justify-content-center align-items-center"
                style={{ height: '100%' }}
              >
                <img
                  src="https://images.squarespace-cdn.com/content/v1/5ef2b5dcaa910a063d820ff6/91a58a2a-f667-4de2-b792-9efcf557cc88/HCBA_Shop%26Win_DigitalAssets_WebBanner_2500x750.png"
                  alt=""
                  style={{ width: '100%', height: '80%' }}
                  className="border rounded"
                />
              </div>
            )}
          </>
        )}
      </Col>
    </Row>
  );
}

export default HomeFeatures;
