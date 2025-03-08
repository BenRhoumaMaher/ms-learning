import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'

const QuizHero = () => {
  return (
    <Container className='quiz-hero py-5'>
      <Row className='align-items-center justify-content-between'>
        <Col md={5}>
          <h2 className='fw-bold'>Ready to Test Your Knowledge? Let’s Go</h2>
          <p className='text-primary fw-bold'>
            This quiz contains <span className='text-dark'>10 questions</span>
          </p>
          <p className='text-success fw-bold'>
            You have 15 minutes to complete it
          </p>
          <p className='text-danger fw-bold'>
            You cannot go back after answering a question
          </p>
        </Col>

        <Col md={5} className='text-end'>
          <i className='fas fa-images quiz-icon'></i>
          <div>
            <Button variant='success' className='mt-3 quiz-btn'>
              I'm Ready
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default QuizHero
