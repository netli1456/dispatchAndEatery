import React from 'react';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarHalfOutlinedIcon from '@mui/icons-material/StarHalfOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';

function Rating({ product }) {
  return (
    <div className='d-flex align-items-center'>
    <div>
      {product?.rating >= 1.0 ? (
        <StarOutlinedIcon  className="text-warning " />
      ) : product?.rating >= 0.5 ? (
        <StarHalfOutlinedIcon className="text-warning " />
      ) : (
        <StarOutlineIcon  className="text-warning "/>
      )}
    </div>
    <div>
      {product?.rating >= 2.0 ? (
        <StarOutlinedIcon  className="text-warning " />
      ) : product?.rating >= 1.5 ? (
        <StarHalfOutlinedIcon className="text-warning " />
      ) : (
        <StarOutlineIcon  className="text-warning "/>
      )}
    </div>
    <div>
      {product?.rating >= 3.0 ? (
        <StarOutlinedIcon  className="text-warning " />
      ) : product?.rating >= 2.5 ? (
        <StarHalfOutlinedIcon className="text-warning " />
      ) : (
        <StarOutlineIcon  className="text-warning "/>
      )}
    </div>
    <div>
      {product?.rating >= 4.0 ? (
        <StarOutlinedIcon  className="text-warning " />
      ) : product?.rating >= 3.5 ? (
        <StarHalfOutlinedIcon className="text-warning " />
      ) : (
        <StarOutlineIcon  className="text-warning "/>
      )}
    </div>
    <div>
      {product?.rating >= 5.0 ? (
        <StarOutlinedIcon  className="text-warning " />
      ) : product?.rating >= 4.5 ? (
        <StarHalfOutlinedIcon className="text-warning " />
      ) : (
        <StarOutlineIcon  className="text-warning "/>
      )}
    </div>
    </div>
  );
}

export default Rating;
