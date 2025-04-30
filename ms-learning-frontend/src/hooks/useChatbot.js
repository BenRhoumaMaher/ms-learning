import { useState, useEffect } from 'react';
import {
    sendChatbotMessage,
    getUserChatbotMessages,
    markChatbotMessageAsRead,
} from '../helpers/api';

export const useChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const toggleModal = () => setIsOpen(!isOpen);

    const fetchMessages = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getUserChatbotMessages();
            setMessages(data);

            for (const msg of data) {
                if (!msg.isRead) {
                    await markChatbotMessageAsRead(msg.id);
                }
            }
        } catch (err) {
            setError(err.message);
            console.error('Failed to fetch or mark messages as read', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = async () => {
        if (!newMessage.trim()) return;

        setIsLoading(true);
        setError(null);
        try {
            const sent = await sendChatbotMessage(newMessage);
            setMessages(prev => [...prev, sent]);
            setNewMessage('');
        } catch (err) {
            setError(err.message);
            console.error('Failed to send message', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) fetchMessages();
    }, [isOpen]);

    return {
        isOpen,
        toggleModal,
        messages,
        newMessage,
        setNewMessage,
        handleSend,
        isLoading,
        error
    };
};