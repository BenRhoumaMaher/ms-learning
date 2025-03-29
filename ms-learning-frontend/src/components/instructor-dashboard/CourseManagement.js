import React from 'react'
import { Row, Col, Button, Alert } from 'react-bootstrap'

const CourseManagement = ({ state, setState }) => {
  return (
    <>
      <h2 className='insctrucours-title'>Manage Courses</h2>
      <p className='insctrucours-subtitle'>Easily manage your existing ones</p>

      {state.successMessage && (
        <Alert variant='success'>{state.successMessage}</Alert>
      )}

      <Row className='justify-content-center'>
        <Col md={8}>
          <Row>
            <Col md={4}>
              <div className='insctrucours-step'>
                <div className='insctrucours-step-number'>01</div>
                <div className='insctrucours-step-content'>
                  <p className='insctrucours-step-title'>Edit Course</p>
                  <h4 className='insctrucours-step-text'>
                    Edit course content, description, and settings.
                  </h4>
                  <Button
                    variant='warning'
                    className='mt-2'
                    data-bs-toggle='modal'
                    data-bs-target='#editCourseModal'
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </Col>

            <Col md={4}>
              <div className='insctrucours-step'>
                <div className='insctrucours-step-number'>02</div>
                <div className='insctrucours-step-content'>
                  <p className='insctrucours-step-title'>New Content</p>
                  <h4 className='insctrucours-step-text'>
                    Add new lessons or resources.
                  </h4>
                  <Button
                    variant='primary'
                    className='mt-2'
                    onClick={() =>
                      setState(prev => ({ ...prev, showContentModal: true }))
                    }
                  >
                    Add
                  </Button>
                </div>
              </div>
            </Col>

            <Col md={4}>
              <div className='insctrucours-step'>
                <div className='insctrucours-step-number'>03</div>
                <div className='insctrucours-step-content'>
                  <p className='insctrucours-step-title'>Delete Course</p>
                  <h4 className='insctrucours-step-text'>
                    Permanently delete a course.
                  </h4>
                  <Button
                    variant='danger'
                    className='mt-2'
                    onClick={() =>
                      setState(prev => ({ ...prev, deleteModalOpen: true }))
                    }
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  )
}

export default CourseManagement
