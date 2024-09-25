import React from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

function LoadingBox() {
  return (
    <div style={{ width: '95vw', margin: 'auto' }} className="mt-2">
      <ResponsiveMasonry
        columnsCountBreakPoints={{
          300: 1,
          350: 2,
          750: 4,
          1000: 6,
        }}
      >
        <Masonry gutter="10px">
          {Array.from(new Array(18)).map((_, index) => (
            <div key={index} >
              <div>
                <Skeleton variant="rectangular" height={200} />
                <Box sx={{ pt: 0.5 }}>
                  <Skeleton />
                  <Skeleton width="60%" />
                </Box>
              </div>
            </div>
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
}

export default LoadingBox;
