import { useEffect, useRef, useState, useCallback } from 'react';

function useRealtimeSQL<T>(
  url: string,
  query: string,
  params: string[] = [],
  { token, initState }: { token?: string; initState?: T } = {},
) {
  const webSocketRef = useRef<WebSocket | null>(null);

  const [state, setState] = useState(initState);

  const connectWebSocket = useCallback(() => {
    webSocketRef.current = new WebSocket(url);

    webSocketRef.current.onopen = () => {
      webSocketRef.current?.send(JSON.stringify({ query, params, token }));
    };

    webSocketRef.current.onmessage = data => {
      console.log({ data, type: typeof data });
      // setState(JSON.parse(data));
    };

    webSocketRef.current.onclose = () => {
      console.log('WebSocket connection closed. Reconnecting...');
      setTimeout(connectWebSocket, 1000);
    };

    webSocketRef.current.onerror = error => {
      console.log('WebSocket error: ', error);
      webSocketRef.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close();
      }
    };
  }, [connectWebSocket]);

  return state;
}

export default useRealtimeSQL;
