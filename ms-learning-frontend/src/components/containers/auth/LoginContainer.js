import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { login, googleLogin } from '../../../helpers/api'
import { useNavigate } from 'react-router-dom'
import LoginForm from '../../../pages/auth/LoginForm'

export default function LoginContainer () {
  const [remember, setRemember] = useState(false)
  const [globalError, setGlobalError] = useState(null)
  const formMethods = useForm()
  const navigate = useNavigate()

  const onSubmit = async data => {
    try {
      const response = await login(
        {
          email: data.email,
          password: data.password,
          username: data.username
        },
        remember
      )
      localStorage.setItem('username', response.username)
      formMethods.reset()
      navigate('/')
    } catch (err) {
      if (err.response && err.response.data.error) {
        setGlobalError(err.response.data.error)
      } else {
        setGlobalError(
          'An unexpected error occurred. Please check your credentials.'
        )
      }
    }
  }

  const handleGoogleLogin = async response => {
    try {
      await googleLogin(response.credential, remember)
      navigate('/')
    } catch (err) {
      setGlobalError('Google login failed')
    }
  }

  return (
    <LoginForm
      formMethods={formMethods}
      globalError={globalError}
      setGlobalError={setGlobalError}
      onSubmit={onSubmit}
      remember={remember}
      setRemember={setRemember}
      handleGoogleLogin={handleGoogleLogin}
      navigate={navigate}
    />
  )
}
