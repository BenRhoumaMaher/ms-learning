import { useEffect, useState } from 'react'
import { getUserInfos, deleteAccount } from '../helpers/api'

export const useUserAuth = () => {
  const [username, setUsername] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

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

      localStorage.removeItem('token')
      sessionStorage.removeItem('token')
      setSuccess('Account deleted successfully. Redirecting...')

      return true
    } catch (error) {
      console.error('Delete account error:', error)
      setError(
        error.response?.data?.error ||
          'Failed to delete account. Please try again.'
      )
      return false
    }
  }

  return {
    userId,
    username,
    error,
    success,
    setError,
    setSuccess,
    handleDeleteAccount
  }
}
