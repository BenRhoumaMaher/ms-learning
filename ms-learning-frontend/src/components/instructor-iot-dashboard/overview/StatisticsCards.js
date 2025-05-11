import { Card, Row, Col } from 'react-bootstrap';
import { FaBook, FaUsers, FaComments } from 'react-icons/fa';

export const StatisticsCards = ({ instructorStats }) => {
    return (
        <Row className="mb-4">
            <Col md={4}>
                <Card className="shadow-sm h-100">
                    <Card.Body className="text-center">
                        <FaBook size={30} className="mb-2 text-primary" />
                        <h3>{instructorStats.totalCourses}</h3>
                        <Card.Text>Total Courses</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={4}>
                <Card className="shadow-sm h-100">
                    <Card.Body className="text-center">
                        <FaUsers size={30} className="mb-2 text-success" />
                        <h3>{instructorStats.totalStudents}</h3>
                        <Card.Text>Total Students</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={4}>
                <Card className="shadow-sm h-100">
                    <Card.Body className="text-center">
                        <FaComments size={30} className="mb-2 text-info" />
                        <h3>{instructorStats.totalReviews}</h3>
                        <Card.Text>Total Reviews</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};