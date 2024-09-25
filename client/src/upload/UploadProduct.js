import React, { useEffect, useRef, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { useSelector } from 'react-redux';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { api, useFingerprint } from '../utils/apiConfig';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';

function UploadProduct(props) {
  const [category, setCategory] = useState('');
  const [visibility, setVisibility] = useState(<span > <PublicIcon/>Public </span> || '');
  const [type, setType] = useState('');
  const [contents, setContents] = useState([]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [price, setPrice] = useState('');
  const [desc, setDesc] = useState('');
  const [name, setName] = useState('');
  const { userInfo } = useSelector((state) => state.user);
  const [imgs, setImgs] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const fileInputRef = useRef(null);
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const fingerprint = useFingerprint();
  const {setUploadOpen, businessImg, businessName}=props

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
    const files = Array.from(e.target.files);

    if (files.length) {
      const fileReaders = [];
      const newPreviewImages = [...previewImages];

      const newFiles = [...imgs, ...files];

      files.forEach((file) => {
        if (newPreviewImages.length < 4) {
          const reader = new FileReader();
          reader.onloadend = () => {
            newPreviewImages.push(reader.result);
            fileReaders.push(reader);

            if (
              fileReaders.length === files.length ||
              newPreviewImages.length === 4
            ) {
              setPreviewImages(newPreviewImages);
              setImgs(newFiles);
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const handleDivClick = () => {
    if (previewImages.length < 4 && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeImage = (indexToRemove) => {
    setPreviewImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const dropdows = (items, selectedValue, setFunction) => {
    return (
      <Dropdown>
        <Dropdown.Toggle
          style={{
            backgroundColor:
             
                '#d3d3d3',
            color:
               '#000',
            borderColor: '#d3d3d3',
             
            width: '100%',
          }}
        >
          {selectedValue ? selectedValue : 'Select options'}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {items.map((item, index) => (
            <Dropdown.Item key={index} onClick={() => setFunction(item)}>
              {item}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  const handleContent = () => {
    if (newContent.trim() !== '') {
      setContents((prevContent) => [...prevContent, newContent]);
      setNewContent('');
    }
  };

  const handleUploadProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    imgs.forEach((img) => {
      formData.append('imgs', img);
    });

    formData.append('name', name);
    formData.append('type', type);
    formData.append('desc', desc);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('content', JSON.stringify(contents));
    formData.append('visibility', visibility);

    try {
      const { data } = await axios.post(
        `${api}/api/products/post/${fingerprint}?userId=${userInfo?.user?._id}`,
        formData
      );

      setData(data);

      toast.success(
        <div>
          <p>Upload successful!</p>
          <div className='d-flex align-items-center gap-2'><Button variant="success" className='mx-3' onClick={() => handleViewProduct()}>
            View Product
          </Button>
          <Button variant="danger" className='mx-3' onClick={() => handleCancel()}>
            Cancel
          </Button></div>
        </div>,
        { autoClose: false }
      );
    } catch (error) {
      console.error('Error during form submission:', error);
    }
  };

  const handleViewProduct = () => {
    if (data?._id) {
      navigate(`/product/${data._id}`);
      toast.dismiss();

    }
  };

  const handleCancel = () => {
    toast.dismiss();
  };

  return (
    <div
      className="d-flex  align-items-center justify-content-center flex-column"
      style={{ width: '100%' }}
    >
      <div className="my-4">
        <h3>Create post</h3>
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
          onClick={()=>setUploadOpen(false)}
        >
          <ArrowBackIosNewIcon />
          Back
        </span>
        <form onSubmit={handleUploadProduct} encType="multipart/form-data">
          <div className="d-flex align-items-center gap-2 mb-3">
            {businessImg  ? (
              <img
                alt=""
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50px',
                  border: '1px solid',
                }}
                src={
                 businessImg
                }
              />
            ) : (
              <AccountCircleIcon
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50px',
                  border: '1px solid',
                  opacity: '0.6',
                }}
              />
            )}

            <div>
              <strong className="text-capitalize">
                {businessName?.includes('restaurants' || 'shops' || 'restaurant' || 'shop' || 'market' || 'markets' || 'chops' || 'foods' || 'services' || 'chop'  || 'resturant'  || 'restarant'  || 'restarants'  || 'resturants') ? businessName : `${businessName} Shop`}
              </strong>
              {dropdows([<span className='d-fle p-0 m-0 '> <PublicIcon/>Public </span>, <span > <LockIcon/>only me</span>], visibility, setVisibility)}
            </div>
          </div>

          <div
            style={{
              height: '200px',
              border: '1px solid grey',
              cursor: 'pointer',
              position: 'relative',
            }}
            className="d-flex align-items-center flex-column justify-content-center rounded mb-3"
          >
            {previewImages.length > 0 ? (
              <div
                className="d-flex justify-content-around"
                style={{ width: '100%', height: '100%' }}
              >
                {previewImages.map((preview, index) => (
                  <div
                    key={index}
                    style={{
                      position: 'relative',
                      width:
                        previewImages.length === 1
                          ? '80%'
                          : previewImages.length === 2
                          ? '40%'
                          : previewImages.length === 3
                          ? '25%'
                          : '23%',
                      height: '100%',
                    }}
                  >
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
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
                      onClick={() => removeImage(index)}
                    />
                  </div>
                ))}
                {previewImages.length < 4 && (
                  <div
                    style={{
                      width: '23%',
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      border: '1px dashed grey',
                      cursor: 'pointer',
                    }}
                    onClick={handleDivClick}
                  >
                    <AddCircleOutlineIcon style={{ fontSize: '40px' }} />
                  </div>
                )}
              </div>
            ) : (
              <Button
                variant="light"
                onClick={handleDivClick}
                style={{ position: 'absolute', width: '100%', height: '100%' }}
                className="d-flex  align-items-center justify-content-center flex-column"
              >
                <LibraryAddIcon />
                <strong>Add Photos/Products</strong>
              </Button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            name="imgs"
            style={{ display: 'none' }}
            accept="image/*"
            multiple // Allow multiple file selection
            onChange={handleFileChange}
          />

          <div>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="borders"
            />
          </div>
          <div>
            <Form.Label>Description</Form.Label>
            <Form.Control
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="borders"
              type="text"
            />
          </div>
          <div>
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="borders"
            />
          </div>
          <div>
            <Form.Label>Category</Form.Label>
            {dropdows(
              ['Food', 'Beverages', 'Water', 'ice-cream'],
              category,
              setCategory
            )}
          </div>
          <div>
            <Form.Label>Type</Form.Label>
            {dropdows(
              [
                'Rice',
                'Pasta',
                'Swallow',
                'Snacks',
                'Desert',
                'Ice cream',
                'Meat',
                'Steaks',
                'Burger',
                'Pizza',
                'Shawarma',
                'water',
              ],
              type,
              setType
            )}
          </div>
          <div className="d-flex flex-column my-3">
            <Form.Label className="fw-bold border-secondary border-bottom">
              Contents
            </Form.Label>

            <ListGroup>
              {contents?.map((content, index) => (
                <ListGroup.Item key={index}>{content}</ListGroup.Item>
              ))}
            </ListGroup>
            <Form.Control
              type="text"
              value={newContent}
              className="borders"
              placeholder="e.g 2 portion of rice"
              onChange={(e) => setNewContent(e.target.value)}
            />
            <div>
              <Button
                disabled={newContent.length <= 1}
                variant="success"
                className="mt-2"
                onClick={handleContent}
              >
                Add content
              </Button>
            </div>
          </div>
          <div className="text-center ">
            <Button type="submit" className="fw-bold px-5" variant="success">
              UPLOAD
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadProduct;
