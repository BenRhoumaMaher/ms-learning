import { useState } from 'react';

const useNotification = () => {
    const [notification, setNotification] = useState({ type: '', message: '' });

    const showNotification = (type, message, duration = 4000) => {
        setNotification({ type, message });
        setTimeout(() => {
            setNotification({ type: '', message: '' });
        }, duration);
    };

    return { notification, showNotification };
};

export default useNotification;
