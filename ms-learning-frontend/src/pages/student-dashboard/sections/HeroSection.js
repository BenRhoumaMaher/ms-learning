import React from 'react';
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="container text-center my-5">
      <div className="row align-items-center justify-content-center gap-4">
        <div className="col-md-3">
          <div className="bg-info d-flex justify-content-center align-items-center" style={{ width: "100%", height: "250px" }}>
            <img
              src="https://zenquotes.io/api/image"
              alt="Inspirational Quote"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <p className="mt-3">A daily inspirational quote</p>
        </div>

        <div className="col-md-4 mx-md-5">
          <h2 className="fw-bold">Your learning journey is just a click away</h2>
          <p>Let’s make today productive</p>
          <button className="btn btn-success" onClick={() => navigate("/course-catalog")}>
            Start a New Course
          </button>
        </div>

        <div className="col-md-3">
          <div className="bg-info d-flex justify-content-center align-items-center" style={{ width: "100%", height: "250px" }}>
            <img
              src="https://zenquotes.io/api/image"
              alt="Inspirational Quote"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <p className="mt-3">A daily inspirational quote</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
