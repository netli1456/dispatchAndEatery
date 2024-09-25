import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function LetsDoItTogether(props) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const {setVendorRegistrationOpen}=props
  const {userInfo} = useSelector((state)=> state.user)
  const navigate = useNavigate()

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 774);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const handleVendorRegistration = () => {
    navigate(`/profile/${userInfo?.user?._id}?openUpload=true`); 
  };

  return (
    <div style={{ width: '100%' }} className=" my-5 ">
      <div className="text-center my-5" style={{ position: 'relative' }}>
        <img
          src="/images/1.jpeg"
          alt=""
          style={{
            width: '100%',
            height: isSmallScreen ? '700px' : '400px',
            objectFit: 'cover',
          }}
        />

        <Row
          style={{
            position: 'absolute',
            top: '5%',
          }}
        >
          <div style={{ marginBottom: !isSmallScreen ? '40px' : '' }}>
            <Button variant="white">
              {' '}
              <h1 className="text-outline px-4 p-2 text-success bg-white">
                Become a vendor/rider today
              </h1>
            </Button>
          </div>
          <Col md={6} style={{ width: '' }} className="">
            <h4 className="text-outline bg-success">Register here as a food vendor</h4>
            <div className="d-flex flex-column">
              {' '}
              <strong className="text-outline ">
                join the fastest growing community and take  your business
                online. <br/>
                register today and win bonuses. register as a food vendor
                or agent and get <br/> bonuses for every sales. <br/>you can also get up to
                20% bonus of your monthly sales.{' '}
              </strong>
              <div>
                <Button onClick={handleVendorRegistration} variant="danger" className="text-white fw-bold my-3">
                  Food vendor registration
                </Button>
              </div>
            </div>
          </Col>
          <Col md={6}>
            {' '}
            <h4 className="text-outline bg-success">Register here as a dispatch rider</h4>
            <div className="d-flex flex-column">
              <strong className="text-outline ">
              Fast and reliable delivery is our top priority. <br/> join our dispatch riders today and  ride to your <br/> favorite destinations. 
                <br/>
                register today and win up to 10,000 naira bonuses <br/> for your first 10 rides. 
                {' '}
              </strong>
              <div>
                {' '}
                <Button onClick={()=>setVendorRegistrationOpen(true)} className="fw-bold mt-3">
                  Dispatch rider registration
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default LetsDoItTogether;
