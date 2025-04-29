import React from 'react';
import { Link, useParams } from 'react-router-dom';

const UserProfileNav = () => {
    const { id } = useParams();

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    let currentUserId = null;

    if (token) {
        try {
            const payload = token.split('.')[1];
            if (payload) {
                const decoded = atob(payload);
                const parsed = JSON.parse(decoded);
                currentUserId = parsed?.user_id || null;
            }
        } catch (error) {
            console.error('Error parsing token:', error);
            currentUserId = null;
        }
    }

    const isCurrentUser = currentUserId && currentUserId.toString() === id;

    return (
        <div className="content--nav pb--30">
            <ul className="nav ff--primary fs--14 fw--500 bg-lighter">
                {isCurrentUser && (
                    <li><Link to={`/msconnect-profile/${id}/activity`}>Activity</Link></li>
                )}
                <li><Link to={`/msconnect-profile/${id}/profile`}>Profile</Link></li>
                <li><Link to={`/msconnect-profile/${id}/friends`}>Friends</Link></li>
                {isCurrentUser && (
                    <li><Link to={`/msconnect-profile/${id}/forum`}>Forum</Link></li>
                )}             
            </ul>
        </div>
    );
};

export default UserProfileNav;