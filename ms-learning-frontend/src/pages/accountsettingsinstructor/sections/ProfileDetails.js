import React, { useState, useEffect } from 'react'
import { getUserInfos, updateUserInfos } from '../../../helpers/api'
import { updateUserPassword } from '../../../helpers/api'

const ProfileDetails = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [profileImage, setProfileImage] = useState(null)
  const [userInfo, setUserInfo] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    expertise: '',
    x: '',
    linkedin: '',
    facebook: '',
    instagram: ''
  })
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const isAuthenticated =
    localStorage.getItem('token') || sessionStorage.getItem('token')
  const user = isAuthenticated
    ? JSON.parse(atob(isAuthenticated.split('.')[1]))
    : null
  const userId = user?.user_id || null

  useEffect(() => {
    if (userId) {
      getUserInfos()
        .then(data => {
          setUserInfo({
            username: data.username || 'Guest',
            firstName: data.firstname || '',
            lastName: data.lastname || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            expertise: data.expertise || '',
            x: data.x || '',
            linkedin: data.linkedin || '',
            facebook: data.facebook || '',
            instagram: data.instagram || ''
          })
        })
        .catch(error => {
          console.error('Error fetching user info:', error)
        })
    }
  }, [userId])

  const handleImageChange = event => {
    const file = event.target.files[0]
    if (file) {
      setProfileImage(file)
    }
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setUserInfo(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSaveChanges = async () => {
    const formData = new FormData()

    formData.append('firstName', userInfo.firstName)
    formData.append('lastName', userInfo.lastName)
    formData.append('username', userInfo.username)
    formData.append('email', userInfo.email)
    formData.append('phone', userInfo.phone)
    formData.append('address', userInfo.address)
    formData.append('expertise', userInfo.expertise)
    formData.append('x', userInfo.x)
    formData.append('facebook', userInfo.facebook)
    formData.append('linkedin', userInfo.linkedin)
    formData.append('instagram', userInfo.instagram)

    if (profileImage) {
      formData.append('profileImage', profileImage)
    }

    try {
      const response = await updateUserInfos(userId, formData)

      if (response.user?.picture) {
        setProfileImage(response.user.picture)
      } else if (response.picture) {
        setProfileImage(response.picture)
      }
      setSuccessMessage('Profile updated successfully!')
    } catch (error) {
      const backendError =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message

      console.error('Full error details:', {
        error: error,
        response: error.response,
        config: error.config
      })
      setErrorMessage(
        backendError || 'Failed to update profile. Please try again.'
      )
    }
  }

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordErrors, setPasswordErrors] = useState(null)

  const handlePasswordChange = e => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordUpdate = async () => {
    try {
      setSuccessMessage('')
      setErrorMessage('')
      setPasswordErrors(null)

      const response = await updateUserPassword(userId, passwordData)

      setSuccessMessage('Password updated successfully!')
      setPasswordData({
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      if (error.response?.data?.errors) {
        setPasswordErrors(error.response.data.errors)
      } else {
        setErrorMessage(
          error.response?.data?.message ||
            'Failed to update password. Please try again.'
        )
      }
    }
  }

  return (
    <div className='text-white p-5 rounded-3 shadow-lg'>
      <ul className='nav nav-pills'>
        <li className='nav-item'>
          <button
            className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
        </li>
        <li className='nav-item'>
          <button
            className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
        </li>
        <li className='nav-item'>
          <button
            className={`nav-link ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            Password
          </button>
        </li>
      </ul>

      <div className='mt-4'>
        {activeTab === 'overview' && (
          <div>
            <h5 className='text-light'>Profile Overview</h5>
            <table className='table table-info table-bordered table-hover'>
              <tbody>
                <tr>
                  <td>First Name</td>
                  <td className='text-warning'>{userInfo.firstName}</td>
                </tr>
                <tr>
                  <td>Last Name</td>
                  <td className='text-warning'>{userInfo.lastName}</td>
                </tr>
                <tr>
                  <td>Username</td>
                  <td className='text-warning'>{userInfo.username}</td>
                </tr>
                <tr>
                  <td>Phone</td>
                  <td className='text-warning'>{userInfo.phone}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td className='text-warning'>{userInfo.email}</td>
                </tr>
                <tr>
                  <td>Address</td>
                  <td className='text-warning'>{userInfo.address}</td>
                </tr>
              </tbody>
            </table>
            <h5 className='text-light'>Expertise</h5>
            <p className='lead text-muted'>{userInfo.expertise}</p>
          </div>
        )}

        {activeTab === 'profile' && (
          <div>
            <h5 className='text-light'>Profile Settings</h5>
            {successMessage && (
              <div className='alert alert-success mt-4' role='alert'>
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className='alert alert-danger mt-4' role='alert'>
                {errorMessage}
              </div>
            )}
            <div className='d-flex align-items-center mb-4'>
              <img
                src={`http://localhost:8080/images/profiles/${profileImage}`}
                alt='Profile'
                className='rounded-circle me-3 shadow-lg'
                width='120'
                height='120'
              />
              <div>
                <input
                  type='file'
                  className='form-control form-control-sm'
                  accept='image/*'
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div className='row gy-3'>
              <div className='col-md-6'>
                <label className='form-label'>First Name</label>
                <input
                  type='text'
                  name='firstName'
                  className='form-control'
                  value={userInfo.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div className='col-md-6'>
                <label className='form-label'>Last Name</label>
                <input
                  type='text'
                  name='lastName'
                  className='form-control'
                  value={userInfo.lastName}
                  onChange={handleInputChange}
                />
              </div>
              <div className='col-md-6'>
                <label className='form-label'>Username</label>
                <input
                  type='text'
                  name='username'
                  className='form-control'
                  value={userInfo.username}
                  onChange={handleInputChange}
                />
              </div>
              <div className='col-md-6'>
                <label className='form-label'>Phone</label>
                <input
                  type='text'
                  name='phone'
                  className='form-control'
                  value={userInfo.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className='col-md-6'>
                <label className='form-label'>Address</label>
                <input
                  type='text'
                  name='address'
                  className='form-control'
                  value={userInfo.address}
                  onChange={handleInputChange}
                />
              </div>
              <div className='col-md-6'>
                <label className='form-label'>Expertise</label>
                <input
                  type='text'
                  name='expertise'
                  className='form-control'
                  value={userInfo.expertise}
                  onChange={handleInputChange}
                />
              </div>
              <div className='col-md-6'>
                <label className='form-label'>Linkedin</label>
                <input
                  type='text'
                  name='linkedin'
                  className='form-control'
                  value={userInfo.linkedin}
                  onChange={handleInputChange}
                />
              </div>
              <div className='col-md-6'>
                <label className='form-label'>X</label>
                <input
                  type='text'
                  name='x'
                  className='form-control'
                  value={userInfo.x}
                  onChange={handleInputChange}
                />
              </div>
              <div className='col-md-6'>
                <label className='form-label'>Instagram</label>
                <input
                  type='text'
                  name='instagram'
                  className='form-control'
                  value={userInfo.instagram}
                  onChange={handleInputChange}
                />
              </div>
              <div className='col-md-6'>
                <label className='form-label'>Facebook</label>
                <input
                  type='text'
                  name='facebook'
                  className='form-control'
                  value={userInfo.facebook}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className='mt-4 text-center'>
              <button
                className='btn btn-info btn-lg w-25'
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
        {activeTab === 'password' && (
          <div>
            <h5 className='text-light'>Change Password</h5>
            {successMessage && (
              <div className='alert alert-success mt-4' role='alert'>
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className='alert alert-danger mt-4' role='alert'>
                {errorMessage}
              </div>
            )}

            <div className='row gy-3'>
              <div className='col-md-12'>
                <label className='form-label'>New Password</label>
                <input
                  type='password'
                  name='newPassword'
                  className={`form-control ${
                    passwordErrors?.password ? 'is-invalid' : ''
                  }`}
                  value={passwordData.newPassword || ''}
                  onChange={handlePasswordChange}
                />
                {passwordErrors?.password && (
                  <div className='invalid-feedback'>
                    {passwordErrors.password}
                  </div>
                )}
              </div>

              <div className='col-md-12'>
                <label className='form-label'>Confirm New Password</label>
                <input
                  type='password'
                  name='confirmPassword'
                  className={`form-control ${
                    passwordErrors?.confirmPassword ? 'is-invalid' : ''
                  }`}
                  value={passwordData.confirmPassword || ''}
                  onChange={handlePasswordChange}
                />
                {passwordErrors?.confirmPassword && (
                  <div className='invalid-feedback'>
                    {passwordErrors.confirmPassword}
                  </div>
                )}
              </div>
            </div>

            <div className='mt-4 text-center'>
              <button
                className='btn btn-info btn-lg w-25'
                onClick={handlePasswordUpdate}
                disabled={
                  !passwordData.newPassword || !passwordData.confirmPassword
                }
              >
                Update Password
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfileDetails
