import React, { useEffect, useState } from 'react'
import { getPendingChatbotMessages, respondToChatbotMessage } from '../../helpers/api'
import Sidebar from '../../components/admin/Sidebar'

const ChatbotMessagesList = () => {
    const [messages, setMessages] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [responseTexts, setResponseTexts] = useState({})
    const [successMessage, setSuccessMessage] = useState('')
    const [error, setError] = useState('') // Added error state

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setIsLoading(true);
                setError(''); // Clear any previous errors
                const data = await getPendingChatbotMessages();
                setMessages(data.messages || []);
            } catch (error) {
                console.error('Failed to fetch messages:', error);
                setError('Failed to load messages. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMessages()
    }, [])

    const handleResponseChange = (messageId, value) => {
        setResponseTexts(prev => ({ ...prev, [messageId]: value }))
    }

    const handleSubmitResponse = async (messageId) => {
        const responseText = responseTexts[messageId];
        if (!responseText?.trim()) return;

        try {
            setIsLoading(true);
            setError(''); // Clear any previous errors
            await respondToChatbotMessage(messageId, responseText);
            setMessages(messages.filter(msg => msg.id !== messageId));
            setResponseTexts(prev => {
                const newResponses = { ...prev };
                delete newResponses[messageId];
                return newResponses;
            });
            setSuccessMessage('Response sent successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Failed to send response:', error);
            setError('Failed to send response. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='d-flex'>
            <Sidebar />

            <div className='flex-grow-1 p-3'>
                <h2>Pending Chatbot Messages</h2>

                {error && ( // Added error display
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        {error}
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setError('')}
                        ></button>
                    </div>
                )}

                {successMessage && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                        {successMessage}
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setSuccessMessage('')}
                        ></button>
                    </div>
                )}

                {isLoading ? (
                    <div className="text-center">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="alert alert-info">No pending messages</div>
                ) : (
                    <div className="list-group">
                        {messages.map(message => (
                            <div key={message.id} className="list-group-item mb-3">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h5 className="mb-1">From: {message.userName}</h5>
                                        <p className="mb-1"><strong>Email:</strong> {message.userEmail}</p>
                                        <p className="mb-1"><strong>Message:</strong> {message.message}</p>
                                        <small className="text-muted">Sent: {message.createdAt}</small>
                                    </div>
                                </div>

                                <div className="mt-3">
                                    <label htmlFor={`response-${message.id}`} className="form-label">Response:</label>
                                    <textarea
                                        id={`response-${message.id}`}
                                        className="form-control mb-2"
                                        rows="3"
                                        placeholder="Type your response here..."
                                        value={responseTexts[message.id] || ''}
                                        onChange={(e) => handleResponseChange(message.id, e.target.value)}
                                    />
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleSubmitResponse(message.id)}
                                        disabled={!responseTexts[message.id]?.trim() || isLoading}
                                    >
                                        {isLoading ? 'Sending...' : 'Send Response'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChatbotMessagesList