import React from "react";

const BecomeInstructorHero = ({ scrollToJoinFamily }) => {
  return (
    <section className="container-fluid becoinstr-hero">
      <div className="container">
        <div className="row">
          <div className="col-md-6 text-center">
            <h2 className="fw-bold becoinstr-title">Share Your Knowledge</h2>
            <p className="becoinstr-subtitle">
              Inspire the World and Earn from Your Expertise
            </p>
            <p className="becoinstr-details text-primary">
              Join 10,000+ instructors | Earn up to $5,000/month | Teach 1000+ students
            </p>
            <button className="btn becoinstr-btn" onClick={scrollToJoinFamily}>Start Teaching Today</button>
          </div>

          <div className="col-md-6 text-end">
            <video
              className="becoinstr-video"
              controls
              poster="https://via.placeholder.com/600x300/17a2b8/ffffff?text=Instructor+Preview"
            >
              <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BecomeInstructorHero;
