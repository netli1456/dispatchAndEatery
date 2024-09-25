import React, { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import './product.css';
import Button from 'react-bootstrap/Button';
import Footer from '../footerSection/Footer';
import ProductDetails from './ProductDetails';
import CartCard from '../cartSection/CartCard';
import { useSelector } from 'react-redux';
import { api } from '../utils/apiConfig';
import Recommended from '../recommended/Recommended';
import LoadingBox from '../LoadingBox';
import Error from '../utils/Error';

function Product() {
  const params = useParams();
  const { id } = params;
  const [product, setProduct] = useState({});
  const [loadings, setLoadings] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const { cartItems } = useSelector((state) => state.cart);
  const [currentImage, setCurrentImage] = useState(null);
  const [availableProduct, setAvailableProduct] = useState([]);
  const [error, setError] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const productHandler = async () => {
      setLoadings(true);
      setError(false);
      try {
        const { data } = await axios.get(`${api}/api/products/find/${id}`);
        setProduct(data);
        setLoadings(false);
        if (data.imgs) {
          setCurrentImage(data.imgs[0].url);
        }
      } catch (error) {
        console.log(error);
        setLoadings(false);
        setError(true);
      }
    };
    productHandler();
  }, [id]);

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

  useEffect(() => {
    const relatedProducts = async () => {
      try {
        const { data } = await axios.post(`${api}/api/products/recommended`, {
          cartItems: cartItems,
          product: product,
        });

        setAvailableProduct(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (product?.type || cartItems?.length !== 0) {
      relatedProducts();
    }
  }, [cartItems, product, location]);

  return (
    <div>
      {loadings ? (
        <div
          style={{
            height: '70vh',
            overflow: 'hidden',
            width: '95vw',
            margin: 'auto',
          }}
        >
          <LoadingBox />
        </div>
      ) : error ? (
        <Error />
      ) : (
        <div style={{ overflowX: 'hidden' }}>
          <div>
            <div
              style={{
                width: !isSmallScreen ? '80vw' : '',
                margin: isSmallScreen ? '' : 'auto',
              }}
            >
              <Row>
                <Col
                  md={isSmallScreen ? 12 : cartItems.length > 0 ? 9 : 12}
                  className="product  p-3 "
                >
                  {
                    <ProductDetails
                      isSmallScreen={isSmallScreen}
                      product={product}
                      currentImage={currentImage}
                      setCurrentImage={setCurrentImage}
                      id={product?.userId}
                    />
                  }
                </Col>
                {!isSmallScreen && cartItems.length > 0 && (
                  <Col md={3} className="my-3">
                    <CartCard product={product._id} />

                    <Link
                      to="/cart"
                      className="d-grid my-2 text-decoration-none"
                    >
                      <Button
                        to="/cart"
                        variant="light"
                        className="text-success border-secondary "
                      >
                        See All
                      </Button>
                    </Link>
                  </Col>
                )}
              </Row>
            </div>

            <div className="border boder-danger">
              <Recommended
                availableProduct={availableProduct}
                id={product?.userId}
              />
            </div>

            <Footer />
          </div>
        </div>
      )}
    </div>
  );
}

export default Product;
