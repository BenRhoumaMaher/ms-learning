import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const CourscatlHero = () => {
  return (
    <div className="container courscatl-hero">
      <div className="row align-items-center">
        <div className="col-md-6">
          <h4 className="courscatl-title">
            Welcome, <span className="courscatl-username">"User’s Name"</span>{" "}
            Ready to continue learning?
          </h4>
          <p className="courscatl-link">
            <a href="/" className="courscatl-add-interests">
              Add interests for future recommendations
            </a>
          </p>
          <button className="btn courscatl-btn">Start Free 07-Day Trial</button>
        </div>

        <div className="col-md-6 d-flex justify-content-center">
          <div className="courscatl-image-placeholder"></div>
        </div>
      </div>
    </div>
  );
};

export default CourscatlHero;
