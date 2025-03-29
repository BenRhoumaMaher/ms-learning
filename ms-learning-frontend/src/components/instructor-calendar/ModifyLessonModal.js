import React, { useState } from 'react'
import { Modal, Button, Form, Alert } from 'react-bootstrap'

const ModifyLessonModal = ({
  show,
  onHide,
  lesson,
  onSubmit,
  isLoading,
  alert,
  setAlert
}) => {
  const [formData, setFormData] = useState({
    title: lesson?.title || '',
    content: lesson?.content || '',
    liveStartTime: lesson?.liveStartTime?.split('T')[1].slice(0, 5) || '',
    liveEndTime: lesson?.liveEndTime?.split('T')[1].slice(0, 5) || '',
    position: lesson?.position || '',
    liveMeetingLink: lesson?.liveMeetingLink || ''
  })

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = e => {
    e.preventDefault()

    const requiredFields = [
      'title',
      'content',
      'liveStartTime',
      'liveEndTime',
      'position',
      'liveMeetingLink'
    ]
    const missingFields = requiredFields.filter(field => !formData[field])

    if (missingFields.length > 0) {
      setAlert({
        show: true,
        message: 'Please fill all required fields',
        variant: 'danger'
      })
      return
    }

    const datePart = lesson.liveStartTime.split('T')[0]
    const payload = {
      title: formData.title,
      content: formData.content,
      liveStartTime: `${datePart}T${formData.liveStartTime}:00`,
      liveEndTime: `${datePart}T${formData.liveEndTime}:00`,
      position: formData.position,
      liveMeetingLink: formData.liveMeetingLink
    }

    onSubmit(lesson.id, payload)
  }

  return (
    <Modal show={show} onHide={onHide} size='lg'>
      <Modal.Header closeButton>
        <Modal.Title>Modify Live Session</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {alert.show && (
          <Alert
            variant={alert.variant}
            onClose={() => setAlert({ ...alert, show: false })}
            dismissible
          >
            {alert.message}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className='mb-3'>
            <Form.Label>Title *</Form.Label>
            <Form.Control
              type='text'
              name='title'
              value={formData.title}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label>Content *</Form.Label>
            <Form.Control
              as='textarea'
              rows={3}
              name='content'
              value={formData.content}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />
          </Form.Group>

          <div className='row'>
            <Form.Group className='col-md-6 mb-3'>
              <Form.Label>Start Time *</Form.Label>
              <Form.Control
                type='time'
                name='liveStartTime'
                value={formData.liveStartTime}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </Form.Group>

            <Form.Group className='col-md-6 mb-3'>
              <Form.Label>End Time *</Form.Label>
              <Form.Control
                type='time'
                name='liveEndTime'
                value={formData.liveEndTime}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </Form.Group>
          </div>

          <Form.Group className='mb-3'>
            <Form.Label>Position *</Form.Label>
            <Form.Control
              type='number'
              min='1'
              name='position'
              value={formData.position}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label>Meeting Link *</Form.Label>
            <Form.Control
              type='url'
              name='liveMeetingLink'
              value={formData.liveMeetingLink}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />
          </Form.Group>

          <div className='d-flex justify-content-end'>
            <Button
              variant='secondary'
              onClick={onHide}
              className='me-2'
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button variant='primary' type='submit' disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default ModifyLessonModal
