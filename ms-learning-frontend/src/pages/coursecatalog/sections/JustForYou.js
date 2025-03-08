import React from "react";


const JustForYou = () => {
  return (
    <div className="container my-5 mt-5">
      <h3 className="text-danger fw-bold">Just for You</h3>
      <p className="text-success">Courses handpicked to match your interests</p>

      <div className="row">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="col-md-4">
            <div className="justforyou-card">
              <div className="justforyou-image-placeholder"></div>
              <div className="justforyou-content">
                <h5 className="text-danger">Course name</h5>
                <p className="text-secondary">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <p className="text-success">Instructor name</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-3">
        <button className="btn justforyou-showmore-btn mb-5">Show more</button>
      </div>
    </div>
  );
};

export default JustForYou;
