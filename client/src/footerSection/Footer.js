import React from 'react';

function Footer() {
  return (
    <div className='justify-content-center  py-4 text-secondary d-flex align-items-center'>
      <div className='d-flex p-2 gap-3 align-items-center'>
        <div className='d-flex flex-column'>
          <strong className='text-success'>Contacts</strong>
          <span>customer care: 07-4321</span>
          <span>chat customercare</span>
          <span>email: Mbite@gmail.com</span>
        </div>
        <div className='d-flex flex-column'>
          <strong className='text-success'>Report</strong>
          <span>refund</span>
          <span>settings & privacy</span>
          <span>terms & conditions</span>
        </div>
      </div>
    </div>
  );
}

export default Footer;
