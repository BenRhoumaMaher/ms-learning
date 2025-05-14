import React, { useState, useEffect } from 'react'
import { updateUserPassword } from '../../../helpers/api'

const PasswordSecurity = () => {
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false
  })
  const [userId, setUserId] = useState(null)
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token')
    const user = JSON.parse(atob(token.split('.')[1]))
    setUserId(user?.user_id)
  }, [])

  const togglePassword = field => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handleChange = (field, value) => {
    setPasswords(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const { newPassword, confirmPassword } = passwords

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!')
      return
    }

    try {
      setLoading(true)
      await updateUserPassword(userId, {
        newPassword,
        confirmPassword
      })
      alert('Password updated successfully!')
      setPasswords({ newPassword: '', confirmPassword: '' })
    } catch (err) {
      alert('Failed to update password. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className='container text-center my-5 text-center'>
      <h2 className='fw-bold'>Password & Security</h2>
      <p className='text-danger fw-semibold'>
        Keep your account safe and secure with a strong password
      </p>

      <form
        onSubmit={handleSubmit}
        className='stac-password-section mx-auto p-4'
      >
        <div className='mb-3 text-start'>
          <label className='stac-password-label'>New Password</label>
          <div className='stac-password-input-group'>
            <i className='bi bi-lock stac-password-icon'></i>
            <input
              type={showPassword.new ? 'text' : 'password'}
              className='form-control stac-password-input'
              placeholder='Enter new password'
              value={passwords.newPassword}
              onChange={e => handleChange('newPassword', e.target.value)}
              required
            />
            <i
              className={`bi ${
                showPassword.new ? 'bi-eye-slash' : 'bi-eye'
              } stac-password-eye`}
              onClick={() => togglePassword('new')}
            ></i>
          </div>
        </div>

        <div className='mb-4 text-start'>
          <label className='stac-password-label'>Confirm New Password</label>
          <div className='stac-password-input-group'>
            <i className='bi bi-lock stac-password-icon'></i>
            <input
              type={showPassword.confirm ? 'text' : 'password'}
              className='form-control stac-password-input'
              placeholder='Confirm new password'
              value={passwords.confirmPassword}
              onChange={e => handleChange('confirmPassword', e.target.value)}
              required
            />
            <i
              className={`bi ${
                showPassword.confirm ? 'bi-eye-slash' : 'bi-eye'
              } stac-password-eye`}
              onClick={() => togglePassword('confirm')}
            ></i>
          </div>
        </div>

        <button className='btn stac-password-btn' type='submit' disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </section>
  )
}

export default PasswordSecurity
