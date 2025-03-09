import React from "react";
import { FaQuoteLeft } from "react-icons/fa";

const InstructorSuccessStories = () => {
  return (
    <section className="container text-center mt-5">
      <h2 className="fw-bold">Instructor Success Stories</h2>
      <p className="text-muted">
        Hear from instructors who’ve transformed lives and built careers with us.
      </p>

      <div className="row mt-5 align-items-center justify-content-between">
        <div className="col-md-5 position-relative d-flex justify-content-center">
          <div className="testimonial-box">
            <div className="testimonial-circle">
              <FaQuoteLeft size={25} color="white" />
            </div>
            <div className="testimonial-content text-center">
              <h5 className="testimonial-title">Testimonial</h5>
              <p className="testimonial-text">
                I turned my passion into a full-time career!
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-5 position-relative d-flex justify-content-center align-items-center">
          <div className="overlapping-box"></div>
          <div className="overlapping-box second-box"></div>
        </div>
      </div>
      <p className="small text-muted mt-5 text-end">instructors sharing their experiences</p>
    </section>
  );
};

export default InstructorSuccessStories;
