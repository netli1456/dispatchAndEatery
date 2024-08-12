import React, { useEffect, useState } from 'react';
import Map from '../component/Map';
import Navbar from '../navSection/Navbar';
import Footer from '../footerSection/Footer';
import SearchedItems from '../dalle/SearchedItems';
import { Link, useLocation } from 'react-router-dom';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import Container from 'react-bootstrap/esm/Container';
import axios from 'axios';
import { api } from '../utils/apiConfig';



function RidersPage() {
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const query = sp.get('query') || '';
  const page = sp.get('page') || 1;
  const [riders, setRiders] = useState([]);

  useEffect(() => {
    const handleSearch = async () => {
      try {
        const { data } = await axios.get(
          `${api}/api/users/riders?query=${query}&page=${page}`
        );
      
        setRiders(data);
      } catch (error) {
        console.log(error);
      }
    };
    handleSearch();
  }, [query, page]);
  return (
    <div>
      <Navbar />
      <Map />
      <div className="search-results">
        <p className="fw-bold fs-5">
          ({riders?.length}) Riders found near you{' '}
        </p>
      </div>
      <Container>
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 2 }}>
          <Masonry>
            {riders?.map((item, index) => (
              <Link
                to={`/rider/${item._id}`}
                className="text-decoration-none listings border-bottom  p-2"
                key={index}
              >
                {' '}
                <SearchedItems item={item} />
              </Link>
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </Container>

      <div className="navigation-button">
        <button className="button1">see more</button>
      </div>
      <Footer />
    </div>
  );
}

export default RidersPage;
