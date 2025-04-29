import { useEffect, useState } from 'react';

const useMercureSubscriber = (roomId, setMessages) => {
    const [subscriber, setSubscriber] = useState(null);

    useEffect(() => {
        if (!roomId) return;

        const sub = new EventSource(
            `http://localhost:3001/.well-known/mercure?topic=/chat/${roomId}&jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXJjdXJlIjp7InN1YnNjcmliZSI6WyIvY2hhdC8yNyJdfSwiZXhwIjoyMDAwMDAwMDAwfQ.Gkk2o7hAdFWxdABz6ns-6oQrd3rIm-gVRFTb5Sfw6GE`
        );

        sub.onmessage = (event) => {
            const incoming = JSON.parse(event.data);
            setMessages(prev => [...prev, incoming]);
        };

        setSubscriber(sub);

        return () => {
            sub.close();
        };
    }, [roomId, setMessages]);

    return subscriber;
};

export default useMercureSubscriber;
