import { Box, Skeleton } from '@mui/material';
import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

function AcctHistory(props) {
  const { history, userInfo, loadings } = props;
  return (
    <div>
    <ListGroup
      variant="flush"
      className="bg-white px-3 border border-grey rounded"
    >
      {loadings ? (
        <Box sx={{ pt: 0.5 }}>
          <Skeleton width="40%" height={50} />
          <Skeleton width={200} height={50} />
  
        </Box>
      ) : (
        <>
          {history && history?.length > 0 ? (
            history?.map((item, index) => (
              <ListGroup.Item className="mb-2 d-flex flex-column">
                <span
                  key={index}
                  className={
                    item?.buyerId === userInfo?.user._id
                      ? `text-success fw-bold`
                      : `fw-bold text-success`
                  }
                >
                  {item?.buyerId === userInfo?.user._id
                    ? `-N${item?.amount?.toFixed(2)}`
                    : `+N${item?.amount?.toFixed(2)}`}{' '}
                  {item?.buyerId === userInfo?.user?._id
                    ? `to  ${
                        item?.businessName?.length > 20
                          ? `${item?.businessName.slice(0, 20)}...`
                          : `${item?.businessName}`
                      } `
                    : ` from ${
                        item?.buyerName?.length > 9
                          ? `${item?.buyerName?.slice(0, 7)}...`
                          : `${item?.buyerName}`
                      }`}

                </span>
                <span>
                ordered at {item.createdAt.slice(11, 16)} /  Date {item?.createdAt.slice(0, 10)}
                            </span>
                            
              </ListGroup.Item>
            ))
          ) : (
            <ListGroup.Item className="mb-2">
              your history is empty
            </ListGroup.Item>
          )}
        </>
      )}
    </ListGroup>
    </div>
  );
}

export default AcctHistory;
