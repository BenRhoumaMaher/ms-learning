import React from "react";

const KeepLearning = () => {
  return (
    <div className="lessplkeep-container">
      <h2 className="lessplkeep-title">Keep Learning</h2>
      <p className="lessplkeep-subtitle mb-5">
        Explore related courses and continue your learning journey
      </p>

      <div className="lessplkeep-courses">
        <div className="lessplkeep-card lessplkeep-inactive">
          <div className="lessplkeep-card-header">Course Title</div>
          <div className="lessplkeep-card-body">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <button className="lessplkeep-btn">Enroll</button>
          </div>
        </div>

        <div className="lessplkeep-card lessplkeep-active">
          <div className="lessplkeep-card-header">Course Title</div>
          <div className="lessplkeep-card-body">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <button className="lessplkeep-btn">Enroll</button>
          </div>
        </div>

        <div className="lessplkeep-card lessplkeep-alt">
          <div className="lessplkeep-card-header">Course Title</div>
          <div className="lessplkeep-card-body">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <button className="lessplkeep-btn">Enroll</button>
          </div>
        </div>
      </div>

      <div className="lessplkeep-pagination">
        <button className="lessplkeep-page-btn">«</button>
        <button className="lessplkeep-page-btn lessplkeep-active-page">1</button>
        <button className="lessplkeep-page-btn">2</button>
        <button className="lessplkeep-page-btn">3</button>
        <button className="lessplkeep-page-btn">...</button>
        <button className="lessplkeep-page-btn">55</button>
        <button className="lessplkeep-page-btn">»</button>
      </div>
    </div>
  );
};

export default KeepLearning;
