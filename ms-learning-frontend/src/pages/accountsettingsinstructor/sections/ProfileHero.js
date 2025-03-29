import React from 'react'
import { useNavigate } from 'react-router-dom'
import profilePic from '../../../assets/logo.png'
import DeleteAccountModal from '../../../components/accountsettingsinstructor/DeleteAccountModal'
import { useUserAuth } from '../../../hooks/useUserAuth'

const ProfileHero = () => {
  const navigate = useNavigate()
  const {
    userId,
    username,
    error,
    success,
    setError,
    setSuccess,
    handleDeleteAccount
  } = useUserAuth()

  const redirectToCreateCourse = () => {
    navigate('/create-course')
  }

  return (
    <div className='profile-hero-container mb-5'>
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

      <DeleteAccountModal
        error={error}
        handleDeleteAccount={handleDeleteAccount}
      />
    </div>
  )
}

export default ProfileHero
