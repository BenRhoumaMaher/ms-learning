import React from 'react';

const NewCoursesSection = () => {
  return (
    <section className='section-container'>
      <div className='container'>

        <div className='text-start mb-4'>
          <h3 className='fw-bold'>New Courses for You</h3>
          <p className='text-primary'>
            Expand your skills with these personalized recommendations
          </p>
        </div>

        <div className='feature-container'>

          <div className='feature-box course-cards'>
            <div className='course-top bg-primary'></div>
            <div className='course-icon'>
              <i className='bi bi-book'></i>
            </div>
            <h5 className='course-title text-danger fw-bold'>Course Title</h5>
            <p className='feature-text text-center'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
            </p>
            <button className='btn btn-info'>Enroll</button>
          </div>

          <div className='feature-box course-cards'>
            <div className='course-top bg-success'></div>
            <div className='course-icon'>
              <i className='bi bi-book'></i>
            </div>
            <h5 className='course-title text-danger fw-bold'>Course Title</h5>
            <p className='feature-text text-center'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
            </p>
            <button className='btn btn-info'>Enroll</button>
          </div>

          <div className='feature-box course-cards'>
            <div className='course-top bg-warning'></div>
            <div className='course-icon'>
              <i className='bi bi-book'></i>
            </div>
            <h5 className='course-title text-danger fw-bold'>Course Title</h5>
            <p className='feature-text text-center'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
            </p>
            <button className='btn btn-info'>Enroll</button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default NewCoursesSection;
