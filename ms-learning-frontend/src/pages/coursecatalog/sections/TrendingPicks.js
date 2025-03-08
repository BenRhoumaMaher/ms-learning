import React from "react";


const TrendingPicks = () => {
  return (
    <div className="container my-5 mt-5">
      <h3 className="text-danger fw-bold">Hot Right Now: <span className="text-dark">Trending Picks</span></h3>
      <p className="text-success">Discover the courses everyone’s talking about</p>

      <div className="row">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="col-md-4">
            <div className="trendingpicks-card">
              <div className="trendingpicks-image-placeholder"></div>
              <div className="trendingpicks-content">
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
        <button className="btn trendingpicks-showmore-btn mb-5">Show more</button>
      </div>
    </div>
  );
};

export default TrendingPicks;
