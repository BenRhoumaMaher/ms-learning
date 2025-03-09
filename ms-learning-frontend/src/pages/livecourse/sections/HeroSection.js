import React from "react";

const HeroSection = () => {
  return (
    <section className="livecou-hero">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-4">
            <div className="livecou-live-status">
              <span className="livecou-live-dot"></span>
              <h6>Live Now | 500+ Students Attending</h6>
            </div>
            <h5 className="livecou-title">Mastering JavaScript | Module 2</h5>
            <p className="livecou-session">Session 3</p>
            <div className="livecou-buttons">
              <button className="livecou-btn livecou-join">Join Now</button>
              <button className="livecou-btn livecou-materials">
                Download Materials
              </button>
            </div>
            <p className="livecou-next-session">
              Next Session: Starts in 5 days{" "}
              <button className="livecou-remind">Remind me</button>
            </p>
          </div>

          <div className="col-md-6 text-center">
            <div className="livecou-hero-image">
              <i className="fas fa-image fa-5x text-light"></i>
            </div>
          </div>

          <div className="col-md-2">
            <div className="livecou-instructor-card">
              <div className="livecou-instructor-image">
                <i className="fas fa-image fa-2x text-light"></i>
              </div>
              <p className="livecou-instructor-name">Instructor Name</p>
              <button className="livecou-btn livecou-profile">
                View Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
