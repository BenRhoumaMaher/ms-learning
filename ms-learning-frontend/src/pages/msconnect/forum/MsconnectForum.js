import React from 'react';
import '../../../styles/msconnectforumstyle.css';
import ForumPostsSection from './sections/ForumPostsSection';
import { useParams } from 'react-router-dom';

const MsconnectForum = () => {
    const { id } = useParams();
    return (
        <section>
            <div className="gap">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <ForumPostsSection currentUserId={id} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MsconnectForum;
