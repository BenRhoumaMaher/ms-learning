import React, { useState } from "react";


const TestimonialsSection = () => {
  const [activePage, setActivePage] = useState(1);
  const totalPages = 55;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setActivePage(page);
    }
  };

  return (
    <section className="testimonials-section">
      <div className="container text-center">
        <h3 className="section-title">
          <strong>Voices of Success: What Our Learners Say</strong>
        </h3>
        <p className="section-subtitle">
          Real stories. Real impact. Hear from our thriving community of
          learners.
        </p>

        <div className="testimonial-card">
          <div className="testimonial-image">
          <div className='test-image'>
                  <i className='bi bi-image'></i>
                </div>
          </div>
          <div className="testimonial-content">
            <h5><strong>Name</strong></h5>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>

        <div className="pagination-container">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(activePage - 1)}
            disabled={activePage === 1}
          >
            &lt;
          </button>

          {[1, 2, 3, 4, "...", totalPages].map((page, index) => (
            <button
              key={index}
              className={`pagination-btn ${
                activePage === page ? "active" : ""
              }`}
              onClick={() => typeof page === "number" && handlePageChange(page)}
            >
              {page}
            </button>
          ))}

          <button
            className="pagination-btn"
            onClick={() => handlePageChange(activePage + 1)}
            disabled={activePage === totalPages}
          >
            &gt;
          </button>
        </div>

        <button className="btn btn-info mt-3">Join Our Learning Family</button>
      </div>
    </section>
  );
};

export default TestimonialsSection;
