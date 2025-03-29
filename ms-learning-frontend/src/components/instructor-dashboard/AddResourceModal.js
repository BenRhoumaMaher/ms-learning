import React from 'react'

const AddResourceModal = ({
  showAddResourceModal,
  selectedCourseForResource,
  selectedModuleForResource,
  selectedLessonForResource,
  resourceFile,
  coursesWithLessonsNoResources,
  loading,
  setShowAddResourceModal,
  setSelectedCourseForResource,
  setSelectedModuleForResource,
  setSelectedLessonForResource,
  setResourceFile,
  handleAddResource
}) => {
  if (!showAddResourceModal) return null

  return (
    <div
      className='modal show'
      style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className='modal-dialog modal-lg'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>Add Resource to Lesson</h5>
            <button
              type='button'
              className='btn-close'
              onClick={() => {
                setShowAddResourceModal(false)
                setSelectedCourseForResource('')
                setSelectedModuleForResource('')
                setSelectedLessonForResource('')
                setResourceFile(null)
              }}
            ></button>
          </div>
          <div className='modal-body'>
            <div className='row'>
              <div className='col-md-4 mb-3'>
                <label htmlFor='courseSelectForResource' className='form-label'>
                  Select Course
                </label>
                <select
                  id='courseSelectForResource'
                  className='form-select'
                  value={selectedCourseForResource}
                  onChange={e => {
                    setSelectedCourseForResource(e.target.value)
                    setSelectedModuleForResource('')
                    setSelectedLessonForResource('')
                  }}
                >
                  <option value=''>-- Select Course --</option>
                  {coursesWithLessonsNoResources.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCourseForResource && (
                <div className='col-md-4 mb-3'>
                  <label
                    htmlFor='moduleSelectForResource'
                    className='form-label'
                  >
                    Select Module
                  </label>
                  <select
                    id='moduleSelectForResource'
                    className='form-select'
                    value={selectedModuleForResource}
                    onChange={e => {
                      setSelectedModuleForResource(e.target.value)
                      setSelectedLessonForResource('')
                    }}
                  >
                    <option value=''>-- Select Module --</option>
                    {coursesWithLessonsNoResources
                      .find(
                        c =>
                          c.id.toString() ===
                          selectedCourseForResource.toString()
                      )
                      ?.modules?.map(module => (
                        <option key={module.id} value={module.id}>
                          {module.title}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {selectedModuleForResource && (
                <div className='col-md-4 mb-3'>
                  <label
                    htmlFor='lessonSelectForResource'
                    className='form-label'
                  >
                    Select Lesson
                  </label>
                  <select
                    id='lessonSelectForResource'
                    className='form-select'
                    value={selectedLessonForResource}
                    onChange={e => setSelectedLessonForResource(e.target.value)}
                  >
                    <option value=''>-- Select Lesson --</option>
                    {coursesWithLessonsNoResources
                      .find(
                        c =>
                          c.id.toString() ===
                          selectedCourseForResource.toString()
                      )
                      ?.modules?.find(
                        m =>
                          m.id.toString() ===
                          selectedModuleForResource.toString()
                      )
                      ?.lessons?.map(lesson => (
                        <option key={lesson.id} value={lesson.id}>
                          {lesson.title}
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </div>

            {selectedLessonForResource && (
              <div className='mb-3'>
                <label htmlFor='resourceFile' className='form-label'>
                  Resource File*
                </label>
                <input
                  type='file'
                  className='form-control'
                  id='resourceFile'
                  onChange={e => setResourceFile(e.target.files[0])}
                  required
                />
                <small className='text-muted'>
                  Upload supplementary materials (PNG, JPG, JPEG, etc.)
                </small>
              </div>
            )}
          </div>
          <div className='modal-footer'>
            <button
              type='button'
              className='btn btn-secondary'
              onClick={() => {
                setShowAddResourceModal(false)
                setSelectedCourseForResource('')
                setSelectedModuleForResource('')
                setSelectedLessonForResource('')
                setResourceFile(null)
              }}
            >
              Cancel
            </button>
            <button
              type='button'
              className='btn btn-primary'
              onClick={handleAddResource}
              disabled={!selectedLessonForResource || !resourceFile || loading}
            >
              Add Resource
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddResourceModal
