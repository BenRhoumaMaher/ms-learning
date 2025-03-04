import React from 'react'
import {
  renderWithRouter,
  mockNavigate,
  fillFormFields
} from '../utils/testUtils'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import LoginForm from '../../pages/auth/LoginForm'
import { login } from '../../helpers/api'

jest.mock('../../helpers/api', () => ({
  login: jest.fn(),
  googleLogin: jest.fn()
}))

describe('LoginForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders LoginForm with necessary fields', () => {
    renderWithRouter(<LoginForm />)

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByText('LOGIN')).toBeInTheDocument()
  })

  test('submits the form successfully', async () => {
    login.mockResolvedValue({ username: 'Maher Ben Rhouma' })

    renderWithRouter(<LoginForm />)

    fillFormFields(screen, {
      email: 'maherbenrhouma@gmail.com',
      password: 'Strong@1230000'
    })

    fireEvent.click(screen.getByText('LOGIN'))

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'))
  })

  test('displays error when credentials are incorrect', async () => {
    login.mockRejectedValue({
      response: { data: { error: 'Invalid credentials' } }
    })

    renderWithRouter(<LoginForm />)

    fillFormFields(screen, {
      email: 'wrongemail@gmail.com',
      password: 'wrongpassword'
    })

    fireEvent.click(screen.getByText('LOGIN'))

    expect(await screen.findByText(/Invalid credentials/i)).toBeInTheDocument()
  })

})
