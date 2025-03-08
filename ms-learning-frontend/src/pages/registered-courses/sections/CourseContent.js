import React from "react";

const CourseContent = () => {
  return (
    <div className="container mt-5">
      <h2 className="text-center fw-bold">Course Content</h2>
      <p className="text-center text-muted">
        Explore the lessons, quizzes, and resources to master this course
      </p>

      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card registered-sidebar bg-light">
            <div className="card-header text-center fw-bold">
              Mastering React.js
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">Module 1: Introduction</li>
              <li className="list-group-item bg-light">Module 2</li>
              <li className="list-group-item">Module 3</li>
              <li className="list-group-item">Module 4</li>
              <li className="list-group-item text-danger fw-bold">
                Special Live Session in 3 days
              </li>
              <li className="list-group-item">Quiz & Certificate</li>
            </ul>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card registered-content">
            <div className="card-body">
              <ul className="list-group">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Lesson 1: Course Overview (Completed)
                  <span className="btn btn-success btn-sm">▶</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Lesson 2: React Basics (Completed)
                  <span className="btn btn-success btn-sm">▶</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Lesson 3: State Management (In Progress)
                  <span className="btn btn-success btn-sm">▶</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Lesson 4: Advanced Hooks (Locked - Complete previous lesson to unlock)
                  <span className="btn btn-secondary btn-sm">🔒</span>
                </li>
              </ul>

              <div className="text-center mt-3">
                <button className="btn btn-success">Download Resources</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContent;
