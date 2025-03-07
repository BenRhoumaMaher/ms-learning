import React from 'react';

const HeroSection = () => {
  return (
    <section className="container text-center my-5">
      <div className="row align-items-center justify-content-center gap-4">
        <div className="col-md-3">
          <div className="bg-info d-flex justify-content-center align-items-center" style={{ width: "100%", height: "250px" }}>
            <i className="bi bi-image" style={{ fontSize: "3rem", color: "white" }}></i>
          </div>
          <p className="mt-3">A daily inspirational quote</p>
        </div>

        <div className="col-md-4 mx-md-5">
          <h2 className="fw-bold">Your learning journey is just a click away</h2>
          <p>Let’s make today productive</p>
          <p className="text-success">You've completed 75% of your current courses</p>
          <button className="btn btn-success me-3">Resume Last Course</button>
          <button className="btn btn-info">Start a New Course</button>
        </div>

        <div className="col-md-3">
          <div className="bg-info d-flex justify-content-center align-items-center" style={{ width: "100%", height: "250px" }}>
            <i className="bi bi-image" style={{ fontSize: "3rem", color: "white" }}></i>
          </div>
          <p className="mt-3">A daily inspirational quote</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
