import Spinner from 'react-bootstrap/Spinner';

function Spinners(props) {
  const {newColor}=props
  return (
    <Spinner variant={newColor ? 'success' :'light'} animation="border" role="status">
  
    </Spinner>
  );
}

export default Spinners;