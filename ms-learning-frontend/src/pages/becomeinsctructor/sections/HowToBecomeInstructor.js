import React from "react";


const BecomeInstructor = () => {
  return (
    <section className="container text-center mt-5">
      <h2 className="fw-bold">How to Become an Instructor</h2>
      <p className="text-muted mb-5">
        Follow these simple steps to start teaching on our platform
      </p>

      <div className="position-relative mt-5">
        <div className="row text-center justify-content-center align-items-start">

          <div className="col-md-3 position-relative becoinstr-step">
            <div className="becoinstr-circle"></div>
            <h5 className="becoinstr-title">Apply</h5>
            <p className="becoinstr-text">
              Fill out the instructor application form
            </p>
            <div className="becoinstr-line becoinstr-line-blue"></div>
          </div>

          <div className="col-md-3 position-relative becoinstr-step">
            <div className="becoinstr-circle becoinstr-circle-green"></div>
            <h5 className="becoinstr-title">Review</h5>
            <p className="becoinstr-text">
              Our team will review your application and expertise.
            </p>
            <div className="becoinstr-line becoinstr-line-green"></div>
          </div>

          <div className="col-md-3 position-relative becoinstr-step">
            <div className="becoinstr-circle"></div>
            <h5 className="becoinstr-title">Create</h5>
            <p className="becoinstr-text">
              Start building your course with our easy-to-use tools
            </p>
            <div className="becoinstr-line becoinstr-line-warning"></div>
          </div>

          <div className="col-md-3 position-relative becoinstr-step">
            <div className="becoinstr-circle becoinstr-circle-orange"></div>
            <h5 className="becoinstr-title">Publish</h5>
            <p className="becoinstr-text">
              Launch your course and start earning
            </p>
            <div className="becoinstr-line becoinstr-line-danger"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BecomeInstructor;
