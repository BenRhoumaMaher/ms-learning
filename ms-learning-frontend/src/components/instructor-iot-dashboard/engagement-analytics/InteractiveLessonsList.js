import { FaPause, FaRedo } from 'react-icons/fa';
import { Alert, ListGroup } from 'react-bootstrap';

export const InteractiveLessonsList = ({ lessons }) => {
    return (
        <>
            <h5>Top Interactive Lessons</h5>
            <ListGroup className="mb-3">
                {lessons.map((lesson, index) => (
                    <ListGroup.Item key={index}>
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="text-truncate" style={{ maxWidth: '150px' }} title={lesson.title}>
                                {lesson.title}
                            </span>
                            <div>
                                <span className="badge bg-danger me-1">{lesson.pauses}</span>
                                <span className="badge bg-primary">{lesson.replays}</span>
                            </div>
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
            <Alert variant="info">
                <FaPause className="me-2" />
                Pauses indicate difficult content segments
            </Alert>
            <Alert variant="primary">
                <FaRedo className="me-2" />
                Replays show content students want to review
            </Alert>
        </>
    );
};