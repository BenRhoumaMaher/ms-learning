import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form, Collapse } from "react-bootstrap";
import { getCourseReviews, createCourseReview } from "../../../helpers/api";

const StudentReviews = ({ courseId }) => {
  const [reviews, setReviews] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const user = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const userId = user?.user_id;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getCourseReviews(courseId);
        setReviews(data);
      } catch (error) {
        console.error("Failed to load reviews", error);
      }
    };

    if (courseId) fetchReviews();
  }, [courseId]);

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) return;

    const reviewData = {
      userId,
      rating,
      comment: reviewText,
    };

    try {
      await createCourseReview(courseId, reviewData);
      const updatedReviews = await getCourseReviews(courseId);
      setReviews(updatedReviews);

      setReviewText("");
      setRating(5);
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error creating review", error);
      alert("Failed to create review");
    }
  };

  return (
    <Container className="student-reviews text-center py-5">
      <h2 className="fw-bold">What Students Are Saying</h2>
      <p className="text-muted">Hear from learners who’ve taken this course</p>

      <Row className="justify-content-center">
        {reviews.map((review, index) => (
          <Col key={index} md={3} className="d-flex justify-content-center mb-4">
            <Card className="review-card text-white bg-dark p-3 shadow rounded border-0 w-100">
              <Card.Body className="d-flex flex-column justify-content-between">
                <div className="mb-3">
                  <Card.Title className="fs-5 fw-semibold text-danger mb-1">
                    {review.user?.firstname} {review.user?.lastname}
                  </Card.Title>
                  <Card.Subtitle className="text-success small">
                    {review.createdAt?.slice(0, 10) || "Recently"}
                  </Card.Subtitle>
                </div>

                <div className="border-top border-secondary my-3"></div>

                <Card.Text className="fst-italic text-light mb-3">
                  {review.comment}
                </Card.Text>

                <div className="text-warning fw-bold fs-6">
                  {"⭐".repeat(review.rating)}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Button variant="primary" onClick={() => setIsFormOpen(!isFormOpen)} aria-controls="reviewForm" aria-expanded={isFormOpen}>
        {isFormOpen ? "Close Review Form" : "Add Review"}
      </Button>

      <Collapse in={isFormOpen}>
        <div id="reviewForm" className="mt-4">
          <Form>
            <Form.Group controlId="formReviewRating" className="mb-3">
              <Form.Label>Rating</Form.Label>
              <Form.Control
                as="select"
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
              >
                <option value={1}>1 - Poor</option>
                <option value={2}>2 - Fair</option>
                <option value={3}>3 - Good</option>
                <option value={4}>4 - Very Good</option>
                <option value={5}>5 - Excellent</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formReviewText" className="mb-3">
              <Form.Label>Review</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Write your review here..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSubmitReview}>
                Submit Review
              </Button>
            </div>
          </Form>
        </div>
      </Collapse>
    </Container>
  );
};

export default StudentReviews;
