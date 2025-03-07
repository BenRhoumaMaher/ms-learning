import React from 'react';

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
            <button className="btn btn-outline-primary mx-2">Join a Learning Group</button>
            <button className="btn btn-outline-success mx-2">Enroll in a New Course</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DontStopNowSection;
