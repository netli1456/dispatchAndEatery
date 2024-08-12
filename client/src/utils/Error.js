import React from 'react';

function Error({ error }) {
  return (
    <div className="d-flex my-5 justify-content-center align-items-center flex-column ">
      <strong variant="danger" className="error  d-flex   p-4 ">
        Oops! something went wrong.. {error}
      </strong>
    </div>
  );
}

export default Error;
