import React from 'react';
import { Link } from 'react-router-dom';

function Error({ error }) {
  return (
    <div className="d-flex my-5 justify-content-center align-items-center flex-column ">
      <strong variant="danger" className="error  d-flex   p-4 ">
      Oops! The page you are looking for does not exist. {error}
      </strong>
      <h5>this error happens when the page you are trying to reach or the url is broken or does not exist</h5>
      <Link to='/'>Go back home</Link>
    </div>
  );
}

export default Error;
