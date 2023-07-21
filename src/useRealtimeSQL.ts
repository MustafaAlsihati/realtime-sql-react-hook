import { useEffect, useRef, useState, useCallback } from 'react';

function useRealtimeSQL<T>(
  url: string,
  query: string,
  params: string[] = [],
  {
    token,
    initState,
    enabled = true,
  }: { token?: string; initState?: T; enabled?: boolean } = {},
) {
  const webSocketRef = useRef<WebSocket | null>(null);

  const [state, setState] = useState(initState);

  const connectWebSocket = useCallback(() => {
    webSocketRef.current = new WebSocket(url);

    webSocketRef.current.onopen = () => {
      webSocketRef.current?.send(JSON.stringify({ query, params, token }));
    };

    webSocketRef.current.onmessage = (data: any) => {
      setState(JSON.parse(data) as T);
    };

    webSocketRef.current.onclose = () => {
      console.log('WebSocket connection closed. Reconnecting...');
      setTimeout(connectWebSocket, 2000);
    };

    webSocketRef.current.onerror = error => {
      console.log('WebSocket error: ', error);
      webSocketRef.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (enabled) {
      connectWebSocket();
      return () => {
        if (webSocketRef.current) {
          webSocketRef.current.close();
        }
      };
    }
    return () => {};
  }, [connectWebSocket, enabled]);

  return state;
}

export default useRealtimeSQL;
