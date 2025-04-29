import React from 'react';

const ImageWithCommentsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal fade show" style={{ display: 'block' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">

                    <div className="modal-header">
                        <button type="button" className="close" onClick={onClose}>×</button>
                    </div>

                    <div className="modal-body">
                        <div className="row merged">
                            <div className="col-lg-9">
                                <div className="pop-image">
                                    <div className="pop-item">
                                        <div className="action-block">
                                            {['tag', 'map-pin', 'arrow-down', 'more-vertical'].map((icon, i) => (
                                                <a className="action-button" key={i} href="/">
                                                    <i className={`feather feather-${icon}`} />
                                                </a>
                                            ))}
                                        </div>

                                        <figure>
                                            <img src="images/resources/blog-detail.jpg" alt="Post content" />
                                        </figure>

                                        <div className="stat-tools">
                                            <div className="box">
                                                <div className="Like">
                                                    <a className="Like__link" href="/"><i className="icofont-like"></i> Like</a>
                                                    <div className="Emojis">
                                                        {['like', 'love', 'haha', 'wow', 'sad', 'angry'].map((e, i) => (
                                                            <div className={`Emoji Emoji--${e}`} key={i}>
                                                                <div className={`icon icon--${e}`}></div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <a href="/" className="share-to"><i className="icofont-share-alt"></i> Share</a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-3">
                                <div className="commentbar">
                                    <div className="user">
                                        <figure><img src="images/resources/user1.jpg" alt="user" /></figure>
                                        <div className="user-information">
                                            <h4><a href="/">Danile Walker</a></h4>
                                            <span>2 hours ago</span>
                                        </div>
                                        <a href="/" title="Follow">Follow</a>
                                    </div>

                                    <div className="we-video-info">
                                        <ul>
                                            <li><span className="liked"><i className="feather feather-thumbs-up" /><ins>52</ins></span></li>
                                            <li><span className="comment"><i className="feather feather-message-square" /><ins>52</ins></span></li>
                                            <li><span><a href="/"><i className="feather feather-share-2" /></a><ins>20</ins></span></li>
                                        </ul>

                                        <div className="users-thumb-list">
                                            {['userlist-1.jpg', 'userlist-2.jpg'].map((img, i) => (
                                                <a key={i} href="/" title=""><img src={`images/resources/${img}`} alt="" /></a>
                                            ))}
                                            <span><strong>You</strong>, <b>Sarah</b> and <a href="/">24+ more</a> liked</span>
                                        </div>
                                    </div>

                                    <div className="new-comment" style={{ display: 'block' }}>
                                        <form>
                                            <input type="text" placeholder="write comment" />
                                            <button type="submit"><i className="icofont-paper-plane"></i></button>
                                        </form>

                                        <div className="comments-area">
                                            <ul>
                                                {[
                                                    { name: 'Jack Carter', img: 'user1.jpg' },
                                                    { name: 'Ching xang', img: 'user2.jpg' },
                                                    { name: 'Danial Comb', img: 'user3.jpg' },
                                                    { name: 'Jack Carter', img: 'user4.jpg' },
                                                ].map((user, i) => (
                                                    <li key={i}>
                                                        <figure><img src={`images/resources/${user.img}`} alt="" /></figure>
                                                        <div className="commenter">
                                                            <h5><a href="/">{user.name}</a></h5>
                                                            <span>2 hours ago</span>
                                                            <p>
                                                                i think that some how, we learn who we really are and then live
                                                                with that decision, great post!
                                                            </p>
                                                        </div>
                                                        <a href="/"><i className="icofont-heart"></i></a>
                                                        <a href="/" className="reply-coment"><i className="icofont-reply"></i></a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ImageWithCommentsModal;
