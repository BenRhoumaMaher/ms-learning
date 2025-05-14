import React, { useState } from 'react'
import { useUserAuth } from '../../../hooks/useUserAuth'

const AccountSettingsHero = ({ onEditProfileClick, onChangePasswordClick }) => {
  const { userId, username, error, success, handleDeleteAccount } = useUserAuth()
  const [showDeleteForm, setShowDeleteForm] = useState(false)

  const handleConfirmDelete = async (e) => {
    e.preventDefault()
    const confirmed = await handleDeleteAccount()
    if (confirmed) {
      setShowDeleteForm(false)
    }
  }

  return (
    <section className='accset-hero'>
      <div className='container-fluid'>
        <div className='row justify-content-between'>
          <div className='col-md-6 accset-left'>
            <h2 className='accset-title'>Your Account, Your Way</h2>
            <p className='accset-subtitle'>
              <span className='accset-highlight'>Take Control</span>, {username} — Customize Your Learning Experience.
            </p>
            {error && <div className='alert alert-danger mt-3'>{error}</div>}
            {success && <div className='alert alert-success mt-3'>{success}</div>}
            <div className='accset-buttons'>
              <button
                className='accset-btn accset-edit-btn'
                onClick={onEditProfileClick}
              >
                Edit Profile
              </button>
              <button
                className='accset-btn accset-password-btn'
                onClick={onChangePasswordClick}
              >
                Change Password
              </button>
            </div>
          </div>

          <div className='col-md-6 accset-right'>
            <div className='accset-profile d-flex align-items-center justify-content-end'>
              <div className='accset-info text-center'>
                <h4 className='accset-name'>{username}</h4>

                {/* Toggle Delete Form */}
                <button
                  className='accset-btn accset-delete-btn'
                  onClick={() => setShowDeleteForm(!showDeleteForm)}
                >
                  Delete account?
                </button>

                {/* Delete Confirmation Form */}
                {showDeleteForm && (
                  <form onSubmit={handleConfirmDelete} className='mt-3'>
                    <p>Are you sure you want to delete your account?</p>
                    <button type='submit' className='btn btn-danger btn-sm'>
                      Yes, delete
                    </button>{' '}
                    <button
                      type='button'
                      className='btn btn-secondary btn-sm'
                      onClick={() => setShowDeleteForm(false)}
                    >
                      Cancel
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AccountSettingsHero
