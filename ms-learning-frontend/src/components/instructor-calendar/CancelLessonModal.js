import React from 'react'
import ReactDOM from 'react-dom'
import { Modal, Button, Form, Alert } from 'react-bootstrap'

const CancelLessonModal = ({
  show,
  onHide,
  lesson,
  onSubmit,
  isLoading,
  alert,
  setAlert,
  cancelAction,
  setCancelAction,
  videoUrl,
  setVideoUrl
}) => {
  const handleConfirm = () => {
    if (cancelAction === 'convert' && !videoUrl) {
      setAlert({
        show: true,
        message: 'Please enter a video URL',
        variant: 'danger'
      })
      return
    }
    onSubmit(cancelAction)
  }

  return ReactDOM.createPortal(
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Cancel Live Session</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>What would you like to do with this session?</p>
        <div className='d-flex flex-column gap-2 mb-3'>
          <Button
            variant={cancelAction === 'convert' ? 'warning' : 'outline-warning'}
            onClick={() => setCancelAction('convert')}
            disabled={isLoading}
            className='text-start'
          >
            <strong>Convert to Registered Session</strong>
            <div className='text-muted small'>
              Keep the lesson but change it to a recorded format
            </div>
          </Button>
          <Button
            variant={cancelAction === 'delete' ? 'danger' : 'outline-danger'}
            onClick={() => setCancelAction('delete')}
            disabled={isLoading}
            className='text-start'
          >
            <strong>Delete Session</strong>
            <div className='text-muted small'>
              Permanently remove this lesson
            </div>
          </Button>
        </div>

        {cancelAction === 'convert' && (
          <Form.Group className='mb-3'>
            <Form.Label>Video URL *</Form.Label>
            <Form.Control
              type='url'
              placeholder='Enter video URL for the registered session'
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              required
            />
            <Form.Text className='text-muted'>
              Please provide the URL where the session recording can be accessed
            </Form.Text>
          </Form.Group>
        )}

        {alert.show && (
          <Alert
            variant={alert.variant}
            dismissible
            onClose={() => setAlert({ ...alert, show: false })}
          >
            {alert.message}
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onHide} disabled={isLoading}>
          Back
        </Button>
        <Button
          variant='primary'
          onClick={handleConfirm}
          disabled={!cancelAction || isLoading}
        >
          {isLoading ? 'Processing...' : 'Confirm'}
        </Button>
      </Modal.Footer>
    </Modal>,
    document.getElementById('modal-root')
  )
}

export default CancelLessonModal
