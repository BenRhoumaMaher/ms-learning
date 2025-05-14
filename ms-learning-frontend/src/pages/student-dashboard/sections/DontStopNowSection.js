import React from 'react';
import { Link } from 'react-router-dom';

const DontStopNowSection = () => {
  return (
    <section className="d-flex flex-column align-items-center text-center my-5">
      <div className="d-flex w-100 p-5">
        <div className="w-50 bg-info text-white d-flex align-items-center justify-content-center py-5">
          <div className='certificate-icon'>
            <i className='fas fa-book fa-5x text-light'></i>
          </div>
        </div>
        <div className="w-50 bg-light d-flex flex-column align-items-center justify-content-center py-5">
          <h3 className="text-danger fw-bold">Don’t Stop Now!</h3>
          <div className="mt-3">
            <Link to="/course-catalog" className="btn btn-outline-success mx-2">
              Enroll in a New Course
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DontStopNowSection;
