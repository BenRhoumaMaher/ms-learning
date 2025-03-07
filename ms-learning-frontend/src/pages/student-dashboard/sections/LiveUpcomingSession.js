import React from 'react';

const LiveUpcomingSession = () => {
  return (
    <section className="container text-center my-5">
      <h2 className="fw-bold mb-4">Join This Live Upcoming Session</h2>

      <div id="liveSessionCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className="row mx-auto align-items-center bg-light rounded shadow p-3">
              <div className="col-md-6 d-flex justify-content-center bg-info p-5">
                <i className="bi bi-image" style={{ fontSize: "4rem", color: "white" }}></i>
              </div>

              <div className="col-md-6 text-start p-4">
                <p><strong className="text-danger">Course Title:</strong> The name of the course.</p>
                <p><strong className="text-danger">Start Date & Time:</strong> 30/02/2025 at 12:10:00</p>
                <p><strong className="text-danger">Duration:</strong> 2 hours.</p>
                <button className="btn btn-outline-info">Join</button>
              </div>
            </div>
          </div>

        </div>

        
        <button className="carousel-control-prev text-black" type="button" data-bs-target="#liveSessionCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        </button>
        <button className="carousel-control-next text-black" type="button" data-bs-target="#liveSessionCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
        </button>
      </div>

      <div className="mt-4">
        <button className="btn btn-outline-info btn-lg">View Full Calendar</button>
      </div>
    </section>
  );
};

export default LiveUpcomingSession;
