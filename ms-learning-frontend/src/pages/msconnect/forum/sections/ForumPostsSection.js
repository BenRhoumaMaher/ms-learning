import React, { useState } from 'react';
import BlogPostCard from '../../../../components/forum/BlogPostCard';
import CreatePostModal from '../../../../components/forum/modals/CreatePostModal';
import useInstructorCheck from '../../../../hooks/useInstructorCheck';
import useForumPosts from '../../../../hooks/useForumPosts';
import usePagination from '../../../../hooks/usePagination';

const POSTS_PER_PAGE = 2;

const ForumPostsSection = ({ currentUserId }) => {
    const posts = useForumPosts();
    const isInstructor = useInstructorCheck(currentUserId);
    const { currentPage, totalPages, currentItems, goToNextPage, goToPrevPage } = usePagination(posts, POSTS_PER_PAGE);

    const [showModal, setShowModal] = useState(false);

    return (
        <div id="page-contents" className="row merged20">
            <div className="col-lg-12">
                <div className="main-wraper">
                    <div className="main-title d-flex justify-content-between align-items-center">
                        Blog Posts
                        {isInstructor && (
                            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                                Create Post
                            </button>
                        )}
                    </div>

                    {currentItems.map((post) => (
                        <BlogPostCard
                            key={post.id}
                            id={post.id}
                            image={`http://localhost:8080/${post.image}`}
                            reads={post.views || 0}
                            title={post.title}
                            excerpt={`${post.content.substring(0, 100)}...`}
                            date={new Date(post.createdAt).toLocaleDateString()}
                        />
                    ))}

                    {posts.length > POSTS_PER_PAGE && (
                        <div className="d-flex justify-content-between mt-3">
                            <button
                                className="btn btn-outline-primary"
                                disabled={currentPage === 1}
                                onClick={goToPrevPage}
                            >
                                Previous
                            </button>
                            <span>Page {currentPage} of {totalPages}</span>
                            <button
                                className="btn btn-outline-primary"
                                disabled={currentPage === totalPages}
                                onClick={goToNextPage}
                            >
                                Next
                            </button>
                        </div>
                    )}

                    {isInstructor && (
                        <CreatePostModal
                            userId={currentUserId}
                            isOpen={showModal}
                            onClose={() => setShowModal(false)}
                            onPostCreated={() => window.location.reload()}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForumPostsSection;
