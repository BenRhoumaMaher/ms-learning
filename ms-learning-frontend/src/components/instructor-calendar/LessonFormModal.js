import React from 'react'
import { Modal, Button, Form, Alert } from 'react-bootstrap'

const LessonFormModal = ({
  show,
  onHide,
  state,
  setState,
  months,
  handleSaveLesson,
  getModulesForSelectedCourse
}) => {
  const {
    selectedDate,
    currentMonth,
    currentYear,
    selectedCourse,
    selectedModule,
    lessonForm,
    message,
    loading,
    userCourses
  } = state

  const handleInputChange = e => {
    const { name, value } = e.target
    setState(prev => ({
      ...prev,
      lessonForm: { ...prev.lessonForm, [name]: value }
    }))
  }

  const handleFileChange = e => {
    const file = e.target.files[0]
    if (file) {
      setState(prev => ({
        ...prev,
        lessonForm: {
          ...prev.lessonForm,
          resources: file,
          resourcesPreview: URL.createObjectURL(file)
        }
      }))
    }
  }

  const clearResources = () => {
    setState(prev => ({
      ...prev,
      lessonForm: {
        ...prev.lessonForm,
        resources: null,
        resourcesPreview: ''
      }
    }))
  }

  const handleCourseSelect = e => {
    setState(prev => ({
      ...prev,
      selectedCourse: e.target.value,
      selectedModule: '',
      lessonForm: {
        ...prev.lessonForm,
        position: ''
      }
    }))
  }

  const handleModuleSelect = e => {
    setState(prev => ({
      ...prev,
      selectedModule: e.target.value
    }))
  }

  return (
    <Modal show={show} onHide={onHide} size='lg'>
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedDate &&
            `${selectedDate} ${months[currentMonth]} ${currentYear}`}{' '}
          - Schedule a Live Lesson
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message.text && (
          <Alert
            variant={message.type}
            onClose={() =>
              setState(prev => ({ ...prev, message: { text: '', type: '' } }))
            }
            dismissible
          >
            {message.text}
          </Alert>
        )}

        {loading && !message.text ? (
          <div className='text-center'>Loading...</div>
        ) : userCourses.length > 0 ? (
          <>
            <Form.Group controlId='courseSelect' className='mb-3'>
              <Form.Label>Select a course:</Form.Label>
              <Form.Control
                as='select'
                value={selectedCourse}
                onChange={handleCourseSelect}
                disabled={loading}
                required
              >
                <option value=''>-- Choose a Course --</option>
                {userCourses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            {selectedCourse && (
              <Form.Group controlId='moduleSelect' className='mb-3'>
                <Form.Label>Select a module:</Form.Label>
                <Form.Control
                  as='select'
                  value={selectedModule}
                  onChange={handleModuleSelect}
                  disabled={loading || !selectedCourse}
                  required
                >
                  <option value=''>-- Choose a Module --</option>
                  {getModulesForSelectedCourse().map(module => (
                    <option key={module.id} value={module.id}>
                      {module.title}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            )}

            {selectedModule && (
              <div className='lesson-form mt-4'>
                <h5>Lesson Details</h5>
                <Form.Group className='mb-3'>
                  <Form.Label>Lesson Title *</Form.Label>
                  <Form.Control
                    type='text'
                    name='title'
                    value={lessonForm.title}
                    onChange={handleInputChange}
                    placeholder='Enter lesson title'
                    required
                  />
                </Form.Group>

                <Form.Group className='mb-3'>
                  <Form.Label>Content *</Form.Label>
                  <Form.Control
                    as='textarea'
                    rows={3}
                    name='content'
                    value={lessonForm.content}
                    onChange={handleInputChange}
                    placeholder='Enter lesson content'
                    required
                  />
                </Form.Group>

                <div className='row'>
                  <Form.Group className='col-md-6 mb-3'>
                    <Form.Label>Start Time (HH:MM) *</Form.Label>
                    <Form.Control
                      type='time'
                      name='startTime'
                      value={lessonForm.startTime}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className='col-md-6 mb-3'>
                    <Form.Label>End Time (HH:MM) *</Form.Label>
                    <Form.Control
                      type='time'
                      name='endTime'
                      value={lessonForm.endTime}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </div>

                <Form.Group className='mb-3'>
                  <Form.Label>Position in Module *</Form.Label>
                  <Form.Control
                    type='number'
                    min='1'
                    name='position'
                    value={lessonForm.position}
                    onChange={handleInputChange}
                    placeholder='Enter position number'
                    required
                  />
                </Form.Group>

                <Form.Group className='mb-3'>
                  <Form.Label>Meeting Link *</Form.Label>
                  <Form.Control
                    type='url'
                    name='meetingLink'
                    value={lessonForm.meetingLink}
                    onChange={handleInputChange}
                    placeholder='https://example.com/meeting'
                    required
                  />
                </Form.Group>

                <Form.Group className='mb-3'>
                  <Form.Label>Resources (Optional)</Form.Label>
                  <Form.Control
                    type='file'
                    onChange={handleFileChange}
                    accept='.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png'
                  />
                  {lessonForm.resourcesPreview && (
                    <div className='mt-2'>
                      <span className='me-2'>{lessonForm.resources.name}</span>
                      <Button
                        variant='outline-danger'
                        size='sm'
                        onClick={clearResources}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </Form.Group>
              </div>
            )}
          </>
        ) : (
          <div className='text-center'>No courses available</div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onHide} disabled={loading}>
          Close
        </Button>
        <Button
          variant='primary'
          onClick={handleSaveLesson}
          disabled={
            loading ||
            !selectedCourse ||
            !selectedModule ||
            !lessonForm.title ||
            !lessonForm.content ||
            !lessonForm.startTime ||
            !lessonForm.endTime ||
            !lessonForm.position ||
            !lessonForm.meetingLink
          }
        >
          {loading ? 'Scheduling...' : 'Schedule Lesson'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default LessonFormModal
