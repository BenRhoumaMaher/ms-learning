import React from 'react';
import { useChatbot } from '../../hooks/useChatbot';
import ChatbotIcon from '../../components/chatbot/ChatbotIcon';
import ChatbotsModal from '../../components/chatbot/ChatbotModal';

const ChatbotWidget = () => {
    const {
        isOpen,
        toggleModal,
        messages,
        newMessage,
        setNewMessage,
        handleSend,
        isLoading,
        error
    } = useChatbot();

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <>
            <ChatbotIcon onClick={toggleModal} />
            <ChatbotsModal
                isOpen={isOpen}
                toggleModal={toggleModal}
                messages={messages}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                handleSend={handleSend}
                isLoading={isLoading}
                error={error}
                onKeyPress={handleKeyPress}
            />
        </>
    );
};

export default ChatbotWidget;