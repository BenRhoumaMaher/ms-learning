import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, Spinner, Alert } from 'react-bootstrap';
import { FaArrowLeft, FaChartBar } from 'react-icons/fa';
import { useEngagementAnalytics } from '../../../hooks/useEngagementAnalytics';
import { TopInteractiveLessonsChart } from '../../../components/instructor-iot-dashboard/engagement-analytics/TopInteractiveLessonsChart';
import { VideoMetricsChart } from '../../../components/instructor-iot-dashboard/engagement-analytics/VideoMetricsChart';
import { TopLessonsChart } from '../../../components/instructor-iot-dashboard/engagement-analytics/TopLessonsChart';
import { InteractiveLessonsList } from '../../../components/instructor-iot-dashboard/engagement-analytics/InteractiveLessonsList';
import { EngagementStatsSummary } from '../../../components/instructor-iot-dashboard/engagement-analytics/EngagementStatsSummary';

const EngagementAnalytics = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, loading, error, getTopInteractiveLessons } = useEngagementAnalytics();
    const topInteractiveLessons = getTopInteractiveLessons();

    if (loading) {
        return (
            <div className="p-4">
                <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                    <Spinner animation="border" variant="primary" />
                    <span className="ms-3">Loading engagement analytics...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4">
                <Alert variant="danger" className="mt-3">
                    {error}
                    <div className="mt-2">
                        <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => window.location.reload()}
                        >
                            Retry
                        </Button>
                    </div>
                </Alert>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{ color: '#0077b6' }}>Engagement Analytics</h2>
                <Button
                    variant="outline-primary"
                    onClick={() => navigate(-1)}
                    className="d-flex align-items-center"
                >
                    <FaArrowLeft className="me-2" />
                    Back to Dashboard
                </Button>
            </div>

            {data && data.videoAnalytics ? (
                <>
                    <Card className="mb-4 shadow-sm">
                        <Card.Header className="d-flex align-items-center">
                            <FaChartBar className="me-2" />
                            <span className="fw-bold">Video Segment Interactions</span>
                        </Card.Header>
                        <Card.Body>
                            <div className="row">
                                <div className="col-md-8">
                                    <TopInteractiveLessonsChart topInteractiveLessons={topInteractiveLessons} />
                                </div>
                                <div className="col-md-4">
                                    <div className="d-flex flex-column h-100 justify-content-center">
                                        <InteractiveLessonsList lessons={topInteractiveLessons} />
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>

                    <Card className="mb-4 shadow-sm">
                        <Card.Header className="d-flex align-items-center">
                            <FaChartBar className="me-2" />
                            <span className="fw-bold">Video Engagement Metrics</span>
                        </Card.Header>
                        <Card.Body>
                            <div className="row">
                                <div className="col-md-8">
                                    <VideoMetricsChart videoAnalytics={data.videoAnalytics} />
                                </div>
                                <div className="col-md-4">
                                    <div className="d-flex flex-column h-100 justify-content-center">
                                        <EngagementStatsSummary videoAnalytics={data.videoAnalytics} />
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>

                    {data.videoAnalytics.topLessons && data.videoAnalytics.topLessons.length > 0 && (
                        <Card className="mb-4 shadow-sm">
                            <Card.Header className="d-flex align-items-center">
                                <FaChartBar className="me-2" />
                                <span className="fw-bold">Top Lessons by Views</span>
                            </Card.Header>
                            <Card.Body>
                                <div className="row">
                                    <div className="col-md-8">
                                        <TopLessonsChart
                                            topLessons={data.videoAnalytics.topLessons}
                                            courses={data.courses}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <div className="d-flex flex-column h-100 justify-content-center">
                                            <h5>Top Viewed Lessons</h5>
                                            <ul className="list-group">
                                                {data.videoAnalytics.topLessons.map((lesson, index) => {
                                                    const lessonTitle = data.courses.reduce((title, course) => {
                                                        if (title) return title;
                                                        const module = course.modules.find(m =>
                                                            m.lessons.some(l => l.id === lesson.lessonId)
                                                        );
                                                        if (module) {
                                                            const foundLesson = module.lessons.find(l => l.id === lesson.lessonId);
                                                            return foundLesson ? foundLesson.title : null;
                                                        }
                                                        return null;
                                                    }, null) || `Lesson ${lesson.lessonId}`;

                                                    return (
                                                        <li key={index} className="list-group-item">
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <span className="text-truncate" style={{ maxWidth: '150px' }} title={lessonTitle}>
                                                                    {lessonTitle}
                                                                </span>
                                                                <div>
                                                                    <span className="badge bg-primary me-1">{lesson.totalViews}</span>
                                                                    <span className="badge bg-success">{lesson.averageCompletion.toFixed(1)}%</span>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    )}
                </>
            ) : (
                <Alert variant="info">
                    No engagement data available yet. Check back after students start interacting with course videos.
                </Alert>
            )}
        </div>
    );
};

export default EngagementAnalytics;