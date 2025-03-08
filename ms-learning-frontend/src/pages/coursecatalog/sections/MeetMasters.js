import React from "react";


const MeetMasters = () => {
  return (
    <section className="meetmast-section">
      <div className="container text-center">
        <h2 className="meetmast-title">Meet the Masters</h2>
        <p className="meetmast-subtitle">
          <a href="/" className="meetmast-link">
            Get inspired by top instructors and explore their courses
          </a>
        </p>

        <div className="row justify-content-center">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="col-md-4">
              <div className="meetmast-card">
                <div className="meetmast-card-header"></div>
                <div className="meetmast-avatar">
                  <i className="bi bi-person"></i>
                </div>
                <div className="meetmast-card-body">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                  <button className="meetmast-btn">View Profile</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MeetMasters;
