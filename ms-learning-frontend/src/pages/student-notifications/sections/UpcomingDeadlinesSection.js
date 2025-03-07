import React, { useState } from 'react';


const UpcomingDeadlinesSection = () => {
  const [activePage, setActivePage] = useState(1);
  const totalPages = 55;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setActivePage(page);
    }
  };

  return (
    <section className="container my-5">
      <div className="text-start">
        <h3 className="fw-bold">Your Upcoming Deadlines</h3>
        <p className="text-primary">
          <a href="#" className="text-decoration-none">Stay on track with your assignments and quizzes</a>
        </p>
      </div>

      <div className="row g-4">
        {[1, 2, 3].map((quiz, index) => (
          <div className="col-md-4" key={index}>
            <div className="card quiz-card">
              <div className="quiz-image"></div>
              <div className="card-body text-center">
                <h5 className="fw-bold text-info">Quiz Title</h5>
                <p className='text-info'>Course Name</p>
                <p className="text-muted">The deadline for submission</p>
                <button className="btn btn-success">Start the Quiz</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination-container mt-4 text-center">
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
            className={`pagination-btn ${activePage === page ? "active" : ""}`}
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
    </section>
  );
};

export default UpcomingDeadlinesSection;
