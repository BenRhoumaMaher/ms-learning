import React, { useState } from 'react'
import { useForm, FormProvider, Controller } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { signup } from '../../helpers/api'
import Credentials from '../../components/Credentials'

const logo = require('../../assets/logo.png')
const backgroundImage = require('../../assets/back.jpg')

/**
 * @author Maher Ben Rhouma
 * 
 * SignupForm Component
 * 
 * This component provides a user registration form using **React Hook Form** for form handling 
 * and validation. It integrates API calls for user registration and navigates the user upon success.
 * 
 * @component
 * @returns {JSX.Element} The signup form UI.
 */
export default function SignupForm () {

  /**
   * React Hook Form instance to manage form state and validation.
   * 
   * @constant
   * @type {import('react-hook-form').UseFormReturn}
   */
  const formMethods = useForm({
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  /** 
   * React Router hook for navigation.
   * 
   * @constant
   * @type {Function}
   */
  const navigate = useNavigate()

  /**
   * Global error message for API validation errors.
   * 
   * @state
   * @type {string | null}
   */
  const [globalError, setGlobalError] = useState(null)
  
  /**
   * Handles form submission.
   * 
   * Sends user data to the `signup` API. If successful, the user is redirected to the login page.
   * Otherwise, backend validation errors are displayed.
   * 
   * @async
   * @function
   * @param {Object} data - The submitted form data.
   * @param {string} data.firstname - User's first name.
   * @param {string} data.lastname - User's last name.
   * @param {string} data.email - User's email.
   * @param {string} data.password - User's password.
   * @param {string} data.confirmPassword - User's password confirmation.
   * @returns {Promise<void>}
   */
  const onSubmit = async data => {
    try {
      const response = await signup(data)
      navigate('/login')
    } catch (error) {
      if (error.response && error.response.data.errors) {
        const backendErrors = error.response.data.errors
        if (backendErrors.email === 'User already exists') {
          setGlobalError('Please log in or use another email.')
        } else {
          Object.keys(backendErrors).forEach(field => {
            formMethods.setError(field, {
              type: 'server',
              message: backendErrors[field]
            })
          })
        }
      }
    }
  }
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
