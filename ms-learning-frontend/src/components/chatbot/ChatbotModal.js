import React from 'react';
import ChatMessage from './ChatBotMessage';

const ChatbotsModal = ({
    isOpen,
    toggleModal,
    messages,
    newMessage,
    setNewMessage,
    handleSend,
    isLoading,
    error,
    onKeyPress
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="position-fixed bottom-0 end-0 m-4 rounded-3 shadow-lg bg-white"
            style={{ width: '350px', height: '500px', zIndex: 1050 }}
        >
            <div className="d-flex justify-content-between align-items-center p-3 bg-primary text-white rounded-top-3">
                <h5 className="mb-0">MS-LEARNING Chatbot Assistant</h5>
                <button
                    className="btn btn-sm btn-outline-light"
                    onClick={toggleModal}
                    disabled={isLoading}
                >
                    <i className="bi bi-x-lg"></i>
                </button>
            </div>

            <div
                className="p-3 overflow-auto"
                style={{ height: 'calc(100% - 120px)' }}
            >
                <div className="d-flex flex-column gap-3">
                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}
                    {messages.map((msg, i) => (
                        <React.Fragment key={i}>
                            <ChatMessage
                                message={msg.message}
                                isUser={true}
                                timestamp={msg.createdAt}
                            />
                            {msg.response && (
                                <ChatMessage
                                    message={msg.response}
                                    isUser={false}
                                    timestamp={msg.respondAt}
                                />
                            )}
                        </React.Fragment>
                    ))}
                    {isLoading && (
                        <div className="text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-3 border-top">
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={onKeyPress}
                        placeholder="Type your message..."
                        disabled={isLoading}
                    />
                    <button
                        className="btn btn-primary mt-2"
                        onClick={handleSend}
                        disabled={!newMessage.trim() || isLoading}
                    >
                        {isLoading ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                            <i className="bi bi-send"></i>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatbotsModal;