import React from 'react';
import { Link } from 'react-router-dom';

const BlogPostCard = ({ id, image, reads, title, excerpt, date }) => {
    return (
        <div className="blog-posts mb-5">
            <figure>
                <img src={image} alt={title} />
            </figure>
            <div className="blog-post-meta">
                <ul>
                    <li>
                        <i className="fa fa-book"></i>
                        <span title="Reads" className="text-info ms-2 fw-bold">{reads}</span>
                    </li>
                </ul>
                <h4>{title}</h4>
                <p>{excerpt}</p>
                <span><i className="fa fa-time"></i> {date}</span>
                <Link to={`/forum-post/${id}`} className="button primary circle" title="Read More">
                    read more
                </Link>
            </div>
        </div>
    );
};

export default BlogPostCard;
