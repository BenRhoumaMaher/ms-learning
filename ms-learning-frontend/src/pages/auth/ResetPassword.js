import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm, Controller, FormProvider } from 'react-hook-form'
import { resetPassword } from '../../helpers/api'

const logo = require('../../assets/logo.png')
const backgroundImage = require('../../assets/back.jpg')

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()
  const formMethods = useForm()

  const onSubmit = async (data) => {
    try {
      await resetPassword(token, data.password)
      navigate('/login')
    } catch (error) {
      console.error('Error resetting password:', error)
    }
  }

  return (
    <FormProvider {...formMethods}>
      <div
        className='d-flex vh-100 align-items-center justify-content-center'
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          width: '100%',
          height: '100vh'
        }}
      >
        <div
          className='card shadow p-4 rounded'
          style={{
            width: '100%',
            maxWidth: '600px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)'
          }}
        >
          <div className='text-center'>
            <img
              src={logo}
              className='img-fluid mb-3'
              alt='Logo'
              style={{ height: '120px' }}
            />
            <h4 className='text-uppercase text-danger fw-bold'>Reset Password</h4>
          </div>

          <div className='mt-4'>
            <form onSubmit={formMethods.handleSubmit(onSubmit)}>
              <div className='mb-3'>
                <label className='form-label fw-semibold'>Enter New Password</label>
                <Controller
                  control={formMethods.control}
                  name='password'
                  rules={{
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters long'
                    },
                    pattern: {
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                      message:
                        'Password must contain at least one uppercase, one lowercase, one number, and one special character'
                    }
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <input
                        type='password'
                        className={`form-control ${error ? 'is-invalid' : ''}`}
                        placeholder='New Password'
                        {...field}
                      />
                      {error && <div className='text-danger'>{error.message}</div>}
                    </>
                  )}
                />
              </div>

              <button className='btn btn-primary w-100 fw-bold' type='submit'>
                Reset Password
              </button>
            </form>
          </div>

          <p className='text-muted mt-3 text-center'>
            Remembered your password?{' '}
            <span
              className='text-danger fw-semibold'
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/login')}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </FormProvider>
  )
}