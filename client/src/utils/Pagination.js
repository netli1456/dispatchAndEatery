import React from 'react';
import Button from 'react-bootstrap/Button'

function Pagination(props) {
  const { currentPage, totalPages, handleChange } = props;

  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  return <div>
    {pageNumbers.map((number, index)=>(
        <Button onClick={handleChange(number)} key={index}  style={{ 
            margin: '0 5px', 
            padding: '10px', 
            backgroundColor: number === currentPage ? '#007bff' : '#fff', 
            color: number === currentPage ? '#fff' : '#000',
            border: '1px solid #007bff',
            borderRadius: '5px'
        }}>
            {number}
        </Button>
    ))}
  </div>;
}

export default Pagination;
