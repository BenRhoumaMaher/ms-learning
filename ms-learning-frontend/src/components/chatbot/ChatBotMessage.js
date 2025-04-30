import React from 'react';

const ChatBotMessage = ({ message, isUser, timestamp }) => {
    const bgColor = isUser ? 'bg-primary' : 'bg-success';
    const alignment = isUser ? 'justify-content-end' : 'justify-content-start';

    return (
        <div className={`d-flex ${alignment}`}>
            <div className={`${bgColor} text-white p-3 rounded-4`} style={{ maxWidth: '80%' }}>
                <p className="mb-0 text-white">{message}</p>
                <small className="d-block text-end opacity-75 mt-1">
                    {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </small>
            </div>
        </div>
    );
};

export default ChatBotMessage;