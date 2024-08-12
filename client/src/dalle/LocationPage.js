import React, { useEffect, useRef, useState } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Skeleton } from '@mui/material';
import ListGroup from 'react-bootstrap/ListGroup';
import SearchIcon from '@mui/icons-material/Search';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Button from 'react-bootstrap/esm/Button';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { api } from '../utils/apiConfig';
import { useDispatch, useSelector } from 'react-redux';
import { clearLocation, searchAddress } from '../redux/searchSlice';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function LocationPage(props) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const { setOpen } = props;
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState([6.5244, 3.3792]);
  const [zoom, setZoom] = useState(13);
  const mapRef = useRef(null);
  const [zoomMapdata, setZoomMapData] = useState('');
  const [exist, setExist] = useState('');
  const { searchedLocation } = useSelector((state) => state.searching);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1200);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);
    setExist('');
    if (value?.length > 2) {
      setLoading(true);
      try {
        const normalizedQuery = value.toLowerCase();
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            normalizedQuery
          )}`
        );
        const formattedSuggestions = response.data.map((suggestion) => {
          const addressParts = suggestion.display_name.split(',');
          const relevantParts = addressParts
            .slice(-3)
            .map((part) => part.trim())
            .join(', ');
          return {
            ...suggestion,
            display_name: relevantParts,
          };
        });

        setSuggestions(formattedSuggestions);

        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 429) {
          toast.error('too many requests', {
            autoClose: 3000,
            theme: 'light',
            toastId: 'unique-toast-id',
          });
        } else {
          toast.error('failed loading suggestions ', {
            
            theme: 'light',
            toastId: 'unique-toast-id',
          });
        }
        setLoading(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    const display_name = suggestion?.display_name || query;
    const lat = parseFloat(suggestion?.lat);
    const lon = parseFloat(suggestion?.lon);

    if (display_name) {
      setQuery(display_name);
      setSuggestions([]);

      if (!isNaN(lat) && !isNaN(lon)) {
        setMapCenter([lat, lon]);
        setZoom(15);
        if (mapRef.current) {
          mapRef.current.setView([lat, lon], 15);
        }
      }

      try {
        const storeExist = await axios.get(
          `${api}/api/users/location?query=${display_name}`
        );

        if (storeExist.data === 'store exist') {
          dispatch(searchAddress(display_name));
          navigate(`/search?searchedLocation=${display_name}`);
          setExist(storeExist.data);
          setOpen(false);
        } else {
          setExist(storeExist.data);
        }
      } catch (error) {
        toast.error('something went wrong');
      }
    }
  };

  const MapEvents = () => {
    const map = useMapEvents({
      moveend: () => {
        const center = map.getCenter();
        const lat = center.lat;
        const lon = center.lng;

        axios
          .get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          )
          .then((response) => {
            setZoomMapData(response.data.display_name);
            setQuery(response.data.display_name);
            setMapCenter([lat, lon]);
            setExist('');
          })
          .catch((error) => {
            console.error('Error fetching location name:', error);
          });
      },
    });

    return null;
  };

  const handleClearQuery = () => {
    setQuery('');
    setExist('');
    setSuggestions([]);
    setZoomMapData('');
  };

  const handleClear = () => {
    dispatch(clearLocation());
  };

  return (
    <div
      className="location rounded"
      style={{
        width: isSmallScreen ? '100%' : '70%',
        height: isSmallScreen ? '100%' : '96%',
        margin: 'auto',
        overflow: 'hidden',
      }}
    >
      <div className="m-4 d-flex align-items-center  text-dark">
        <ArrowBackIosIcon
          className="text-secondary cursors"
          onClick={() => setOpen(false)}
        />
        <div className="text-center w-100">
          {' '}
          <h3 className="ms-2 text-center">Add a delivery address</h3>
        </div>
      </div>
      <Row className="" style={{ height: '80%' }}>
        <Col md={6} className="">
          <InputGroup className="input-group-no-border mx-3">
            <AddLocationAltIcon className="text-success" />
            <Form.Control
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="search for cities, street district..."
              className="input-no-border"
              style={{ maxWidth: '80%' }}
            />
            {query?.length > 0 && (
              <CloseIcon
                onClick={handleClearQuery}
                className="text-secondary cursors"
              />
            )}
          </InputGroup>

          <div>
            {' '}
            <ListGroup
              variant="flush"
              className={suggestions?.length > 0 ? ' locationB p-2' : ' p-2'}
              style={{ maxHeight: '500px', overflowY: 'auto' }}
            >
              {loading && (
                <span>
                  <Skeleton width="60%" className="m-auto" />
                </span>
              )}

              {suggestions?.length > 0 ? (
                <div style={{ width: '80%', margin: 'auto' }}>
                  {suggestions?.map((suggestion) => (
                    <ListGroup.Item
                      key={suggestion.place_id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      style={{ cursor: 'pointer' }}
                    >
                      {suggestion?.display_name}
                    </ListGroup.Item>
                  ))}
                </div>
              ) : (
                <div className="d-flex flex-column justify-content-center">
                  {exist?.data !== 'store exist' && (
                    <span
                      style={{ width: 'fit-content', margin: 'auto' }}
                      className="text-danger fw-bold"
                    >
                      {exist}
                    </span>
                  )}
                  {query?.length > 2 &&
                    !loading &&
                    suggestions?.length === 0 && (
                      <Button
                        variant="light bg-success border border-grey"
                        style={{ width: 'fit-content', margin: 'auto' }}
                        className="fw-bold my-3 text-white"
                        onClick={() => handleSuggestionClick()}
                      >
                        <SearchIcon /> Search Location
                      </Button>
                    )}
                </div>
              )}
            </ListGroup>
          </div>
        </Col>
        <Col md={6}>
          {searchedLocation.length > 0 && (
            <div className="text-center ">
              <span>current-location</span>
              <div
                style={{ width: '90%', margin: 'auto' }}
                className="d-flex   text-secondary "
              >
                <div
                  className="border border-success rounded py-1 d-flex justify-content-center mb-3"
                  style={{ width: '90%' }}
                >
                  <strong className="text-uppercase text-secondary">
                    {searchedLocation.length > 0 && searchedLocation}
                  </strong>
                </div>
                <CloseIcon
                  style={{ cursor: 'pointer' }}
                  onClick={handleClear}
                />
              </div>
            </div>
          )}

          <div style={{ height: '70%' }} className="">
            <MapContainer
              center={mapCenter}
              zoom={zoom}
              style={{ height: '95%', width: '90%', margin: 'auto' }}
              whenCreated={(mapInstance) => {
                mapRef.current = mapInstance;
              }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              <Marker position={mapCenter}>
                <Popup>{query}</Popup>
              </Marker>
              <MapEvents />
            </MapContainer>
          </div>

          {zoomMapdata?.length > 0 && (
            <div className="d-flex gap-3 flex-column ">
              <span className=" text-succes fw-bold border-danger border-bottom">
                {zoomMapdata}
              </span>
              <Button
                onClick={() => {
                  handleSuggestionClick();
                }}
                variant="light"
                className="fw-bold mx-3 bg-success text-white"
              >
                Set As Current Location
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default LocationPage;
