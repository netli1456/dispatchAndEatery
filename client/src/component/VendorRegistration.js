import React, { useEffect, useRef, useState } from 'react';
import Form from 'react-bootstrap/Form';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import Button from 'react-bootstrap/Button';
import { useSelector } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { api, useFingerprint } from '../utils/apiConfig';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

function VendorRegistration(props) {
  const [placesCanDeliverTo, setPlacesCanDeliverTo] = useState([]);
  const [businessImg, setBusinessImg] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [physicalAddress, setPhysicalAddress] = useState('');
  const [businessName, setBusinessName] = useState('');
  const { userInfo } = useSelector((state) => state.user);

  const [previewImage, setPreviewImage] = useState('');
  const fileInputRef = useRef(null);
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const fingerprint = useFingerprint();
  const location = useLocation();

  const { setUploadOpen } = props;

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1000);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setBusinessImg(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreviewImage('');
    setBusinessImg(null);
  };

  const handleUploadProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('businessImg', businessImg);
    formData.append('businessName', businessName);
    formData.append('physicalAddress', physicalAddress);
    formData.append('placesCanDeliverTo', JSON.stringify(placesCanDeliverTo));

    try {
      const { data } = await axios.post(
        `${api}/api/users/vendor/${fingerprint}/registration/${userInfo?.user?._id}`,
        formData
      );

      setData(data);

      toast.success(
        <div>
          <p>Registration successful!</p>
        </div>,
        { autoClose: true }
      );
    } catch (error) {
      console.error('Error during form submission:', error);
    }
  };

  useEffect(() => {
    const handleViewProduct = () => {
      if (data?._id) {
        navigate(`/kitchen/${data?._id}`);
        toast.dismiss();
      }
    };
    handleViewProduct();
  });

  const addPlace = () => {
    if (newContent.trim() !== '') {
      setPlacesCanDeliverTo((prevPlaces) => [...prevPlaces, newContent.trim()]);
      setNewContent('');
    }
  };

  const handleClose = () => {
    const params = new URLSearchParams(location.search);
    const openUpload = params.get('openUpload');
    
    if (openUpload === 'true') {
      params.set('openUpload', 'false');
      navigate({ search: params.toString() });
    }
    setUploadOpen(false);
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center flex-column"
      style={{ width: '100%' }}
    >
      <div className="my-3">
        <h3 className="bg-success text-white px-4 rounded py-2">
          Vendor Registration
        </h3>
      </div>

      <div style={{ width: isSmallScreen ? '95% ' : '40%' }}>
        <span
          className="text-primary fw-bold d-flex align-items-center"
          style={{
            position: 'absolute',
            cursor: 'pointer',
            top: 10,
            left: !isSmallScreen ? '20%' : '5%',
          }}
          onClick={handleClose}
        >
          <ArrowBackIosNewIcon />
          Back
        </span>
        <form onSubmit={handleUploadProduct} encType="multipart/form-data">
          <div className="d-flex align-items-center justify-content-center">
            <div
              style={{
                height: '100px',
                border: '1px solid grey',
                cursor: 'pointer',
                position: 'relative',
                width: '100px',
                borderRadius: '50%',
              }}
              className="d-flex align-items-center flex-column justify-content-center  mb-3"
              onClick={() => fileInputRef.current.click()}
            >
              {previewImage ? (
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <img
                    src={previewImage}
                    alt="Preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '50%',
                      border: '1px solid grey',
                    }}
                  />
                  <DeleteIcon
                    style={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      cursor: 'pointer',
                      color: 'red',
                    }}
                    onClick={removeImage}
                  />
                </div>
              ) : (
                <Button
                  variant="light"
                  style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                  className="d-flex align-items-center justify-content-center flex-column"
                >
                  <LibraryAddIcon />
                  <strong>Business Photo</strong>
                </Button>
              )}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            name="businessImg"
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleFileChange}
          />

          <div>
            <Form.Label className="fw-bold">Shop Name*</Form.Label>
            <Form.Control
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="borders"
            />
          </div>
          <div>
            <Form.Label className="fw-bold">Physical Address*</Form.Label>
            <Form.Control
              value={physicalAddress}
              onChange={(e) => setPhysicalAddress(e.target.value)}
              className="borders"
              type="text"
            />
          </div>

          <div className="d-flex flex-column my-3">
            <Form.Label className="fw-bold border-secondary border-bottom">
              Places you can deliver to*
            </Form.Label>

            <ListGroup>
              {placesCanDeliverTo?.map((place, index) => (
                <ListGroup.Item key={index}>{place}</ListGroup.Item>
              ))}
            </ListGroup>
            <Form.Control
              type="text"
              value={newContent}
              className="borders"
              placeholder="e.g City, Area"
              onChange={(e) => setNewContent(e.target.value)}
            />
            <div>
              <Button
                disabled={newContent.length <= 1}
                variant="success"
                className="mt-2"
                onClick={addPlace}
              >
                Add places
              </Button>
            </div>
          </div>
          <div className="text-center ">
            <Button type="submit" className="fw-bold px-5" variant="success">
              SUBMIT
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VendorRegistration;
