import { useEffect, useRef, useState } from 'react';
import { IChat } from '../common/interfaces';

const useWebSocket = (url: string, history?: IChat[]) => {
  const wsRef = useRef<WebSocket | null>(null);

  const [messages, setMessages] = useState<IChat[]>(history || []);

  const sendMessage = (message: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  };

  useEffect(() => {
    if (history) {
      setMessages(history);
    }
  }, [history]);

  useEffect(() => {
    wsRef.current = new WebSocket(url);

    wsRef.current.onopen = () => console.log('WebSocket connected');
    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [
        ...prev,
        {
          id: data.data.id,
          content: data.data.content,
          senderEmail: data.data.senderEmail,
          senderName: data.data.senderName,
          timestamp: data.data.timestamp,
        },
      ]);
    };
    wsRef.current.onerror = (error) => console.log('WebSocket error:', error);
    wsRef.current.onclose = () => console.log('WebSocket disconnected');

    return () => wsRef.current?.close();
  }, [url]);

  return { messages, sendMessage };
};

export default useWebSocket;
