import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { resetPassword } from '../../../helpers/api'
import ResetPasswordForm from '../../../pages/auth/ResetPasswordForm'

export default function ResetPasswordContainer () {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()
  const formMethods = useForm()

  const onSubmit = async data => {
    try {
      await resetPassword(token, data.password)
      navigate('/login')
    } catch (error) {
      console.error('Error resetting password:', error)
    }
  }

  return (
    <ResetPasswordForm
      formMethods={formMethods}
      onSubmit={onSubmit}
      navigate={navigate}
    />
  )
}
