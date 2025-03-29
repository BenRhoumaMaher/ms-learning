import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { Pie } from 'react-chartjs-2'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'
import { useNavigate } from 'react-router-dom'

Chart.register(ArcElement, Tooltip, Legend)

const DashboardHero = () => {
  const data = {
    datasets: [
      {
        data: [50, 20, 15, 15], // Adjust these values based on actual data
        backgroundColor: ['#FFCC00', '#009cfa', '#133337', '#7bc043'],
        hoverOffset: 4
      }
    ]
  }

  const navigate = useNavigate()
  const redirectToCreateCourse = () => {
    navigate('/create-course')
  }

  const redirectToSchedulelesson = () => {
    navigate('/instructor-calendar')
  }

  return (
    <Container fluid className='dashboard-hero'>
      <Row className='align-items-center'>
        <Col md={6} className='dashboard-left text-center'>
          <h2 className='dashboard-title'>Welcome Back</h2>
          <p className='dashboard-subtitle'>Let’s make today productive</p>
          <div className='dashboard-buttons'>
            <Button
              className='dashboard-btn-primary'
              onClick={redirectToCreateCourse}
            >
              Create New Course
            </Button>
            <Button
              className='dashboard-btn-secondary'
              onClick={redirectToSchedulelesson}
            >
              Schedule a Live Session
            </Button>
          </div>
        </Col>

        <Col md={6} className='dashboard-right'>
          <div className='dashboard-content'>
            <div className='dashboard-chart'>
              <Pie data={data} />
            </div>
            <div className='dashboard-stats'>
              <p>
                You have <strong>5 active courses</strong>
              </p>
              <p>
                <strong>3,200 learners</strong> enrolled
              </p>
              <p>
                <strong>$2,500</strong> earned
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default DashboardHero
