import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useDispatch, useSelector } from 'react-redux';

import { shippingSuccess } from '../redux/shippingSlice';
import { toast } from 'react-toastify';

function Shipping({ setShipOpen }) {
  const { shipping } = useSelector((state) => state.shippingAddress);
  const [name, setName] = useState(shipping?.name || '');
  const [localGvt, setLocalGvt] = useState(shipping?.localGvt || '');
  const [country, setCountry] = useState(shipping?.country || '');
  const [street, setStreet] = useState(shipping?.street || '');
  const [state, setState] = useState(shipping?.state || '');
  const [phoneNumber, setPhoneNumber] = useState(shipping?.phoneNumber || '');
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const dispatch = useDispatch();

  const handleShipping = async (e) => {
    e.preventDefault();
    if (name || localGvt || phoneNumber || country || street || state) {
      dispatch(
        shippingSuccess({ name, localGvt, phoneNumber, country, street, state })
      );
      setShipOpen(false);
      toast.success("Shipping Info Updated", {autoClose:1000, position:"top-center", theme: "light", toastId:"unique-toast-id"});
    } else {
      toast.error("Fill in the missing fields", {autoClose:5000, theme: "colored", toastId:"unique-toast-id"});
    }
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

  return (
    <div className="mt-">
      <Card
       
        style={{ maxWidth: '600px', minWidth: '400px', height: 'fit-content',  }}
        className='shipBg'
      >
        <Card.Body>
          <div>
            <div
              className="d-flex justify-content-center my-5 flex-column align-items-center"
              style={{ width: '100%' }}
            >
              <strong className="fs-4">Shipping Address</strong>
              <Form onSubmit={handleShipping} style={{width:'90%'}}>
                <InputGroup className="my-3 d-flex flex-column" >
                  <strong className="fw-bold">Name *</strong>
                  <Form.Control
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    required={true}
                    placeholder=" write name here"
                    style={{width:"100%"}}
                  />
                </InputGroup>

                <InputGroup  className="my-3 d-flex flex-column">
                  <strong className="fw-bold">
                    Local-Gvt-Area *
                  </strong>
                  <Form.Control
                  style={{width:"100%"}}
                    type="text"
                    onChange={(e) => setLocalGvt(e.target.value)}
                    required={true}
                    placeholder=" write LGA here"
                  />
                </InputGroup>
                <InputGroup className="my-3 d-flex flex-column">
                  <strong className="fw-bold">State *</strong>
                  <Form.Control
                  style={{width:"100%"}}
                    type="text"
                    onChange={(e) => setState(e.target.value)}
                    required
                    placeholder=" write state here"
                  />
                </InputGroup>
                <InputGroup className="my-3 d-flex flex-column">
                  <strong className="fw-bold">Country *</strong>
                  <Form.Control
                  style={{width:"100%"}}
                    type="text"
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    placeholder="write country here"
                  />
                </InputGroup>
                <InputGroup className="my-3 d-flex flex-column">
                  <strong className="fw-bold">
                    PhoneNumber *
                  </strong>
                  <Form.Control
                  style={{width:"100%"}}
                    type="number"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    placeholder=" write number here"
                  />
                </InputGroup>
                <InputGroup className="my-3 d-flex flex-column">
                  <strong className="fw-bold">Street *</strong>
                  <Form.Control
                  style={{width:"100%"}}
                    type="text"
                    onChange={(e) => setStreet(e.target.value)}
                    required
                  />
                </InputGroup>

                <div className="d-flex gap-3 align-items-center my-3">
                  <Button
                    variant="danger"
                    className="bg-danger fw-bold"
                    onClick={() => setShipOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="success"
                    className="bg-success fw-bold"
                    type="submit"
                  >
                    Confirm
                  </Button>
                </div>
              </Form>

            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Shipping;
