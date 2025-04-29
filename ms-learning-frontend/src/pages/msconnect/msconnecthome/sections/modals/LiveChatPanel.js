import React, { useState } from 'react';

const LiveChatPanel = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('all');

    if (!isOpen) return null;

    const renderTabUsers = (tab) => {
        switch (tab) {
            case 'all':
                return ['Oliver', 'Amelia', 'George', 'Jacob', 'Poppy', 'Sophia', 'Leo king'].map((name, i) => (
                    <a href="/" key={i}>
                        <figure>
                            <img src={`images/resources/user${i + 1}.jpg`} alt={name} />
                            <span className="status online" />
                        </figure>
                        <span>{name}</span>
                        <i><img src={`images/resources/user${i + 1}.jpg`} alt="" /></i>
                    </a>
                ));
            case 'active':
                return ['Samu Jane', 'Tina Mark', 'Ak William'].map((name, i) => (
                    <a href="/" key={i}>
                        <figure>
                            <img src={`images/resources/user${i + 1}.jpg`} alt={name} />
                            <span className="status online" />
                        </figure>
                        <span>{name}</span>
                        <i><img src={`images/resources/user${i + 1}.jpg`} alt="" /></i>
                    </a>
                ));
            case 'groups':
                return ['Boys World', 'KK university Fellows', 'Education World'].map((group, i) => (
                    <a href="/" key={i}>
                        <figure className="group-chat">
                            <img src={`images/resources/user${i + 2}.jpg`} alt="" />
                            <img className="two" src={`images/resources/user${i + 1}.jpg`} alt="" />
                            <span className="status online" />
                        </figure>
                        <span>{group}</span>
                        <i className="icofont-check-circled"></i>
                    </a>
                ));
            default:
                return null;
        }
    };

    return (
        <div className="chat-box">
            <div className="chat-head">
                <h4>New Messages</h4>
                <span className="clozed" onClick={onClose}><i className="icofont-close-circled"></i></span>
                <form method="post">
                    <input type="text" placeholder="To.." />
                </form>
            </div>

            <div className="user-tabs">
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <a href="#all" className={activeTab === 'all' ? 'active' : ''} onClick={() => setActiveTab('all')}>All Friends</a>
                    </li>
                    <li className="nav-item">
                        <a href="#active" className={activeTab === 'active' ? 'active' : ''} onClick={() => setActiveTab('active')}>Active</a>
                        <em>3</em>
                    </li>
                    <li className="nav-item">
                        <a href="#groups" className={activeTab === 'groups' ? 'active' : ''} onClick={() => setActiveTab('groups')}>Groups</a>
                    </li>
                </ul>

                <div className="tab-content">
                    <div className="tab-pane active fade show">
                        <div className="friend">{renderTabUsers(activeTab)}</div>
                    </div>
                </div>
            </div>

            <div className="chat-card">
                <div className="chat-card-head">
                    <img src="images/resources/user13.jpg" alt="" />
                    <h6>George Floyd</h6>
                    <div className="frnd-opt">
                        <span className="close-mesage" onClick={onClose}><i className="icofont-close"></i></span>
                    </div>
                </div>

                <div className="chat-list">
                    <ul>
                        <li className="me">
                            <div className="chat-thumb"><img src="images/resources/chatlist1.jpg" alt="" /></div>
                            <div className="notification-event">
                                <span className="chat-message-item">Hi! Got the food?</span>
                                <span className="notification-date">Yesterday at 8:10pm <i><img src="images/d-tick.png" alt="" /></i></span>
                            </div>
                        </li>
                        <li className="you">
                            <div className="chat-thumb"><img src="images/resources/chatlist2.jpg" alt="" /></div>
                            <div className="notification-event">
                                <span className="chat-message-item">Yep! All good.</span>
                                <span className="notification-date">Yesterday at 8:11pm <i><img src="images/d-tick.png" alt="" /></i></span>
                            </div>
                        </li>
                    </ul>

                    <form className="text-box">
                        <textarea placeholder="Write Message..." />
                        <div className="add-smiles">
                            <span><img src="images/smiles/happy-3.png" alt=":)" /></span>
                        </div>
                        <div className="smiles-bunch">
                            {['thumb', 'angry-1', 'bored-1', 'wink'].map((smile, i) => (
                                <i key={i}><img src={`images/smiles/${smile}.png`} alt="" /></i>
                            ))}
                        </div>
                        <button type="submit"><i className="icofont-paper-plane"></i></button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LiveChatPanel;
