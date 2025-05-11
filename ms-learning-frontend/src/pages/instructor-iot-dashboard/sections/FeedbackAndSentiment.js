import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { FaArrowLeft, FaChartPie, FaChartBar } from 'react-icons/fa';
import { useFeedbackAndSentiment } from '../../../hooks/useFeedbackAndSentiment';
import { SentimentPieChart } from '../../../components/instructor-iot-dashboard/feedback-sentiment/SentimentPieChart';
import { FrequentTermsBarChart } from '../../../components/instructor-iot-dashboard/feedback-sentiment/FrequentTermsBarChart';
import { ReviewsTable } from '../../../components/instructor-iot-dashboard/feedback-sentiment/ReviewsTable';
import { PostsTable } from '../../../components/instructor-iot-dashboard/feedback-sentiment/PostsTable';

const FeedbackAndSentiment = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { contentData, loading, error } = useFeedbackAndSentiment();

    if (!id) {
        return (
            <div className="p-4">
                <Alert variant="danger">
                    Instructor ID not specified. Redirecting...
                </Alert>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                <Spinner animation="border" variant="primary" />
                <span className="ms-3">Loading feedback data...</span>
            </div>
        );
    }

    if (error) {
        return (
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
        );
    }

    if (!contentData) {
        return (
            <Alert variant="info" className="mt-3">
                No feedback data available yet.
            </Alert>
        );
    }

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{ color: '#0077b6' }}>Feedback & Sentiment Analysis</h2>
                <Button
                    variant="outline-primary"
                    onClick={() => navigate(-1)}
                    className="d-flex align-items-center"
                >
                    <FaArrowLeft className="me-2" />
                    Back to Dashboard
                </Button>
            </div>

            <Row className="mb-4">
                <Col md={6}>
                    <Card className="h-100 shadow-sm">
                        <Card.Header className="d-flex align-items-center">
                            <FaChartPie className="me-2" />
                            <span className="fw-bold">Reviews Sentiment</span>
                        </Card.Header>
                        <Card.Body>
                            <SentimentPieChart
                                sentimentData={contentData.reviews?.analytics?.sentiment}
                                title="Reviews Sentiment Distribution"
                            />
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="h-100 shadow-sm">
                        <Card.Header className="d-flex align-items-center">
                            <FaChartPie className="me-2" />
                            <span className="fw-bold">Posts Sentiment</span>
                        </Card.Header>
                        <Card.Body>
                            <SentimentPieChart
                                sentimentData={contentData.posts?.analytics?.sentiment}
                                title="Posts Sentiment Distribution"
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col md={6}>
                    <Card className="h-100 shadow-sm">
                        <Card.Header className="d-flex align-items-center">
                            <FaChartBar className="me-2" />
                            <span className="fw-bold">Reviews Frequent Terms</span>
                        </Card.Header>
                        <Card.Body>
                            <FrequentTermsBarChart
                                terms={contentData.reviews?.analytics?.frequent_terms?.slice(0, 10)}
                                title="Reviews Frequent Terms"
                                color="rgba(54, 162, 235, 0.6)"
                            />
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="h-100 shadow-sm">
                        <Card.Header className="d-flex align-items-center">
                            <FaChartBar className="me-2" />
                            <span className="fw-bold">Posts Frequent Terms</span>
                        </Card.Header>
                        <Card.Body>
                            <FrequentTermsBarChart
                                terms={contentData.posts?.analytics?.frequent_terms?.slice(0, 10)}
                                title="Posts Frequent Terms"
                                color="rgba(153, 102, 255, 0.6)"
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card className="mb-4 shadow-sm">
                <Card.Header className="fw-bold">Course Reviews</Card.Header>
                <Card.Body>
                    <ReviewsTable reviews={contentData.reviews?.data || []} />
                </Card.Body>
            </Card>

            <Card className="shadow-sm">
                <Card.Header className="fw-bold">Student Posts</Card.Header>
                <Card.Body>
                    <PostsTable posts={contentData.posts?.data || []} />
                </Card.Body>
            </Card>
        </div>
    );
};

export default FeedbackAndSentiment;