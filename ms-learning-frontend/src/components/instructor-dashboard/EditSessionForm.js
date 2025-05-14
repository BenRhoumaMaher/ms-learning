import React from 'react'
import { Form, Button } from 'react-bootstrap'

const EditSessionForm = ({
  lessonDetails,
  loading,
  onInputChange,
  onSave,
  onCancel
}) => {
  return (
    <div className="edit-session-form mt-3 p-3 border rounded">
      <h4>Edit Lesson</h4>
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
          <div className="d-flex justify-content-end gap-2">
            <Button variant='secondary' onClick={onCancel}>
              Cancel
            </Button>
            <Button variant='primary' onClick={onSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </Form>
      ) : (
        <p>Loading lesson details...</p>
      )}
    </div>
  )
}

export default EditSessionForm