import React, { createContext, useContext, useState, useCallback } from 'react';
import { sendMessage as apiSendMessage, getMessages, fetchUserFollowings } from '../../../../helpers/api';
import { getCurrentUserId, getRoomId } from '../../../../helpers/messageHelpers';
import useMercureSubscriber from '../../../../hooks/useMercureSubscriber';

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useMercureSubscriber(currentRoom, setMessages);

    const loadFriends = useCallback(async () => {
        setIsLoading(true);
        try {
            const currentUserId = getCurrentUserId();
            if (!currentUserId) throw new Error('User not authenticated');

            const followings = await fetchUserFollowings(currentUserId);
            const formattedFriends = followings.map(friend => ({
                ...friend,
                roomId: getRoomId(currentUserId, friend.id),
                status: friend.isOnline ? 'online' : 'offline',
            }));

            setFriends(formattedFriends);
        } catch (err) {
            console.error('Failed to load friends:', err);
            setError('Could not load contacts');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const joinRoom = useCallback(async (friendId) => {
        if (!friendId) return;

        setIsLoading(true);
        try {
            const currentUserId = getCurrentUserId();
            const roomId = getRoomId(currentUserId, friendId);
            if (!roomId) throw new Error('Invalid room');

            const roomMessages = await getMessages(roomId);
            setMessages(roomMessages);
            setCurrentRoom(roomId);
        } catch (err) {
            console.error('Error joining room:', err);
            setError('Failed to join room');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const sendMessage = async (content) => {
        try {
            if (!currentRoom) throw new Error('No active room');
            const friendId = selectedFriend?.id;
            if (!friendId) throw new Error('No friend selected');

            const newMessage = await apiSendMessage(currentRoom, content, friendId);
            setMessages(prev => [...prev, newMessage]);
        } catch (err) {
            console.error('Failed to send message:', err);
            setError('Message failed to send');
        }
    };

    return (
        <MessageContext.Provider
            value={{
                messages,
                currentRoom,
                friends,
                selectedFriend,
                setSelectedFriend,
                joinRoom,
                sendMessage,
                isLoading,
                error,
                loadFriends,
            }}
        >
            {children}
        </MessageContext.Provider>
    );
};

export const useMessageContext = () => useContext(MessageContext);
