import React from 'react'

const DeleteCourseModal = ({
  deleteModalOpen,
  courseToDelete,
  courses,
  loading,
  setDeleteModalOpen,
  setCourseToDelete,
  handleDeleteCourse
}) => {
  if (!deleteModalOpen) return null

  return (
    <div
      className='modal show'
      style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>Delete Course</h5>
            <button
              type='button'
              className='btn-close'
              onClick={() => setDeleteModalOpen(false)}
              disabled={loading}
            ></button>
          </div>
          <div className='modal-body'>
            <label htmlFor='deleteCourseSelect' className='form-label'>
              Select a Course to Delete
            </label>
            <select
              id='deleteCourseSelect'
              className='form-select'
              value={courseToDelete || ''}
              onChange={e => setCourseToDelete(e.target.value)}
              disabled={loading}
            >
              <option value=''>-- Select Course --</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
            {courseToDelete && (
              <div className='alert alert-danger mt-3'>
                <strong>Warning!</strong> Are you sure you want to delete this
                course? This action cannot be undone and all course content will
                be permanently removed.
              </div>
            )}
          </div>
          <div className='modal-footer'>
            <button
              type='button'
              className='btn btn-secondary'
              onClick={() => setDeleteModalOpen(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type='button'
              className='btn btn-danger'
              onClick={handleDeleteCourse}
              disabled={!courseToDelete || loading}
            >
              {loading ? (
                <>
                  <span
                    className='spinner-border spinner-border-sm'
                    role='status'
                    aria-hidden='true'
                  ></span>
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteCourseModal
