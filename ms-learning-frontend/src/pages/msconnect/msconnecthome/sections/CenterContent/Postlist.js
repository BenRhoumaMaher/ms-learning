import React from 'react';
import Modal from 'react-modal';
import usePostListData from '../../../../../hooks/usePostListData';
import usePostModals from '../../../../../hooks/usePostModals';
import useLikes from '../../../../../hooks/useLikes';
import useComments from '../../../../../hooks/useComments';
import { useTranslation } from 'react-i18next';

const PostList = ({ onTriggerModal }) => {
    const { t } = useTranslation();
    const { posts, setPosts, comments, setComments, replies, setReplies } = usePostListData();

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const user = JSON.parse(atob(token.split('.')[1]));
    const userId = user.user_id;

    const {
        editModal,
        setEditModal,
        deleteModal,
        setDeleteModal,
        editInputs,
        setEditInputs,
        openEditModal,
        openDeleteModal,
        handleEditSubmit,
        confirmDelete
    } = usePostModals(setPosts);

    const { likesState, handleToggleLike } = useLikes(userId);

    const {
        activeCommentPostId,
        commentInputs,
        replyInputs,
        replyingTo,
        toggleCommentBox,
        toggleReplyBox,
        handleCommentChange,
        handleReplyChange,
        handleCommentSubmit,
        handleReplySubmit
    } = useComments(userId, setComments, setReplies);

    const modalStyles = {
        overlay: { backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000 },
        content: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', maxWidth: '500px', width: '100%', borderRadius: '10px', padding: '20px' }
    };

    return (
        <div className="post-list">
            <Modal isOpen={editModal.isOpen} onRequestClose={() => setEditModal({ isOpen: false, post: null })} style={modalStyles}>
                <h3 className="mb-3">{t("Edit Post")}</h3>
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder={t("Title")}
                    value={editInputs.title}
                    onChange={e => setEditInputs(prev => ({ ...prev, title: e.target.value }))}
                />
                <textarea
                    className="form-control mb-3"
                    rows="4"
                    placeholder={t("Content")}
                    value={editInputs.content}
                    onChange={e => setEditInputs(prev => ({ ...prev, content: e.target.value }))}
                ></textarea>
                <button onClick={handleEditSubmit} className="btn btn-info">{t("Save Changes")}</button>
            </Modal>

            <Modal isOpen={deleteModal.isOpen} onRequestClose={() => setDeleteModal({ isOpen: false, postId: null })} style={modalStyles}>
                <h4 className="mb-4">{t("Confirm Delete")}</h4>
                <button onClick={confirmDelete} className="btn btn-danger me-3">{t("Delete")}</button>
                <button onClick={() => setDeleteModal({ isOpen: false, postId: null })} className="btn btn-secondary">{t("Cancel")}</button>
            </Modal>

            {posts.map(post => (
                <div key={post.id} className="card shadow-sm p-4 mb-4">
                    <div className="d-flex align-items-center mb-3">
                        <img src={`http://localhost:8080/${post.image}`} alt="Author" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                        <div className="ms-3">
                            <h6 className="mb-0">{post.author}</h6>
                            <small className="text-muted">{t("Published")}: {post.createdAt}</small>
                        </div>
                    </div>

                    {post.media[0] && (
                        <img src={`http://localhost:8080${post.media[0]}`} alt="Post Media" className="img-fluid rounded mb-3" />
                    )}

                    <h5>{post.title}</h5>
                    <p>{post.content}</p>

                    <div className="d-flex gap-3 my-3">
                        <button onClick={() => handleToggleLike(post.id)} className="btn btn-outline-primary">
                            <i className={`fa ${likesState[post.id]?.liked ? 'fa-thumbs-down' : 'fa-thumbs-up'}`}></i> {likesState[post.id]?.count || 0}
                        </button>
                        <button onClick={() => toggleCommentBox(post.id)} className="btn btn-outline-success">
                            <i className="fa fa-comment"></i> {comments[post.id]?.length || 0}
                        </button>
                        {Number(post.user_id) === Number(userId) && (
                            <>
                                <button onClick={() => openEditModal(post)} className="btn btn-outline-warning">
                                    <i className="fa fa-edit"></i>
                                </button>
                                <button onClick={() => openDeleteModal(post.id)} className="btn btn-outline-danger">
                                    <i className="fa fa-trash"></i>
                                </button>
                            </>
                        )}
                    </div>

                    {activeCommentPostId === post.id && (
                        <form onSubmit={e => handleCommentSubmit(e, post.id)} className="d-flex gap-2 mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder={t("Write a comment...")}
                                value={commentInputs[post.id] || ''}
                                onChange={e => handleCommentChange(post.id, e.target.value)}
                            />
                            <button type="submit" className="btn btn-success"><i className="fa fa-send"></i></button>
                        </form>
                    )}

                    {(comments[post.id] || []).map(comment => (
                        <div key={comment.id} className="mb-2">
                            <div className="d-flex align-items-center">
                                <img src={`http://localhost:8080/${post.image}`} alt="Commenter" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                                <div className="ms-2">
                                    <strong>{comment.author}</strong>
                                    <small className="d-block text-muted">{comment.createdAt}</small>
                                </div>
                            </div>
                            <p className="ms-5 mb-1">{comment.content}</p>
                            <div className="ms-5">
                                <button onClick={() => toggleReplyBox(comment.id)} className="btn btn-sm btn-link p-0 text-secondary">
                                    {t("Reply")}
                                </button>

                                {replyingTo[comment.id] && (
                                    <form onSubmit={e => handleReplySubmit(e, comment.id)} className="d-flex gap-2 mt-2">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            placeholder={`${t("Reply to")} ${comment.author}...`}
                                            value={replyInputs[comment.id] || ''}
                                            onChange={e => handleReplyChange(comment.id, e.target.value)}
                                        />
                                        <button type="submit" className="btn btn-sm btn-primary"><i className="fa fa-paper-plane"></i></button>
                                    </form>
                                )}

                                {(replies[comment.id] || []).map(reply => (
                                    <div key={reply.id} className="ms-4 mt-2 border-start ps-3">
                                        <strong>{reply.author}</strong>
                                        <small className="d-block text-muted">{reply.createdAt}</small>
                                        <p>{reply.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default PostList;
