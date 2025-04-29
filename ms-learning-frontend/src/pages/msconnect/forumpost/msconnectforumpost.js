import React from 'react';
import '../../../styles/msconnectforumposttyle.css';
import ForumPostDetail from './sections/ForumPostDetail';
import { useParams } from 'react-router-dom';

const MsconnectForumPost = () => {
    const { id } = useParams();
    return (
        <div className="theme-layout">
            <section>
                <div className="gap">
                    <div className="container">
                        <div className="row">
                            <div className="offset-lg-1 col-lg-10">
                                <ForumPostDetail currentForumPostId={id} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MsconnectForumPost;
