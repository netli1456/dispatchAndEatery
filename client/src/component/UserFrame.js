import React from 'react';
import PersonPinIcon from '@mui/icons-material/PersonPin';

function UserFrame(props) {
  const { name, img } = props;
  return (
    <div className='d-flex align-items-center text-secondary text-capitalize justify-content-center flex-column mb-3'>
      {img ? <img src={img} alt={name} style={{width:'50px' , height:"50px", borderRadius:'50%', border:'1px solid' }} /> : <PersonPinIcon style={{width:'50px' , height:"50px", }} />}{' '}
      <strong className='text-secondary'>{name}</strong>
    </div>
  );
}

export default UserFrame;
