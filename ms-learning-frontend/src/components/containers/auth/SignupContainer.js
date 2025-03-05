import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { signup } from '../../../helpers/api'
import SignupForm from '../../../pages/auth/SignupForm'

export default function SignupContainer () {
  const formMethods = useForm({
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  const navigate = useNavigate()
  const [globalError, setGlobalError] = useState(null)

  const onSubmit = async data => {
    try {
      await signup(data)
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
    <SignupForm
      formMethods={formMethods}
      globalError={globalError}
      onSubmit={onSubmit}
      navigate={navigate}
    />
  )
}
