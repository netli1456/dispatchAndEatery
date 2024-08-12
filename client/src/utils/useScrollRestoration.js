import { useEffect } from 'react';

function useScrollRestoration({loading, product}) {
  useEffect(() => {
   
    if (window.location === `/product${product._id}` && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    if (loading) {
      window.scrollTo(0, 0);

      document.body.style.overflowY = 'scroll';
    } else {
      document.body.style.overflowY = 'scroll';
    }

    return () => {
      document.body.style.overflowY = 'scroll';
    };
  }, [loading]);
}

export default useScrollRestoration;
