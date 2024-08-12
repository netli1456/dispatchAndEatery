import React from 'react';


import Rating from '../component/Rating';

function SearchedItems({ item }) {
  return (
    <div className="listing">
      <img src={item?.businessImg} alt={''} className="listing-image" />
      <div className="listing-info">
        <h3 className='text-capitalize'>{item.businessName}</h3>
        <div className="text-success border-success border-bottom">{item?.timeOpen} </div>
        <div className='d-flex align-items-center gap-1'>
          <span className='text-secondary font'>rating:</span><Rating product={item}/>
        </div>
        
        {item?.physicalAddress && <span className='font text-secondary'>{item?.physicalAddress}</span>}
        {item?.deliveryRate && <span className='font '>delivers in {item?.deliveryRate}mins</span>}
        <span>{`${item.km}km away`}</span>
        <span className="text-danger">{item.status}</span>
        
      </div>
    </div>
  );
}

export default SearchedItems;
