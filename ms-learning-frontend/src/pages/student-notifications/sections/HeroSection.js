import React from 'react';

const HeroSection = () => {
  return (
    <section className="container my-5">
      <div className="d-grid gap-5 align-items-center text-center text-md-start hero-grid">
        
        <div className="hero-left">
          <h3 className="fw-bold h5">Stay in the Loop, Student Name</h3>
          <p className="text-primary">
            Never miss an update, here’s everything <br /> you need to know
          </p>
          <div>
            <i className="fas fa-bell fa-10x text-info"></i>
          </div>
        </div>

        <div className="hero-right">
          <div>
            <i className="fa-solid fa-clipboard-list fa-10x text-danger"></i>
          </div>
          <p className="mt-3">
            You have <span className="text-danger fw-bold">3 new messages</span>{' '}
            <br />
            and <span className="text-danger fw-bold">2 upcoming live sessions</span>
          </p>
          <button className="btn btn-outline-info">Mark All as Read</button>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
