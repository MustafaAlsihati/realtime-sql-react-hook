import { useEffect, useRef, useState, useCallback } from 'react';
import useInternetStatus from './useInternetStatus';

type OptionsProps<T> =
  | {
      token?: string;
      initState?: T;
      enabled?: boolean;
    }
  | undefined;

function useRealtimeSQL<T>(
  url: string,
  table: string,
  condition?: string,
  params: any[] = [],
  { token, initState, enabled = true }: OptionsProps<T> = {},
) {
  const internet = useInternetStatus();
  const webSocketRef = useRef<WebSocket | null>(null);
  const [state, setState] = useState(initState as T);

  const connectWebSocket = useCallback(() => {
    if (!url || !table || !condition) return;

    // * Url:
    const _url = new URL(url);
    if (token) {
      _url.searchParams.set('token', token);
    }
    // * Open WebSocket connection:
    webSocketRef.current = new WebSocket(_url.toString());

    // * Send Request data to WebSocket server:
    webSocketRef.current.onopen = () => {
      const payload = {
        table,
        condition,
        params,
      };
      webSocketRef.current?.send(JSON.stringify(payload));
    };

    // * Receive Response data from WebSocket server:
    webSocketRef.current.onmessage = (data: MessageEvent<string>) => {
      const result = JSON.parse(data?.data) as T;
      if (result && Array.isArray(result)) {
        setState(JSON.parse(data.data) as T);
      }
    };

    // * Handle WebSocket connection closed:
    webSocketRef.current.onclose = () => {
      console.log('WebSocket connection closed.');
    };

    // * Handle WebSocket error:
    webSocketRef.current.onerror = error => {
      console.log('WebSocket error: ', error);
      webSocketRef.current?.close();
    };
  }, [condition, params, table, token, url]);

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
