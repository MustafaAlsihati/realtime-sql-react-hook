import { useEffect, useState } from 'react';

export default function useInternetStatus() {
  const [connected, setConnected] = useState(true);

  useEffect(() => {
    const onSetOnline = () => setConnected(true);
    const onSetOffline = () => setConnected(false);

    function didMount() {
      if (typeof window !== 'undefined') {
        if (window.navigator.onLine) {
          onSetOnline();
        } else {
          onSetOffline();
        }
      }
    }

    didMount();

    window.addEventListener('online', onSetOnline);
    window.addEventListener('offline', onSetOffline);
    return () => {
      window.removeEventListener('online', () => {});
      window.removeEventListener('offline', () => {});
    };
  }, []);

  return connected;
}
