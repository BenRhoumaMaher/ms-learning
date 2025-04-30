import React from 'react';

const ChatbotIcon = ({ onClick }) => (
    <div
        className="position-fixed bottom-0 end-0 m-4 bg-primary text-white rounded-circle p-3 shadow-lg d-flex align-items-center justify-content-center"
        style={{
            width: '60px',
            height: '60px',
            cursor: 'pointer',
        }}
        onClick={onClick}
    >
        <i className="bi bi-chat-dots" style={{ fontSize: '2.75rem' }}></i>
    </div>
);

export default ChatbotIcon;