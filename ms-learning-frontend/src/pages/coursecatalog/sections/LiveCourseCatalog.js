import React from "react";


const LiveCourseCatalog = () => {
  return (
    <div className="container my-5">
      <div className="row cataloglive-card">
        <div className="col-md-4 cataloglive-image-container">
          <div className="cataloglive-image-placeholder"></div>
        </div>

        <div className="col-md-8 cataloglive-content">
          <h4 className="text-danger fw-bold">Course Name</h4>
          <p className="text-secondary">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>

          <p className="fw-bold">
            LIVE IN <span className="text-primary fw-bold">02:53:15</span>
          </p>

          <button className="btn cataloglive-join-btn">Join This Course</button>
        </div>
      </div>

      <div className="text-center mt-4 mb-5">
        <button className="btn cataloglive-calendar-btn mb-5">View Full Calendar</button>
      </div>
    </div>
  );
};

export default LiveCourseCatalog;
