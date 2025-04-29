import React from 'react';
import { Link, useParams } from 'react-router-dom';
import useForumPostDetail from '../../../../hooks/useForumPostDetail';

const ForumPostDetail = () => {
    const { id } = useParams();
    const { post, siblings } = useForumPostDetail(id);

    if (!post) return <div>Loading...</div>;

    return (
        <div className="blog-detail">
            <div className="blog-title">
                <h2>{post.title}</h2>
            </div>

            <div className="blog-details-meta">
                <figure>
                    <img src={`http://localhost:8080/${post.image}`} alt="Blog Main" />
                </figure>
                <ul className="mt-3">
                    <li>
                        <i className="fa fa-calendar"></i> {new Date(post.createdAt).toDateString()}
                    </li>
                </ul>

                <p>{post.content}</p>

                <div className="tag-n-cat">
                    <div className="tags">
                        <span><i className="fa fa-tags"></i> Post Tags:</span>
                        {(post.tags?.split(',') || []).map((tag, i) => (
                            <a key={i} href="/">{tag}</a>
                        ))}
                    </div>

                    <div className="tags">
                        <span><i className="fa fa-filter"></i> Post Categories:</span>
                        {post.categories.map((cat, i) => (
                            <a key={i} href="/">{cat}</a>
                        ))}
                    </div>
                </div>
            </div>

            <div className="next-prev-posts">
                {siblings.previous && (
                    <div className="prev">
                        <Link to={`/forum-post/${siblings.previous}`} title="Previous Post">
                            <div className="nav-link-content">
                                <i className="fa fa-angle-left"></i>
                                <p>{siblings.previoustitle}</p>
                            </div>
                        </Link>
                    </div>
                )}
                {siblings.next && (
                    <div className="next">
                        <Link to={`/forum-post/${siblings.next}`} title="Next Post">
                            <div className="nav-link-content">
                                <p>{siblings.nexttitle}</p>
                                <i className="fa fa-angle-right"></i>
                            </div>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForumPostDetail;
