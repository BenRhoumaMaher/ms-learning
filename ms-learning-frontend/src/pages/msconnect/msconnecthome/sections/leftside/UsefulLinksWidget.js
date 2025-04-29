import React from 'react';
import { Link } from 'react-router-dom';

const UsefulLinksWidget = () => {
    const isAuthenticated =
        localStorage.getItem('token') || sessionStorage.getItem('token');
    const user = isAuthenticated
        ? JSON.parse(atob(isAuthenticated.split('.')[1]))
        : null;
    const userId = user?.user_id || null;

    const links = [
        { label: 'explore', to: '/' },
        { label: 'career', to: '/become-instructor' },
        { label: 'notfications', to: '/notifications' },
        { label: 'settings', to: '/account-settings' },
        { label: 'profile', to: `/msconnect/profile/${userId}` },
    ];

    return (
        <div className="widget web-links stick-widget">
            <h4 className="widget-title">
                Useful Links <Link to="/" className="see-all">See All</Link>
            </h4>
            <ul>
                {links.map((link, index) => (
                    <li key={index}>
                        <i className="fa fa-angle-right"></i>{' '}
                        <Link to={link.to} title="">{link.label}</Link>
                    </li>
                ))}
            </ul>
            <p>&copy; MS-LEARNING {new Date().getFullYear()} All Rights Reserved.</p>
        </div>
    );
};

export default UsefulLinksWidget;
