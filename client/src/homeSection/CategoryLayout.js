import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SetMealIcon from '@mui/icons-material/SetMeal';
import TakeoutDiningIcon from '@mui/icons-material/TakeoutDining';
import './homePage.css'; // Adjust the path as needed
import { NearMe, DinnerDining, RiceBowl, Icecream } from '@mui/icons-material'; // Replace with actual icons
import Button from 'react-bootstrap/Button';
import { useSelector } from 'react-redux';

function CategoryLayout(props) {
  const categories = [
    {
      name: 'Grilled',
      icon: <NearMe />,
      position: { top: '5%', left: '32%' },
    },
    {
      name: 'Sea-Food',
      icon: <SetMealIcon />,
      position: { top: '28%', left: '62%' },
    },
    {
      name: 'Desert',
      icon: <DinnerDining />,
      position: { top: '63%', left: '55%' },
    },

    {
      name: 'Local',
      icon: <RiceBowl />,
      position: { top: '63%', left: '12%' },
    },
    {
      name: 'Ice-cream',
      icon: <Icecream />,
      position: { top: '28%', left: '3%' },
    },
    {
      name: 'Swallow',
      icon: <TakeoutDiningIcon />,
      position: { top: '36%', left: '33%' },
    }, // Center item
  ];

  const navigate = useNavigate();
  const { searchedLocation } = useSelector((state) => state.searching);
  const { setOpen } = props;
  const [isSmallScreen, setIsSmallScreen] = useState(false);


  const handleFilter = (filterData) => {
    if (filterData !== 'Near me') {
      navigate(`/search?&popularFilter=${filterData}`);
    } else {
      if (searchedLocation) {
        navigate(`/search?&searchedLocation=${searchedLocation}`);
      } else {
        setOpen(true);
      }
    }
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);


  return (
    <div>
      <div className="category-container " style={{position:"relative", height: isSmallScreen ? "50vh" : ''}}>
        {categories.map((category, index) => (
          <Button
            onClick={() => handleFilter(category.name)}
            variant="grey"
            key={index}
            className={`category-item text-white bt  fw-bold `}
            style={category.position}
          >
            <div className="category-icon">{category.icon}</div>
            <div>{category.name}</div>
          </Button>
        ))}
      </div>
    </div>
  );
}

export default CategoryLayout;
