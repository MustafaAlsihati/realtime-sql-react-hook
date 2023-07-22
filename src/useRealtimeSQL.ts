import { useEffect, useRef, useState, useCallback } from 'react';
import useInternetStatus from './useInternetStatus';

function useRealtimeSQL<T>(
  url: string,
  table: string,
  condition: string,
  params: any[] = [],
  {
    token,
    initState,
    enabled = true,
  }: { token?: string; initState?: T; enabled?: boolean } = {},
) {
  const internet = useInternetStatus();
  const webSocketRef = useRef<WebSocket | null>(null);

  const [state, setState] = useState(initState);

  const connectWebSocket = useCallback(() => {
    const _url = new URL(url);
    if (token) {
      _url.searchParams.set('token', token);
    }
    webSocketRef.current = new WebSocket(_url.toString());

    webSocketRef.current.onopen = () => {
      const payload = {
        table,
        condition,
        params,
      };
      webSocketRef.current?.send(JSON.stringify(payload));
    };

    webSocketRef.current.onmessage = (data: any) => {
      setState(JSON.parse(data) as T);
    };

    webSocketRef.current.onclose = () => {
      console.log('WebSocket connection closed.');
    };

    webSocketRef.current.onerror = error => {
      console.log('WebSocket error: ', error);
      webSocketRef.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (enabled && internet) {
      connectWebSocket();
      return () => {
        if (webSocketRef.current) {
          webSocketRef.current.close();
        }
      };
    }
    return () => {};
  }, [connectWebSocket, enabled, internet]);

  return state;
}

export default useRealtimeSQL;
