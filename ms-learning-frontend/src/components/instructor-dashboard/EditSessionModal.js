import React from 'react'
import { Modal, Button, Form } from 'react-bootstrap'

const EditSessionModal = ({
  show,
  onHide,
  lessonDetails,
  loading,
  onInputChange,
  onSave
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Lesson</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {lessonDetails ? (
          <Form>
            <Form.Group className='mb-3'>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type='text'
                name='title'
                value={lessonDetails.title}
                onChange={onInputChange}
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Content</Form.Label>
              <Form.Control
                as='textarea'
                rows={3}
                name='content'
                value={lessonDetails.content}
                onChange={onInputChange}
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type='datetime-local'
                name='liveStartTime'
                value={lessonDetails.liveStartTime || ''}
                onChange={onInputChange}
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type='datetime-local'
                name='liveEndTime'
                value={lessonDetails.liveEndTime || ''}
                onChange={onInputChange}
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Position</Form.Label>
              <Form.Control
                type='number'
                name='position'
                value={lessonDetails.position}
                onChange={onInputChange}
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Meeting Link</Form.Label>
              <Form.Control
                type='text'
                name='liveMeetingLink'
                value={lessonDetails.liveMeetingLink}
                onChange={onInputChange}
              />
            </Form.Group>
          </Form>
        ) : (
          <p>Loading lesson details...</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onHide}>
          Cancel
        </Button>
        <Button variant='primary' onClick={onSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default EditSessionModal
