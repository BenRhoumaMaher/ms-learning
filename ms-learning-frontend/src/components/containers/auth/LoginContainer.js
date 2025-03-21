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
          username: data.username,
          role: data.role
        },
        remember
      )

      localStorage.setItem('username', response.username)
      localStorage.setItem('token', response.token)

      const decodedToken = JSON.parse(atob(response.token.split('.')[1]))
      const userRoles = decodedToken.roles || []

      formMethods.reset()

      if (userRoles.includes('ROLE_INSTRUCTOR')) {
        navigate('/instructor-dashboard')
      } else {
        navigate('/')
      }
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
      const res = await googleLogin(response.credential, remember)
      localStorage.setItem('token', res.token)

      const decodedToken = JSON.parse(atob(res.token.split('.')[1]))
      const userRoles = decodedToken.roles || []

      if (userRoles.includes('ROLE_INSTRUCTOR')) {
        navigate('/instructor-dashboard')
      } else {
        navigate('/')
      }
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
