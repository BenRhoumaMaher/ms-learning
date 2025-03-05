import React from 'react'
import { FormProvider } from 'react-hook-form'
import Credentials from '../../components/reusablecomponents/Credentials'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'

const logo = require('../../assets/logo.png')
const backgroundImage = require('../../assets/back.jpg')

export default function LoginForm ({
  formMethods,
  globalError,
  setGlobalError,
  onSubmit,
  remember,
  setRemember,
  handleGoogleLogin,
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
            <h2 className='text-uppercase text-danger fw-bold'>Login</h2>
          </div>

          {globalError && (
            <div className='alert alert-danger text-center' role='alert'>
              {globalError}
            </div>
          )}

          <div className='mt-4'>
            <Credentials />
          </div>

          <div className='d-flex justify-content-between align-items-center mt-2'>
            <div className='form-check'>
              <input
                className='form-check-input'
                type='checkbox'
                checked={remember}
                onChange={() => setRemember(!remember)}
              />
              <label className='form-check-label ms-2'>Remember Me</label>
            </div>
            <span
              className='text-danger fw-semibold'
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/forgot-password')}
            >
              Forgot Password?
            </span>
          </div>

          <button
            className='btn btn-danger w-50 m-auto mt-3 fw-bold'
            onClick={formMethods.handleSubmit(onSubmit)}
          >
            LOGIN
          </button>

          <span className='m-auto'>OR</span>

          <div className='w-50 m-auto'>
            <GoogleOAuthProvider clientId='170311905094-lm7ardcmeeesll1sngcv4iqb6t5btmot.apps.googleusercontent.com'>
              <GoogleLogin
                useOneTap
                ux_mode='popup'
                onSuccess={handleGoogleLogin}
                onError={() => setGlobalError('Google login failed')}
              />
            </GoogleOAuthProvider>
          </div>

          <p className='text-muted mt-3 text-center'>
            Don't Have an Account?{' '}
            <span
              className='text-danger fw-semibold'
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </FormProvider>
  )
}
