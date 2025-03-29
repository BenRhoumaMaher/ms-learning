import React from 'react'

const AddLessonModal = ({
  showAddLessonModal,
  selectedCourseForLesson,
  selectedModuleForLesson,
  lessonData,
  courses,
  setShowAddLessonModal,
  setSelectedCourseForLesson,
  setSelectedModuleForLesson,
  setLessonData,
  handleAddLesson,
  validateLessonData
}) => {
  if (!showAddLessonModal) return null

  return (
    <div
      className='modal show'
      style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className='modal-dialog modal-lg'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>Add New Lesson</h5>
            <button
              type='button'
              className='btn-close'
              onClick={() => {
                setShowAddLessonModal(false)
                setSelectedCourseForLesson('')
                setSelectedModuleForLesson('')
                setLessonData({
                  title: '',
                  content: '',
                  position: '',
                  type: '',
                  liveStartTime: '',
                  liveEndTime: '',
                  liveMeetingLink: '',
                  videoUrl: '',
                  resources: null
                })
              }}
            ></button>
          </div>
          <div className='modal-body'>
            <div className='row'>
              <div className='col-md-6 mb-3'>
                <label htmlFor='courseSelectForLesson' className='form-label'>
                  Select Course
                </label>
                <select
                  id='courseSelectForLesson'
                  className='form-select'
                  value={selectedCourseForLesson}
                  onChange={e => {
                    setSelectedCourseForLesson(e.target.value)
                    setSelectedModuleForLesson('')
                  }}
                >
                  <option value=''>-- Select Course --</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className='col-md-6 mb-3'>
                <label htmlFor='moduleSelectForLesson' className='form-label'>
                  Select Module
                </label>
                <select
                  id='moduleSelectForLesson'
                  className='form-select'
                  value={selectedModuleForLesson}
                  onChange={e => setSelectedModuleForLesson(e.target.value)}
                  disabled={!selectedCourseForLesson}
                >
                  <option value=''>-- Select Module --</option>
                  {courses
                    .find(
                      course =>
                        course.id.toString() ===
                        selectedCourseForLesson.toString()
                    )
                    ?.modules.map(module => (
                      <option key={module.id} value={module.id}>
                        {module.title}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {selectedModuleForLesson && (
              <>
                <div className='row'>
                  <div className='col-md-6 mb-3'>
                    <label htmlFor='lessonTitle' className='form-label'>
                      Lesson Title*
                    </label>
                    <input
                      type='text'
                      className='form-control'
                      id='lessonTitle'
                      value={lessonData.title}
                      onChange={e =>
                        setLessonData({ ...lessonData, title: e.target.value })
                      }
                      placeholder='Enter lesson title'
                    />
                  </div>

                  <div className='col-md-6 mb-3'>
                    <label htmlFor='lessonPosition' className='form-label'>
                      Position*
                    </label>
                    <input
                      type='number'
                      className='form-control'
                      id='lessonPosition'
                      value={lessonData.position}
                      onChange={e =>
                        setLessonData({
                          ...lessonData,
                          position: e.target.value
                        })
                      }
                      placeholder='Enter position number'
                    />
                  </div>
                </div>

                <div className='mb-3'>
                  <label htmlFor='lessonContent' className='form-label'>
                    Content*
                  </label>
                  <textarea
                    className='form-control'
                    id='lessonContent'
                    value={lessonData.content}
                    onChange={e =>
                      setLessonData({ ...lessonData, content: e.target.value })
                    }
                    rows={4}
                    placeholder='Enter lesson content'
                  />
                </div>

                <div className='mb-3'>
                  <label htmlFor='lessonType' className='form-label'>
                    Lesson Type*
                  </label>
                  <select
                    className='form-select'
                    id='lessonType'
                    value={lessonData.type}
                    onChange={e =>
                      setLessonData({ ...lessonData, type: e.target.value })
                    }
                  >
                    <option value='live'>Live Lesson</option>
                    <option value='recorded'>Registered</option>
                  </select>
                </div>

                {lessonData.type === 'live' ? (
                  <div className='row'>
                    <div className='col-md-4 mb-3'>
                      <label htmlFor='liveStartTime' className='form-label'>
                        Live Start Time*
                      </label>
                      <input
                        type='datetime-local'
                        className='form-control'
                        id='liveStartTime'
                        value={lessonData.liveStartTime}
                        onChange={e =>
                          setLessonData({
                            ...lessonData,
                            liveStartTime: e.target.value
                          })
                        }
                      />
                    </div>
                    <div className='col-md-4 mb-3'>
                      <label htmlFor='liveEndTime' className='form-label'>
                        Live End Time*
                      </label>
                      <input
                        type='datetime-local'
                        className='form-control'
                        id='liveEndTime'
                        value={lessonData.liveEndTime}
                        onChange={e =>
                          setLessonData({
                            ...lessonData,
                            liveEndTime: e.target.value
                          })
                        }
                      />
                    </div>
                    <div className='col-md-4 mb-3'>
                      <label htmlFor='liveMeetingLink' className='form-label'>
                        Meeting Link*
                      </label>
                      <input
                        type='url'
                        className='form-control'
                        id='liveMeetingLink'
                        value={lessonData.liveMeetingLink}
                        onChange={e =>
                          setLessonData({
                            ...lessonData,
                            liveMeetingLink: e.target.value
                          })
                        }
                        placeholder='https://meet.google.com/xyz-abc-def'
                      />
                    </div>
                  </div>
                ) : (
                  <div className='mb-3'>
                    <label htmlFor='videoUrl' className='form-label'>
                      Video URL*
                    </label>
                    <input
                      type='url'
                      className='form-control'
                      id='videoUrl'
                      value={lessonData.videoUrl}
                      onChange={e =>
                        setLessonData({
                          ...lessonData,
                          videoUrl: e.target.value
                        })
                      }
                      placeholder='https://youtube.com/watch?v=xyz'
                    />
                  </div>
                )}

                <div className='mb-3'>
                  <label htmlFor='lessonResources' className='form-label'>
                    Resources (Optional)
                  </label>
                  <input
                    type='file'
                    className='form-control'
                    id='lessonResources'
                    onChange={e =>
                      setLessonData({
                        ...lessonData,
                        resources: e.target.files[0]
                      })
                    }
                  />
                  <small className='text-muted'>
                    Upload supplementary materials (PNG, JPG, JPEG, etc.)
                  </small>
                </div>
              </>
            )}
          </div>
          <div className='modal-footer'>
            <button
              type='button'
              className='btn btn-secondary'
              onClick={() => {
                setShowAddLessonModal(false)
                setSelectedCourseForLesson('')
                setSelectedModuleForLesson('')
                setLessonData({
                  title: '',
                  content: '',
                  position: '',
                  type: '',
                  liveStartTime: '',
                  liveEndTime: '',
                  liveMeetingLink: '',
                  videoUrl: '',
                  resources: null
                })
              }}
            >
              Cancel
            </button>
            <button
              type='button'
              className='btn btn-primary'
              onClick={handleAddLesson}
              disabled={!selectedModuleForLesson || !validateLessonData()}
            >
              Add Lesson
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddLessonModal
