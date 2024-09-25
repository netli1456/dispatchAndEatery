import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './homeSection/HomePage';
import Product from './singlePageSection/Product';
import Cart from './cartSection/Cart';
import Kitchen from './kitchenSection/Kitchen';
import SearchScreen from './dalle/SearchScreen';
import RidersPage from './dispatchRiders/RidersPage';
import RiderCard from './dispatchRiders/RiderCard';
import Profile from './profile/Profile';
import Order from './orderPage/Order';
import SignIn from './signIn/SignIn';
import SignUp from './signUp/Signup';
import { ToastContainer } from 'react-toastify';
import Navbar from './navSection/Navbar';
import LocationPage from './dalle/LocationPage';
import OtpVerification from './signUp/OtpVerification';
import { useOpen } from './utils/isOpenState';
import axios from 'axios';
import EmailOtpForPassword from './signIn/EmailOtpForPassword';
import ChangePassword from './signIn/ChangePassword';
import Error from './utils/Error';
import VendorRegistration from './component/VendorRegistration';

function App() {
  const { isOpen, toggle } = useOpen();
  axios.defaults.withCredentials = true;

  return (
    <BrowserRouter>
      <div
        style={{
          width: '100%',
          position: isOpen ? 'relative' : '',
          height: isOpen ? '100vh' : '',
          overflow: isOpen ? 'hidden' : '',
        }}
      >
        <div style={{ position: 'sticky', width: '', top: 0, zIndex: 99999 }}>
          {' '}
          <Navbar openNow={isOpen} setOpenNow={toggle} />
        </div>
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          pauseOnHover
        />

        {isOpen && (
          <div
            style={{
              width: '100%',
              position: 'absolute',
              top: 0,
              height: '100vh',
              zIndex:999999999999
            }}
            className=" d-flex justify-content-center align-items-center locationBg"
          >
            <LocationPage setOpen={toggle} />
          </div>
        )}
        <Routes>
          <Route path="/" element={<HomePage setOpen={toggle} />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/kitchen/:id" element={<Kitchen />} />
          <Route path="/vendor" element={<VendorRegistration />} />
          <Route
            path="/search"
            element={<SearchScreen setOpenLocation={toggle} />}
          />

          <Route path="/riders" element={<RidersPage />} />
          <Route path="/rider/:id" element={<RiderCard />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/order/:id" element={<Order />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="/verification/:url/auth" element={<OtpVerification />} />

          <Route path="/recover/account" element={<EmailOtpForPassword />} />
          <Route
            path="/newpassword/change/:urlf/change"
            element={<ChangePassword />}
          />
          <Route path="*" element={<Error />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
