import React, { useState, useEffect, useRef } from 'react';
import { useMessageContext } from '../context/MessageContext';
import Picker from 'emoji-picker-react';
import happy from '../../../../assets/happy.png';
import { useTranslation } from 'react-i18next';

const MessageBox = () => {
    const { t } = useTranslation();
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
    const [targetLang, setTargetLang] = useState('fr');
    const [translatedMessages, setTranslatedMessages] = useState({});
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

    useEffect(() => {
        const translateAllMessages = async () => {
            if (!messages.length || !targetLang) return;

            const translations = {};
            for (const message of messages) {
                try {
                    const response = await fetch("http://localhost:8080/messages/translate", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        body: `text=${encodeURIComponent(message.content)}&lang=${targetLang}`
                    });

                    const data = await response.json();
                    if (data.status === 'success') {
                        translations[message.id] = data.translated;
                    }
                } catch (error) {
                    console.error('Translation failed for message:', message.id);
                }
            }
            setTranslatedMessages(translations);
        };

        translateAllMessages();
    }, [targetLang, messages]);

    const supportedLanguages = [
        { code: 'fr', name: 'French' },
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish' },
        { code: 'de', name: 'German' },
        { code: 'it', name: 'Italian' },
    ];

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
                                <div className="chat-header d-flex justify-content-between align-items-center">
                                    <h6>
                                        {friends.find((f) => f.roomId === selectedRoom)?.lastname || 'Chat'}
                                    </h6>
                                    <select
                                        className="form-select form-select-sm stylish-select"
                                        style={{
                                            width: '160px',
                                            border: '2px solid #198754',
                                            borderRadius: '6px',
                                            backgroundColor: '#f9f9f9',
                                            fontWeight: 'bold',
                                            color: '#333',
                                        }}
                                        value={targetLang}
                                        onChange={(e) => setTargetLang(e.target.value)}
                                    >
                                        <option selected>{t('Select A Language')}</option>
                                        {supportedLanguages.map((lang) => (
                                            <option key={lang.code} value={lang.code}>
                                                {lang.name}
                                            </option>
                                        ))}
                                    </select>
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
                                                    {translatedMessages[message.id] && (
                                                        <div className="small text-muted mt-1 fst-italic">
                                                            {translatedMessages[message.id]}
                                                        </div>
                                                    )}
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
                                                placeholder={t('say something...')}
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
                                <p>{t('Select a chat to start messaging')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageBox;
