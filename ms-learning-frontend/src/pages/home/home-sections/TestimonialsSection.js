import React, { useState, useEffect } from "react";
import { getTestimonials, createTestimonial } from "../../../helpers/api";
import { Form, Button } from "react-bootstrap";

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const testimonialsPerPage = 1;
  const totalPages = testimonials.length > 0 ? Math.ceil(testimonials.length / testimonialsPerPage) : 1;

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      try {
        const user = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser(user);
      } catch (error) {
        console.error('Error parsing token:', error);
        setError('Failed to authenticate user');
      }
    }
  }, []);

  useEffect(() => {
    const fetchTestimonials = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getTestimonials();
        setTestimonials(data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        setError('Failed to load testimonials');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setActivePage(page);
    }
  };

  const handleSubmitTestimonial = async () => {
    if (!currentUser) {
      setError('Please login to share your testimonial');
      return;
    }

    if (!newTestimonial.trim()) {
      setError('Testimonial content cannot be empty');
      return;
    }

    try {
      const response = await createTestimonial({
        content: newTestimonial,
        userId: currentUser.user_id
      });
      setTestimonials([response, ...testimonials]);
      setNewTestimonial("");
      setShowForm(false);
      setError(null);
      setActivePage(1);
    } catch (error) {
      console.error('Error creating testimonial:', error);
      setError('Failed to submit testimonial. Please try again.');
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setError(null);
  };

  const currentTestimonial = testimonials[(activePage - 1) * testimonialsPerPage];

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;

    buttons.push(
      <button
        key={1}
        className={`pagination-btn ${activePage === 1 ? "active" : ""}`}
        onClick={() => handlePageChange(1)}
      >
        1
      </button>
    );

    if (activePage > maxVisibleButtons - 1) {
      buttons.push(<span key="left-ellipsis" className="pagination-dots">...</span>);
    }

    const startPage = Math.max(2, Math.min(activePage - 1, totalPages - maxVisibleButtons + 1));
    const endPage = Math.min(totalPages - 1, startPage + maxVisibleButtons - 3);

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={`pagination-btn ${activePage === i ? "active" : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages - 1) {
      buttons.push(<span key="right-ellipsis" className="pagination-dots">...</span>);
    }

    if (totalPages > 1) {
      buttons.push(
        <button
          key={totalPages}
          className={`pagination-btn ${activePage === totalPages ? "active" : ""}`}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  return (
    <section className="testimonials-section">
      <div className="container text-center">
        <h3 className="section-title">
          <strong>Voices of Success: What Our Learners Say</strong>
        </h3>
        <p className="section-subtitle">
          Real stories. Real impact. Hear from our thriving community of learners.
        </p>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="testimonial-card">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : testimonials.length > 0 ? (
          <div className="testimonial-card">
            <div className="testimonial-image">
              <div className='test-image'>
                <img src={`http://localhost:8080/${currentTestimonial.user?.image}`} alt="testimonial" />
              </div>
            </div>
            <div className="testimonial-content">
              <h5><strong>{currentTestimonial.user?.name || 'Anonymous'}</strong></h5>
              <p className="text-muted mb-2">
                <small>
                  {new Date(currentTestimonial.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </small>
              </p>
              <p className="testimonial-text">{currentTestimonial.content}</p>
            </div>
          </div>
        ) : (
          <div className="testimonial-card">
            <p>No testimonials yet. Be the first to share!</p>
          </div>
        )}

        {testimonials.length > testimonialsPerPage && (
          <div className="pagination-container mt-4">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(activePage - 1)}
              disabled={activePage === 1}
            >
              &lt;
            </button>

            {renderPaginationButtons()}

            <button
              className="pagination-btn"
              onClick={() => handlePageChange(activePage + 1)}
              disabled={activePage === totalPages}
            >
              &gt;
            </button>
          </div>
        )}

        <div className="mt-4">
          <button
            className="btn btn-info"
            onClick={toggleForm}
          >
            {showForm ? 'Cancel' : 'Share your opinion'}
          </button>

          {showForm && (
            <div className="testimonial-form-container mt-3 p-4 bg-light rounded" style={{
              transition: 'all 0.3s ease',
              maxHeight: showForm ? '500px' : '0',
              overflow: 'hidden'
            }}>
              {!currentUser && (
                <div className="alert alert-warning">
                  Please login to share your testimonial
                </div>
              )}
              <Form.Group controlId="testimonialContent" className="mb-3">
                <Form.Label><strong>Your Testimonial</strong></Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={newTestimonial}
                  onChange={(e) => setNewTestimonial(e.target.value)}
                  placeholder="Share your learning experience..."
                  disabled={!currentUser}
                />
              </Form.Group>
              <Button
                variant="primary"
                onClick={handleSubmitTestimonial}
                disabled={!newTestimonial.trim() || !currentUser}
              >
                Submit
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;