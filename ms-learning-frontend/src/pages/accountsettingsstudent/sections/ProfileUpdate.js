import React, { useEffect, useState } from 'react'
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  InputGroup,
  Spinner
} from 'react-bootstrap'
import { getUserInfos, updateUserInfos } from '../../../helpers/api'

const ProfileUpdate = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    address: '',
    x: '',
    facebook: '',
    instagram: '',
    linkedin: ''
  })

  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token =
          localStorage.getItem('token') || sessionStorage.getItem('token')
        const user = JSON.parse(atob(token.split('.')[1]))
        setUserId(user?.user_id)

        const userInfo = await getUserInfos()
        setFormData({
          firstname: userInfo.firstname || '',
          lastname: userInfo.lastname || '',
          phone: userInfo.phone || '',
          address: userInfo.address || '',
          x: userInfo.x || '',
          facebook: userInfo.facebook || '',
          instagram: userInfo.instagram || '',
          linkedin: userInfo.linkedin || ''
        })
      } catch (err) {
        console.error('Failed to load user info', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserInfo()
  }, [])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await updateUserInfos(userId, formData)
      alert('Profile updated successfully!')
    } catch (err) {
      alert('Update failed. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className='text-center my-5'>
        <Spinner animation='border' />
      </div>
    )
  }

  return (
    <section className='profile-update mt-5'>
      <Container>
        <Row className='justify-content-center'>
          <Col md={8}>
            <div className='text-center'>
              <h2 className='profile-title'>Your Profile</h2>
              <p className='profile-subtitle'>
                Keep your information up to date, it’s how we personalize your
                experience
              </p>
            </div>

            <div className='profile-box'>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className='mb-3'>
                      <Form.Label>First Name</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className='fas fa-user'></i>
                        </InputGroup.Text>
                        <Form.Control
                          type='text'
                          value={formData.firstname}
                          onChange={e =>
                            handleChange('firstname', e.target.value)
                          }
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Last Name</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className='fas fa-user'></i>
                        </InputGroup.Text>
                        <Form.Control
                          type='text'
                          value={formData.lastname}
                          onChange={e =>
                            handleChange('lastname', e.target.value)
                          }
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Phone</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className='fas fa-phone'></i>
                        </InputGroup.Text>
                        <Form.Control
                          type='text'
                          value={formData.phone}
                          onChange={e => handleChange('phone', e.target.value)}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Address</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className='fas fa-home'></i>
                        </InputGroup.Text>
                        <Form.Control
                          type='text'
                          value={formData.address}
                          onChange={e =>
                            handleChange('address', e.target.value)
                          }
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className='mb-3'>
                      <Form.Label>X</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className='fab fa-twitter'></i>
                        </InputGroup.Text>
                        <Form.Control
                          type='text'
                          value={formData.x}
                          onChange={e => handleChange('x', e.target.value)}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Facebook</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className='fab fa-facebook'></i>
                        </InputGroup.Text>
                        <Form.Control
                          type='text'
                          value={formData.facebook}
                          onChange={e =>
                            handleChange('facebook', e.target.value)
                          }
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Instagram</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className='fab fa-instagram'></i>
                        </InputGroup.Text>
                        <Form.Control
                          type='text'
                          value={formData.instagram}
                          onChange={e =>
                            handleChange('instagram', e.target.value)
                          }
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className='mb-3'>
                      <Form.Label>LinkedIn</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className='fab fa-linkedin'></i>
                        </InputGroup.Text>
                        <Form.Control
                          type='text'
                          value={formData.linkedin}
                          onChange={e =>
                            handleChange('linkedin', e.target.value)
                          }
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>

                <div className='text-center'>
                  <Button type='submit' className='save-btn mt-2'>
                    Save Changes
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default ProfileUpdate
