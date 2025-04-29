import React from 'react';

const SendMessageModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="popup-wraper">
            <div className="popup">
                <span className="popup-closed" onClick={onClose}>
                    <i className="icofont-close"></i>
                </span>
                <div className="popup-meta">
                    <div className="popup-head">
                        <h5>
                            <i>
                                <svg
                                    className="feather feather-message-square"
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    height="24"
                                    width="24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                </svg>
                            </i>{' '}
                            Send Message
                        </h5>
                    </div>
                    <div className="send-message">
                        <form method="post" className="c-form">
                            <input type="text" placeholder="Enter Name.." />
                            <input type="text" placeholder="Subject" />
                            <textarea placeholder="Write Message"></textarea>
                            <div className="uploadimage">
                                <i className="icofont-file-jpg"></i>
                                <label className="fileContainer">
                                    <input type="file" />
                                    Attach file
                                </label>
                            </div>
                            <button type="submit" className="main-btn">Send</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SendMessageModal;
