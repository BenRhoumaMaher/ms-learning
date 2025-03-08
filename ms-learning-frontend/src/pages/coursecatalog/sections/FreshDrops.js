import React from "react";


const FreshDrops = () => {
  return (
    <div className="container my-5">
      <h3 className="text-dark fw-bold">
        Fresh Drops : <span className="text-danger">New & Noteworthy</span>
      </h3>
      <p className="text-success">Explore the newest courses added</p>

      <div className="row">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="col-md-4">
            <div className="freshdrops-card">
              <div className="freshdrops-image-placeholder"></div>
              <div className="freshdrops-content">
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
        <button className="btn freshdrops-showmore-btn mb-5">Show more</button>
      </div>
    </div>
  );
};

export default FreshDrops;
