import { Table } from 'react-bootstrap';

export const ReviewsTable = ({ reviews }) => {
    if (!reviews || reviews.length === 0) {
        return <div className="alert alert-info">No reviews available</div>;
    }

    return (
        <div className="table-responsive">
            <Table striped bordered hover className="bg-white">
                <thead className="table-primary">
                    <tr>
                        <th>Course</th>
                        <th>Rating</th>
                        <th>Comment</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {reviews.map((review, index) => (
                        <tr key={index}>
                            <td>
                                <strong>{review.course_title}</strong>
                                <div className="text-muted small">ID: {review.course_id}</div>
                            </td>
                            <td>
                                <div className={`rating-badge ${review.rating >= 4 ? 'bg-success' : review.rating >= 3 ? 'bg-warning' : 'bg-danger'}`}>
                                    {review.rating}/5
                                </div>
                            </td>
                            <td>{review.comment}</td>
                            <td>{review.created_at}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};