import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearLocation } from '../redux/searchSlice';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

function SearchBar(props) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const location = useLocation();
  const dispatch = useDispatch();

  const { bg, setOpen } = props;
  const { searchedLocation } = useSelector((state) => state.searching);

  const locationQuery = searchedLocation === undefined ? '' : searchedLocation;

  const handleSearch = (e) => {
    e.preventDefault();
    if (location.pathname === `/riders`) {
      navigate(query ? `/riders?query=${query}` : '/riders');
    } else {
      navigate(
        query
          ? `/search?searchedLocation=${locationQuery}&query=${query}`
          : '/search'
      );
    }
  };

  const handleClear = () => {
    dispatch(clearLocation());
    setQuery('')
  };

  return (
    <div style={{ width: '100%', position: 'relative' }} className="">
      <div
        className={
          bg
            ? 'search-ba py-3 d-none d-md-flex justify-content-center'
            : 'search-bar py-3 d-none d-md-flex flex-column justify-content-center'
        }
      >
        <InputGroup className="mb-3 searchba" style={{ width: '80%' }}>
          <Form.Control
            placeholder={
              location.pathname === '/'
                ? 'Search your location here !'
                : 'search by store name!'
            }
            aria-describedby="search"
            id="search"
            onChange={(e) => setQuery(e.target.value)}
            className="border border-success"
            readOnly={location.pathname === '/'}
            onClick={() => location.pathname === '/' && setOpen()}
          />
          <Button
            onClick={handleSearch}
            disabled={location.pathname !== '/' && !query}
            variant="success"
            id="basic-addon1"
            className=" text-white fw-bold d-flex align-items-center"
          >
            <SearchOutlinedIcon />
            Search
          </Button>
        </InputGroup>
        {!bg && searchedLocation && (
          <div className="me-auto " style={{ position: 'relative' }}>
            <Button
              variant="success"
              style={{ backgroundColor: 'inherit' }}
              className={!bg ? 'text-success px-3 mx-5 fw-bold' : ''}
            >
              {' '}
              You are viewing stores in {searchedLocation}{' '}
            </Button>
            <span style={{ position: 'absolute', cursor:'pointer', top:-2, right: 48 }}>
              <DeleteOutlineIcon onClick={handleClear}
                className="text-danger iconHover"
                style={{ width: '20px', height: '20px' }}
              />
            </span>
          </div>
        )}
      </div>
      <div
        className={
          bg
            ? 'd-md-none p-3 search-ba  d-flex justify-content-center'
            : 'd-md-none py-3 search-bar flex-column  d-flex justify-content-center'
        }
      >
        <InputGroup className=" searchba">
          <Form.Control
            placeholder="write something here!"
            aria-describedby="search"
            id="search"
            onChange={(e) => setQuery(e.target.value)}
            className="border border-success"
            readOnly={location.pathname === '/'}
            onClick={() => location.pathname === '/' && setOpen()}
          />
          <Button
            onClick={handleSearch}
            variant="success"
            disabled={location.pathname !== '/' && !query}
            className=" text-white border border-white fw-bold d-flex align-items-center"
          >
            <SearchOutlinedIcon />
          </Button>
        </InputGroup>
        {!bg && searchedLocation && (
          <div className="me-auto mt-2" style={{ position: 'relative' }}>
          <Button
            variant="success"
            style={{ backgroundColor: 'inherit' }}
            className={!bg ? 'text-success px-3 mx-5 fw-bold' : ''}
          >
            {' '}
            You are viewing stores in {searchedLocation}{' '}
          </Button>
          <span style={{ position: 'absolute', cursor:'pointer', top:-2, right: 48 }}>
            <DeleteOutlineIcon onClick={handleClear}
              className="text-danger iconHover"
              style={{ width: '20px', height: '20px' }}
            />
          </span>
        </div>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
