import React from 'react';

function ShippingDetails({ shipping }) {
  return (
    <div>
      <div className="d-flex flex-wrap  flex-column text-capitalize">
        <div className="d-flex flex-wrap align-items-center gap-1">
          <span className='fw-bold'>Address:</span>
          <div>
            {' '}
            <span >
              {shipping.street} {shipping.localGvt}, {shipping.state}{' '}
              {shipping.country}
            </span>
          </div>
        </div>
        <div className="d-flex align-items-center  gap-2">
          <span className='fw-bold'>Name: </span>
          <span >{shipping?.name}</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className='fw-bold'>phone number: </span>
          <span >{shipping?.phoneNumber}</span>
        </div>
      </div>
    </div>
  );
}

export default ShippingDetails;
