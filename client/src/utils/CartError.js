import React from 'react';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function CartError({ error, setError, kitchen }) {
  const navigate = useNavigate();

  const cancelToast =()=>{
         toast.dismiss()
  }
  return (
    <div className="carterrorMain d-flex align-items-center justify-content-center flex-column p-3">
      <strong className="text-danger">Attention!</strong>
      <p className="maxError">{error}</p>
      <div className="d-flex align-items-center flex-wrap gap-3">
        <Button
          onClick={() => navigate(`/kitchen/${kitchen}`)}
          variant="success"
          bg="success"
        >
          Go to store
        </Button>
        <Button variant="danger" bg="danger" onClick={cancelToast}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default CartError;
