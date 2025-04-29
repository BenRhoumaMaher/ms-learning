import React from 'react';

const ChatLiveButton = ({ chatCount = 7, onClick }) => {
    return (
        <div className="chat-live">
            <a className="chat-btn" href="/" title="Start Live Chat" onClick={onClick}>
                <i className="icofont-facebook-messenger"></i>
            </a>
            <span>{chatCount.toString().padStart(2, '0')}</span>
        </div>
    );
};

export default ChatLiveButton;
