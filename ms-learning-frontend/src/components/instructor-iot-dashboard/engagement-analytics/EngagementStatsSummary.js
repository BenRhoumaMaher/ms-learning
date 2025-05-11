import { FaPlay } from 'react-icons/fa';
import { Alert, ListGroup } from 'react-bootstrap';

export const EngagementStatsSummary = ({ videoAnalytics }) => {
    if (!videoAnalytics) return null;

    return (
        <>
            <h5>Key Metrics</h5>
            <ListGroup className="mb-3">
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                    Avg. Watch Time:
                    <span className="badge bg-info rounded-pill">
                        {(videoAnalytics.averageWatchTime / 60).toFixed(1)} min
                    </span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                    Avg. Completion:
                    <span className="badge bg-success rounded-pill">
                        {videoAnalytics.averageCompletion.toFixed(1)}%
                    </span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                    Total Views:
                    <span className="badge bg-primary rounded-pill">
                        {videoAnalytics.totalViews}
                    </span>
                </ListGroup.Item>
            </ListGroup>
            <Alert variant="success">
                <FaPlay className="me-2" />
                High completion rates indicate engaging content
            </Alert>
        </>
    );
};