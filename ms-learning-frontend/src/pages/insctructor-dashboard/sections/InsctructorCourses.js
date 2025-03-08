import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";


const InsctructorCourses = () => {
  return (
    <div className="container insctrucours-container">
      <h2 className="insctrucours-title">Create & Manage Courses</h2>
      <p className="insctrucours-subtitle">
        Easily create new courses and manage your existing ones
      </p>

      <div className="row justify-content-center">
        <div className="col-md-4 text-center">
          <div className="insctrucours-icon-container">
            <div className="insctrucours-icon">📋</div>
            <p className="insctrucours-icon-text">Create New Course</p>
          </div>
        </div>

        <div className="col-md-8">
          <div className="row">
            <div className="col-md-4">
              <div className="insctrucours-step">
                <div className="insctrucours-step-number">01</div>
                <div className="insctrucours-step-content">
                  <p className="insctrucours-step-title">Edit Course</p>
                  <p className="insctrucours-step-text">
                    Edit course content, description, and settings.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="insctrucours-step">
                <div className="insctrucours-step-number">02</div>
                <div className="insctrucours-step-content">
                  <p className="insctrucours-step-title">New Content</p>
                  <p className="insctrucours-step-text">
                    Add new lessons, quizzes, or resources.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="insctrucours-step">
                <div className="insctrucours-step-number">03</div>
                <div className="insctrucours-step-content">
                  <p className="insctrucours-step-title">Publish/Unpublish</p>
                  <p className="insctrucours-step-text">
                    Option to publish or unpublish a course.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>  
      </div>
    </div>
  );
};

export default InsctructorCourses;
