import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { Pie } from 'react-chartjs-2'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'
import { useNavigate } from 'react-router-dom'
import { getInstructorCourses } from '../../../helpers/api'
import { useTranslation } from 'react-i18next'

Chart.register(ArcElement, Tooltip, Legend)

const DashboardHero = () => {
  const { t } = useTranslation()
  const [instructorData, setInstructorData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        // Get current user ID from token
        const token = localStorage.getItem('token') || sessionStorage.getItem('token')
        if (!token) {
          throw new Error('No authentication token found')
        }
        
        const user = JSON.parse(atob(token.split('.')[1]))
        const userId = user?.user_id
        
        if (!userId) {
          throw new Error('User ID not found in token')
        }

        // Fetch courses with the instructor ID
        const data = await getInstructorCourses(userId)
        setInstructorData(data)
        setLoading(false)
      } catch (err) {
        console.error('Failed to fetch instructor data:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchInstructorData()
  }, [])

  const navigate = useNavigate()
  const redirectToCreateCourse = () => {
    navigate('/create-course')
  }

  const redirectToSchedulelesson = () => {
    navigate('/instructor-calendar')
  }

  // Calculate total learners across all courses
  const totalLearners = instructorData?.courses?.reduce((total, course) => {
    return total + (course.students?.length || 0)
  }, 0) || 0

  // Prepare data for the pie chart (group by category)
  const categoryData = instructorData?.courses?.reduce((acc, course) => {
    if (!course.category) return acc
    
    const existingCategory = acc.find(item => item.category === course.category)
    if (existingCategory) {
      existingCategory.count += 1
    } else {
      acc.push({ category: course.category, count: 1 })
    }
    return acc
  }, []) || []

  const chartData = {
    datasets: [
      {
        data: categoryData.length > 0 
          ? categoryData.map(item => item.count) 
          : [1], // Fallback to single value if no data
        backgroundColor: ['#FFCC00', '#009cfa', '#133337', '#7bc043', '#FF6B6B', '#4ECDC4'],
        hoverOffset: 4
      }
    ],
    labels: categoryData.length > 0 
      ? categoryData.map(item => item.category) 
      : ['Courses']
  }

  if (loading) return (
    <Container fluid className='dashboard-hero'>
      <div className="text-center py-5">{t('Loading dashboard data...')}</div>
    </Container>
  )

  if (error) return (
    <Container fluid className='dashboard-hero'>
      <div className="text-center py-5 text-danger">
        Error loading dashboard: {error}
        <div className="mt-3">
          <Button variant="primary" onClick={() => window.location.reload()}>
            {t('Try Again')}
          </Button>
        </div>
      </div>
    </Container>
  )

  return (
    <Container fluid className='dashboard-hero'>
      <Row className='align-items-center'>
        <Col md={6} className='dashboard-left text-center'>
          <h2 className='dashboard-title'>{t('Welcome Back')}, {instructorData?.username || t('Instructor')}</h2>
          <p className='dashboard-subtitle'>{t("Let's make today productive")}</p>
          <div className='dashboard-buttons'>
            <Button
              className='dashboard-btn-primary btn-success'
              onClick={redirectToCreateCourse}
            >
              {t('Create New Course')}
            </Button>
            <Button
              className='dashboard-btn-secondary btn-danger'
              onClick={redirectToSchedulelesson}
            >
              {t('Schedule a Live Session')}
            </Button>
          </div>
        </Col>

        <Col md={6} className='dashboard-right'>
          <div className='dashboard-content'>
            <div className='dashboard-chart'>
              <Pie 
                data={chartData} 
                options={{
                  plugins: {
                    legend: {
                      position: 'bottom',
                    }
                  }
                }}
              />
            </div>
            <div className='dashboard-stats'>
              <p>
                {t('You have')} <strong>{instructorData?.courses?.length || 0} {t('active courses')}</strong>
              </p>
              <p>
                <strong>{totalLearners} {t('learners')}</strong> {t('enrolled')}
              </p>
              {categoryData.length > 0 && (
                <p>
                  {t('Across')} <strong>{categoryData.length} {t('categories')}</strong>
                </p>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default DashboardHero