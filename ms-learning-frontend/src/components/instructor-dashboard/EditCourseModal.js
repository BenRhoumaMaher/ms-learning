import React from 'react'

const EditCourseModal = ({
  courses,
  selectedCourseId,
  courseDetails,
  formData,
  loading,
  handleCourseChange,
  handleInputChange,
  handleUpdateCourse
}) => {
  return (
    <div
      className='modal fade'
      id='editCourseModal'
      tabIndex='-1'
      aria-hidden='true'
    >
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>Edit Course</h5>
            <button
              type='button'
              className='btn-close'
              data-bs-dismiss='modal'
              aria-label='Close'
            ></button>
          </div>
          <div className='modal-body'>
            {loading ? (
              <div className='text-center'>
                <div className='spinner-border' role='status'>
                  <span className='visually-hidden'>Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <label htmlFor='courseSelect' className='form-label'>
                  Select a Course
                </label>
                <select
                  id='courseSelect'
                  className='form-select'
                  value={selectedCourseId}
                  onChange={handleCourseChange}
                >
                  <option value=''>-- Select Course --</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>

                {courseDetails && (
                  <div className='mt-3'>
                    <label className='form-label'>Title</label>
                    <input
                      type='text'
                      className='form-control'
                      name='title'
                      value={formData.title}
                      onChange={handleInputChange}
                    />

                    <label className='form-label mt-2'>Description</label>
                    <textarea
                      className='form-control'
                      name='description'
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                    />

                    <label className='form-label mt-2'>Duration</label>
                    <input
                      type='text'
                      className='form-control'
                      name='duration'
                      value={formData.duration}
                      onChange={handleInputChange}
                    />

                    <label className='form-label mt-2'>Level</label>
                    <select
                      className='form-select'
                      name='level'
                      value={formData.level}
                      onChange={handleInputChange}
                    >
                      <option value='beginner'>Beginner</option>
                      <option value='intermediate'>Intermediate</option>
                      <option value='advanced'>Advanced</option>
                    </select>

                    <label className='form-label mt-2'>Price ($)</label>
                    <input
                      type='number'
                      className='form-control'
                      name='price'
                      value={formData.price}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>
          <div className='modal-footer'>
            <button
              type='button'
              className='btn btn-secondary'
              data-bs-dismiss='modal'
            >
              Cancel
            </button>
            <button
              type='button'
              className='btn btn-primary'
              onClick={handleUpdateCourse}
              disabled={!selectedCourseId || loading}
            >
              {loading ? 'Updating...' : 'Modify'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditCourseModal
