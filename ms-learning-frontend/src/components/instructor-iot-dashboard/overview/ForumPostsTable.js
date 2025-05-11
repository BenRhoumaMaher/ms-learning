import { Table, Button, Pagination } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye, FaComments } from 'react-icons/fa';

export const ForumPostsTable = ({
    forumPosts,
    currentPage,
    itemsPerPage,
    onPageChange,
    onView,
    onEdit,
    onDelete
}) => {
    const paginate = (array, page) => {
        return array.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    };

    return (
        <div className="mb-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4><FaComments className="me-2" />Forum Posts</h4>
                <span className="text-muted">
                    Showing {paginate(forumPosts, currentPage).length} of {forumPosts.length} post{forumPosts.length !== 1 ? 's' : ''}
                </span>
            </div>
            <div className="table-responsive mb-3">
                <Table striped bordered hover className="bg-white shadow-sm">
                    <thead className="table-primary">
                        <tr>
                            <th>Title</th>
                            <th>Content Preview</th>
                            <th>Views</th>
                            <th style={{ width: '150px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginate(forumPosts, currentPage).map((post) => (
                            <tr key={post.id}>
                                <td>{post.title}</td>
                                <td>{post.content.substring(0, 50)}...</td>
                                <td>{post.views}</td>
                                <td>
                                    <div className="d-flex gap-2 justify-content-center">
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => onView(post.id, 'forum post')}
                                            title="View"
                                        >
                                            <FaEye />
                                        </Button>
                                        <Button
                                            variant="outline-success"
                                            size="sm"
                                            onClick={() => onEdit(post.id, 'forum post')}
                                            title="Edit"
                                        >
                                            <FaEdit />
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => onDelete(post.id, 'forum post')}
                                            title="Delete"
                                        >
                                            <FaTrash />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            <Pagination className="justify-content-center">
                <Pagination.Prev
                    onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                />
                {[...Array(Math.ceil(forumPosts.length / itemsPerPage)).keys()].map(number => (
                    <Pagination.Item
                        key={number + 1}
                        active={number + 1 === currentPage}
                        onClick={() => onPageChange(number + 1)}
                    >
                        {number + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next
                    onClick={() => onPageChange(Math.min(currentPage + 1, Math.ceil(forumPosts.length / itemsPerPage)))}
                    disabled={currentPage === Math.ceil(forumPosts.length / itemsPerPage)}
                />
            </Pagination>
        </div>
    );
};