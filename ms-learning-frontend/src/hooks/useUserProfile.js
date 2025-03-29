import { useState, useEffect } from 'react'
import {
  getUserInfos,
  updateUserInfos,
  updateUserPassword
} from '../helpers/api'

export const useUserProfile = () => {
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
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [passwordErrors, setPasswordErrors] = useState(null)

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
        .catch(console.error)
    }
  }, [userId])

  const handleImageChange = file => {
    if (file) setProfileImage(file)
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setUserInfo(prev => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = e => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveChanges = async () => {
    try {
      const formData = new FormData()
      Object.entries(userInfo).forEach(([key, value]) => {
        formData.append(key, value)
      })
      if (profileImage) formData.append('profileImage', profileImage)

      const response = await updateUserInfos(userId, formData)
      setSuccessMessage('Profile updated successfully!')
      return response
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'Failed to update profile'
      )
      throw error
    }
  }

  const handlePasswordUpdate = async () => {
    try {
      const response = await updateUserPassword(userId, passwordData)
      setSuccessMessage('Password updated successfully!')
      setPasswordData({ newPassword: '', confirmPassword: '' })
      return response
    } catch (error) {
      if (error.response?.data?.errors) {
        setPasswordErrors(error.response.data.errors)
      } else {
        setErrorMessage(
          error.response?.data?.message || 'Password update failed'
        )
      }
      throw error
    }
  }

  return {
    userId,
    userInfo,
    profileImage,
    passwordData,
    successMessage,
    errorMessage,
    passwordErrors,
    setErrorMessage,
    setSuccessMessage,
    handleImageChange,
    handleInputChange,
    handlePasswordChange,
    handleSaveChanges,
    handlePasswordUpdate
  }
}
