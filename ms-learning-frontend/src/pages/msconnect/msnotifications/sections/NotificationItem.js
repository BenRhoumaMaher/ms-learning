import React, { useState } from 'react';
const NotificationItem = ({ avatar, message, iconClass, time }) => {
    const [removing, setRemoving] = useState(false);

    const handleRemove = () => {
        setRemoving(true);
        setTimeout(() => {
            const event = new CustomEvent('removeNotification', { detail: message });
            window.dispatchEvent(event);
        }, 300);
    };

    return (
        <li className={`notif-item ${removing ? 'fade-out' : ''}`}>
            <figure><img src={avatar} alt="User avatar" /></figure>
            <div className="notifi-meta">
                <p>{message}</p>
                <span><i className={iconClass}></i> {time}</span>
            </div>
            <i className="fa fa-close" title="Remove" onClick={handleRemove}></i>
        </li>
    );
};

export default NotificationItem;
