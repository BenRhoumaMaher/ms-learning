import React from 'react'

const PasswordForm = ({ passwordData, errors, onChange, onUpdate }) => {
  return (
    <div>
      <h5 className='text-light'>Change Password</h5>
      <div className='row gy-3'>
        {[
          {
            name: 'newPassword',
            label: 'New Password',
            type: 'password'
          },
          {
            name: 'confirmPassword',
            label: 'Confirm New Password',
            type: 'password'
          }
        ].map(field => (
          <div key={field.name} className='col-md-12'>
            <label className='form-label'>{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              className={`form-control ${
                errors?.[field.name] ? 'is-invalid' : ''
              }`}
              value={passwordData[field.name] || ''}
              onChange={onChange}
            />
            {errors?.[field.name] && (
              <div className='invalid-feedback'>{errors[field.name]}</div>
            )}
          </div>
        ))}
      </div>

      <div className='mt-4 text-center'>
        <button
          className='btn btn-info btn-lg w-25'
          onClick={onUpdate}
          disabled={!passwordData.newPassword || !passwordData.confirmPassword}
        >
          Update Password
        </button>
      </div>
    </div>
  )
}

export default PasswordForm
