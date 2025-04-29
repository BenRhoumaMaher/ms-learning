import React, { useState, useEffect, useRef } from 'react';
import { useMessageContext } from '../context/MessageContext';
import Picker from 'emoji-picker-react';
import happy from '../../../../assets/happy.png';

const MessageBox = () => {
    const {
        messages,
        joinRoom,
        sendMessage,
        currentRoom,
        friends,
        setSelectedFriend,
        loadFriends,
    } = useMessageContext();

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const currentUser = token ? JSON.parse(atob(token.split('.')[1])) : null;

    const [messageInput, setMessageInput] = useState('');
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        loadFriends();
    }, [loadFriends]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (messageInput.trim() && currentRoom) {
            try {
                await sendMessage(messageInput);
                setMessageInput('');
            } catch (error) {
                console.error('Failed to send message:', error);
            }
        }
    };

    const handleRoomChange = (friend, roomId) => {
        setSelectedRoom(roomId);
        setSelectedFriend(friend);
        joinRoom(friend.id);
    };

    const onEmojiClick = (emojiData) => {
        setMessageInput((prev) => prev + emojiData.emoji);
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="col-lg-8">
            <div className="main-wraper">
                <h3 className="main-title">Messages</h3>
                <div className="message-box">
                    <div className="message-header">
                        {friends.map((friend, i) => (
                            <div
                                className={`useravatar ${selectedRoom === friend.roomId ? 'active' : ''}`}
                                key={i}
                                onClick={() => handleRoomChange(friend, friend.roomId)}
                            >
                                <img
                                    src={`http://localhost:8080/${friend.picture}`}
                                    alt={friend.username}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/150';
                                    }}
                                />
                                <span>{friend.lastname}</span>
                                {friend.status && (
                                    <div className={`status ${friend.status}`}></div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="message-content">
                        {selectedRoom ? (
                            <>
                                <div className="chat-header">
                                    <h6>
                                        {friends.find((f) => f.roomId === selectedRoom)?.lastname || 'Chat'}
                                    </h6>
                                </div>

                                <div className="chat-content">
                                    <ul className="chatting-area">
                                        {messages.map((message, index) => {
                                            const isSentMessage = message.senderId === currentUser?.user_id;

                                            return (
                                                <li key={index} className={isSentMessage ? 'me' : 'you'}>
                                                    <figure>
                                                        <img
                                                            src={`http://localhost:8080/${message.picture}`}
                                                            alt={message.sender}
                                                            onError={(e) => {
                                                                e.target.src = 'https://via.placeholder.com/150';
                                                            }}
                                                        />
                                                    </figure>
                                                    <small className="me-2">
                                                        {new Date(message.createdAt).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </small>
                                                    <p className={isSentMessage ? 'bg-success' : 'bg-danger text-black'}>
                                                        {message.content}
                                                    </p>
                                                </li>
                                            );
                                        })}
                                        <div ref={messagesEndRef} />
                                    </ul>

                                    <div className="message-text-container">
                                        {showEmojiPicker && (
                                            <div className="emoji-picker">
                                                <Picker
                                                    onEmojiClick={onEmojiClick}
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: '60px',
                                                        right: '10px',
                                                        zIndex: 100,
                                                    }}
                                                />
                                            </div>
                                        )}
                                        <form onSubmit={handleSendMessage}>
                                            <span
                                                className="emojie"
                                                onClick={() => setShowEmojiPicker((prev) => !prev)}
                                            >
                                                <img src={happy} alt="smile" />
                                            </span>
                                            <textarea
                                                rows="1"
                                                placeholder="say something..."
                                                value={messageInput}
                                                onChange={(e) => setMessageInput(e.target.value)}
                                            />
                                            <button type="submit" title="send">
                                                <i className="fa fa-send"></i>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="no-room-selected">
                                <p>Select a chat to start messaging</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageBox;
