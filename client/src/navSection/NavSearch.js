import React, { useState } from 'react';
import Navbar from '../navSection/Navbar';
import SearchBar from '../component/SearchBar';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Button from 'react-bootstrap/Button';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import './navbar.css';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useNavigate } from 'react-router-dom';

function NavSearch() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchOpen = () => {
    setSearchOpen(!searchOpen);
  };

  const handleQuery = () => {
    navigate(query ? `/search?query=${query}` : `/search`);
  };

  return (
    <div className={searchOpen ? 'Navsearchparent pt-5' : 'Navsearchparent  '}>
      {searchOpen && (
        <div
          className={
            'd-flex p-1 align-items-center  bg-success  d-md-none mobileSearchPosition'
          }
        >
          <SearchBar bg={true} />

          <KeyboardArrowLeftIcon
            onClick={handleSearchOpen}
            className="text-white borde fw-bold fs-1 searchcancel"
          />
        </div>
      )}

      {!searchOpen && <Navbar />}

      {!searchOpen && (
        <div className="d-md-none  searchOpenIcon" onClick={handleSearchOpen}>
          {' '}
          <Button
            variant="success"
            className="bg-light d-flex align-items-center border btn1"
          >
            <SearchOutlinedIcon className="text-black" />{' '}
            <KeyboardArrowRightIcon className="text-black"  />
          </Button>
        </div>
      )}
      <div className="  d-none d-md-block mdSearchBar">
        <div style={{ width: '100%' }}>
          <Form onSubmit={handleQuery}>
            <InputGroup className=" d-flex align-items-center">
              <Form.Control
                placeholder="write something here!"
                aria-describedby="search"
                id="search"
                className="border border-success"
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="new-password"
              />
              <Button
                variant="success"
                className=" text-white border border-white fw-bold d-flex align-items-center"
                type="submit"
                style={{ border: '1px solid white' }}
              >
                <SearchOutlinedIcon />
              </Button>
            </InputGroup>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default NavSearch;
