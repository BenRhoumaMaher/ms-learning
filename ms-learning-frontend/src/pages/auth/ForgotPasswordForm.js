import React from 'react'
import { FormProvider } from 'react-hook-form'

const logo = require('../../assets/logo.png')
const backgroundImage = require('../../assets/back.jpg')

export default function ForgotPasswordForm ({
  formMethods,
  message,
  error,
  onSubmit,
  navigate
}) {
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
            <h4 className='text-uppercase text-danger fw-bold'>
              Forgot Password
            </h4>
          </div>

          <div className='mt-4'>
            {message && <p className='text-success'>{message}</p>}
            {error && <p className='text-danger'>{error}</p>}
            <form onSubmit={formMethods.handleSubmit(onSubmit)}>
              <div className='mb-3'>
                <label className='form-label fw-semibold'>
                  Enter your Email
                </label>
                <input
                  className='form-control'
                  type='email'
                  {...formMethods.register('email', {
                    required: 'Email is required'
                  })}
                  placeholder='Your email'
                />
                {formMethods.formState.errors.email && (
                  <p className='text-danger'>
                    {formMethods.formState.errors.email.message}
                  </p>
                )}
              </div>

              <button
                className='btn btn-primary w-100 m-auto fw-bold'
                type='submit'
              >
                Send Reset Link
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
