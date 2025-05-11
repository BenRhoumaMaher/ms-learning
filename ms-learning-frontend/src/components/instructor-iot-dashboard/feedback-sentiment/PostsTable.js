import { Table } from 'react-bootstrap';

export const PostsTable = ({ posts }) => {
    if (!posts || posts.length === 0) {
        return <div className="alert alert-info">No posts available</div>;
    }

    return (
        <div className="table-responsive">
            <Table striped bordered hover className="bg-white">
                <thead className="table-primary">
                    <tr>
                        <th>Title</th>
                        <th>Content</th>
                        <th>Tags</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map((post, index) => (
                        <tr key={index}>
                            <td>{post.title}</td>
                            <td className="text-truncate" style={{ maxWidth: '300px' }} title={post.content}>
                                {post.content}
                            </td>
                            <td>{post.tags}</td>
                            <td>{post.created_at}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};