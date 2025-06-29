import React from 'react'

const CourseActions = ({ setDeleteModalOpen, setShowContentModal }) => {
  return (
    <div className='row justify-content-center'>
      <div className='col-md-8'>
        <div className='row'>
          {/* Edit Course Section
          <div className='col-md-4'>
            <div className='insctrucours-step'>
              <div className='insctrucours-step-number'>01</div>
              <div className='insctrucours-step-content'>
                <p className='insctrucours-step-title'>Edit Course</p>
                <p className='insctrucours-step-text'>
                  Edit course content, description, and settings.
                </p>
                <button
                  className='btn btn-warning mt-2'
                  data-bs-toggle='modal'
                  data-bs-target='#editCourseModal'
                >
                  Edit
                </button>
              </div>
            </div>
          </div> */}

          {/* New Content Section */}
          <div className='col-md-4'>
            <div className='insctrucours-step'>
              <div className='insctrucours-step-number'>02</div>
              <div className='insctrucours-step-content'>
                <p className='insctrucours-step-title'>New Content</p>
                <p className='insctrucours-step-text'>
                  Add new lessons or resources.
                </p>
                <button
                  className='btn btn-primary mt-2'
                  onClick={() => setShowContentModal(true)}
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Delete Section */}
          <div className='col-md-4'>
            <div className='insctrucours-step'>
              <div className='insctrucours-step-number'>03</div>
              <div className='insctrucours-step-content'>
                <p className='insctrucours-step-title'>Delete Course</p>
                <p className='insctrucours-step-text'>
                  Permanently delete a course.
                </p>
                <button
                  className='btn btn-danger mt-2'
                  onClick={() => setDeleteModalOpen(true)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseActions
