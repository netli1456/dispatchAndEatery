import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { useEffect, useState } from 'react';

// export const api = 'https://mbiteapi.onrender.com';

const isCapacitor = window.Capacitor !== undefined; 
export const api = isCapacitor
  ? 'https://biteapi.onrender.com'
  : 'https://biteapi.onrender.com';

// export const api = 'http://localhost:5000';

export const useFingerprint = () => {
  const [fingerprint, setFingerprint] = useState('');

  useEffect(() => {
    const getFingerprint = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setFingerprint(result.visitorId);
    };

    getFingerprint();
  }, []);

  return fingerprint;
};
