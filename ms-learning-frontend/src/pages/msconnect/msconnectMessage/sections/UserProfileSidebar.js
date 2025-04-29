import React from 'react';
import { useMessageContext } from '../context/MessageContext';

const UserProfileSidebar = () => {
    const { selectedFriend } = useMessageContext();

    if (!selectedFriend) return null;

    return (
        <div className="col-lg-4">
            <div className="profile-short">
                <div className="chating-head">
                    <div className="s-left">
                        <h5>{selectedFriend.firstname} {selectedFriend.lastname}</h5>
                        <p>{selectedFriend.address}</p>
                    </div>
                </div>

                <div className="short-intro">
                    <figure>
                        <img
                            src={`http://localhost:8080/${selectedFriend.picture}`}
                            alt={`${selectedFriend.firstname}'s profile`}
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/150';
                            }}
                        />
                    </figure>
                    <ul>
                        <li>
                            <span>Display Name</span>
                            <p>{selectedFriend.username || selectedFriend.firstname}</p>
                        </li>
                        <li>
                            <span>Email Address</span>
                            <p>{selectedFriend.email || 'Not specified'}</p>
                        </li>
                        <li>
                            <span>Phone Number</span>
                            <p>{selectedFriend.phone || 'Not specified'}</p>
                        </li>
                    </ul>
                    <a className="button primary circle me-4" href={`/msconnect-profile/${selectedFriend.id}`} title="view profile">
                        View Profile
                    </a>
                </div>
            </div>
        </div>
    );
};

export default UserProfileSidebar;