import React from 'react';
import Card from 'react-bootstrap/Card';
import { useLocation } from 'react-router-dom';

function KitchenBox({ item, home }) {
  const location = useLocation();
  return (
    <div style={{border:"1px solid blue", width:"100%", height:"100%"}}>
      <div>
        <Card>
          <img src={item.businessImg} alt=""  style={{width:"100%"}}/>

          <Card.Body className={location.pathname === '/' ? 'd-none' : ''}>
            <Card.Title>malofa</Card.Title>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default KitchenBox;
