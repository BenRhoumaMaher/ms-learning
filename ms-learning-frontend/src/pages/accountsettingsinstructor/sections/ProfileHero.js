import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import profilePic from '../../../assets/logo.png'
import { getUserInfos, deleteAccount } from '../../../helpers/api'

const ProfileHero = () => {
  const navigate = useNavigate()
  const isAuthenticated =
    localStorage.getItem('token') || sessionStorage.getItem('token')
  const user = isAuthenticated
    ? JSON.parse(atob(isAuthenticated.split('.')[1]))
    : null
  const userId = user?.user_id || null
  const [username, setUsername] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    if (userId) {
      getUserInfos()
        .then(data => {
          setUsername(data.username || 'Guest')
        })
        .catch(error => {
          console.error('Error fetching user info:', error)
        })
    }
  }, [userId])

  const handleDeleteAccount = async () => {
    try {
      setError(null)
      await deleteAccount(userId)

      // Clear storage and redirect
      localStorage.removeItem('token')
      sessionStorage.removeItem('token')
      setSuccess('Account deleted successfully. Redirecting...')

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/')
      }, 2000)
    } catch (error) {
      console.error('Delete account error:', error)
      setError(
        error.response?.data?.error ||
          'Failed to delete account. Please try again.'
      )
    }
  }

  const redirectToCreateCourse = () => {
    navigate('/create-course')
  }

  return (
    <div className='profile-hero-container mb-5'>
      {/* Left Side: Text */}
      <div className='profile-text'>
        <h1 className='text-info mb-4'>Welcome,</h1>
        <h3 className='text-danger mb-4'>{username}</h3>
        <h4 className='text-light'>Our Great Instructor</h4>

        {success && <div className='alert alert-success mt-3'>{success}</div>}
        {error && <div className='alert alert-danger mt-3'>{error}</div>}

        <div className='buttons mt-4 mb-4'>
          <button
            className='btn btn-danger me-3'
            data-bs-toggle='modal'
            data-bs-target='#deleteAccountModal'
          >
            Delete Account
          </button>

          <button className='btn btn-primary' onClick={redirectToCreateCourse}>
            Create Course
          </button>
        </div>
      </div>

      <div className='ins-profile-image'>
        <img
          src={profilePic}
          className='rounded-circle img-fluid'
          alt='Profile'
        />
      </div>

      <div
        className='modal fade'
        id='deleteAccountModal'
        tabIndex='-1'
        aria-labelledby='deleteAccountModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' id='deleteAccountModalLabel'>
                Confirm Account Deletion
              </h5>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
              ></button>
            </div>
            <div className='modal-body'>
              <p>
                Are you sure you want to delete your account? This action cannot
                be undone.
              </p>
              {error && <div className='alert alert-danger mt-2'>{error}</div>}
            </div>
            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-secondary'
                data-bs-dismiss='modal'
              >
                Close
              </button>
              <button
                type='button'
                className='btn btn-danger'
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileHero
