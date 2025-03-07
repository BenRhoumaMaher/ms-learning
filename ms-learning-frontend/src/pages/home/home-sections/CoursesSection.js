import React from 'react'

const CoursesSection = () => {
  return (
    <section className='courses-section'>
      <div className='container text-center'>
        <h2 className='fw-bold'>
          Transform Your Skills with Courses Designed for You
        </h2>
        <p className='text-muted'>
          From AI to Art, Learn Anything, Anytime, in Any Language
        </p>

        <div className='categories-container d-flex justify-content-center flex-wrap mt-4'>
          {[
            'Category 1',
            'Category 2',
            'Category 3',
            'Category 4',
            'Category 5',
            'Category 6'
          ].map((category, index) => (
            <button
              key={index}
              className={`btn category-btn ${index === 3 ? 'active' : ''}`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className='row mt-5'>
          {[1, 2, 3].map((item, index) => (
            <div key={index} className='col-md-4'>
              <div className='course-card'>
                <div className='course-image'>
                  <i className='bi bi-image'></i>
                </div>
                <div className='course-info'>
                  <h5 className='text-danger'>Course Name</h5>
                  <p className='text-primary'>Brief description</p>
                  <p className='text-success'>Instructor name</p>
                  <div className='rating'>★ ★ ☆ ☆ ☆</div>
                  <p className='price text-warning'>Price $</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CoursesSection
