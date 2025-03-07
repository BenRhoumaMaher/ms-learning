import React from "react";
import Carousel from "react-bootstrap/Carousel";
import ProgressBar from "react-bootstrap/ProgressBar";


const BrainyStatsSection = () => {
  const progressData = [
    { value: 78, color: "primary" },
    { value: 50, color: "info" },
    { value: 61, color: "warning" },
    { value: 70, color: "warning" },
  ];

  return (
    <div className="container text-center my-5">
      <h2><strong>Your Brainy Stats</strong></h2>
      <p>Spy on your study habits and hack your way to genius mode</p>

      <div className="row mt-4">
        <div className="col-md-4 text-end">
          {progressData.map((item, index) => (
            <div key={index} className="mb-2 h-100">
              <ProgressBar className="h-100" now={item.value} label={`${item.value}%`} variant={item.color} />
            </div>
          ))}
          <p className="text-danger fw-bold">Total study hours this week</p>
        </div>

        <div className="col-md-4">
          <div className="status-labels mb-2">
            <span className="badge bg-danger">in progress</span>
            <span className="badge bg-success ms-2">completed</span>
          </div>

          <Carousel indicators={false} interval={3000}>
            <Carousel.Item>
              <div className="carousel-item-content">
              <div className="col-md-6 d-flex justify-content-center bg-info p-5 w-100">
                <i className="bi bi-image" style={{ fontSize: "4rem", color: "white" }}></i>
              </div>
                <p className="mt-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className="carousel-item-content">
              <div className="col-md-6 d-flex justify-content-center bg-info p-5 w-100">
                <i className="bi bi-image" style={{ fontSize: "4rem", color: "white" }}></i>
              </div>
                <p className="mt-3">Sed do eiusmod tempor incididunt ut labore et dolore.</p>
              </div>
            </Carousel.Item>
          </Carousel>
        </div>

        <div className="col-md-4 text-start">
          <div className="interaction-box bg-danger"></div>
          <div className="interaction-box bg-secondary"></div>
          <div className="interaction-box bg-primary"></div>
          <p className="text-danger fw-bold">MS-CONNECT interactions</p>
        </div>
      </div>
    </div>
  );
};

export default BrainyStatsSection;
