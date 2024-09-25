
import React from 'react';
import { useLocation } from 'react-router-dom';

function Cards({ item }) {
  const location = useLocation();
  return (
    <div className="border rounded kitchhov" style={{ minHeight: '100%', width:"" }}>
      
        <div className="cardBox" >
         
            <img
              src={item?.imgs[0]?.url}
              alt={''}
              style={{
                width: '100%',
                height: location.pathname === '/kitchen' ? '180px' : '170px',
                transition: 'ease-in-out',
                objectFit: 'cover',
                
              }}
              className='rounded'
              
            />
         
        </div>
        <div>
          {' '}
          
            <div className="d-flex align-items-center flex-column justify-content-center">
              <span className="fw-bold text-capitalize text-secondary">
                {item?.name?.length > 15
                  ? `${item?.name?.slice(0, 15)}...`
                  : item?.name}
              </span>
              <span className="text-secondary">
                {item?.desc?.length > 15
                  ? `${item?.desc?.slice(0, 15)}...`
                  : item?.desc}
              </span>
              <strong className=" text-success">
                N{item?.price?.toFixed(2)}
              </strong>
            </div>
         
        </div>
      
    </div>
  );
}

export default Cards;
