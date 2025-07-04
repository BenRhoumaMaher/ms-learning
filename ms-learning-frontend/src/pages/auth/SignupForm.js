import React from 'react'
import { FormProvider, Controller } from 'react-hook-form'
import Credentials from '../../components/reusablecomponents/Credentials'

const logo = require('../../assets/logo.png')
const backgroundImage = require('../../assets/back.jpg')

export default function SignupForm ({
  formMethods,
  globalError,
  onSubmit,
  navigate
}) {
  return (
    <FormProvider {...formMethods}>
      <div
        className='d-flex min-vh-100 align-items-center justify-content-center py-5'
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
            <h2 className='text-uppercase text-danger fw-bold'>Sign Up</h2>
          </div>

          {globalError && (
            <div className='alert alert-danger text-center' role='alert'>
              {globalError}
            </div>
          )}

          <form onSubmit={formMethods.handleSubmit(onSubmit)}>
            <div className='mt-4'>
              <div className='mb-3'>
                <Controller
                  control={formMethods.control}
                  name='firstname'
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <input
                        {...field}
                        className={`form-control ${error ? 'is-invalid' : ''}`}
                        placeholder='First Name'
                      />
                      {error && (
                        <div className='invalid-feedback'>{error.message}</div>
                      )}
                    </>
                  )}
                />
              </div>

              <div className='mb-3'>
                <Controller
                  control={formMethods.control}
                  name='lastname'
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <input
                        {...field}
                        className={`form-control ${error ? 'is-invalid' : ''}`}
                        placeholder='Last Name'
                      />
                      {error && (
                        <div className='invalid-feedback'>{error.message}</div>
                      )}
                    </>
                  )}
                />
              </div>

              <Credentials />

              <div className='mb-3'>
                <Controller
                  control={formMethods.control}
                  name='confirmPassword'
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <input
                        {...field}
                        type='password'
                        className={`form-control ${error ? 'is-invalid' : ''}`}
                        placeholder='Confirm Password'
                      />
                      {error && (
                        <div className='invalid-feedback'>{error.message}</div>
                      )}
                    </>
                  )}
                />
              </div>
            </div>
            <button
              className='btn btn-danger w-100 m-auto mt-3 fw-bold'
              type='submit'
            >
              SIGN UP
            </button>
          </form>

          <p className='text-muted mt-3 text-center'>
            Already have an account?{' '}
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
