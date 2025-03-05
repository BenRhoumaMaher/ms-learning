import React, { useState } from 'react'
import { forgotPassword } from '../../../helpers/api'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import ForgotPasswordForm from '../../../pages/auth/ForgotPasswordForm'

export default function ForgotPasswordContainer () {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const formMethods = useForm()
  const navigate = useNavigate()

  const onSubmit = async data => {
    try {
      const response = await forgotPassword(data.email)
      setMessage(response.message)
      setError('')
      formMethods.reset()
    } catch (err) {
      setMessage('')
      setError('Failed to send reset email. Please try again.')
    }
  }

  return (
    <ForgotPasswordForm
      formMethods={formMethods}
      message={message}
      error={error}
      onSubmit={onSubmit}
      navigate={navigate}
    />
  )
}
