import React from 'react'
import {
  renderWithRouter,
  mockNavigate,
  fillFormFields
} from '../utils/testUtils'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import SignupForm from '../../pages/auth/SignupForm'
import { signup } from '../../helpers/api'

jest.mock('../../helpers/api', () => ({
  signup: jest.fn()
}))

describe('SignupForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders SignupForm with necessary fields', () => {
    renderWithRouter(<SignupForm />)

    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument()
    expect(screen.getByText('SIGN UP')).toBeInTheDocument()
  })

  test('submits the form successfully', async () => {
    signup.mockResolvedValue({ message: 'User registered successfully' })

    renderWithRouter(<SignupForm />)

    fillFormFields(screen, {
      email: 'maherbenrhouma@example.com',
      password: 'Strong@1230000'
    })
    fireEvent.change(screen.getByPlaceholderText(/First Name/i), {
      target: { value: 'Maher' }
    })

    fireEvent.click(screen.getByText('SIGN UP'))

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/login'))
  })

  test('displays error when user already exists', async () => {
    signup.mockRejectedValue({
      response: {
        data: { errors: { email: 'User already exists' } }
      }
    })

    renderWithRouter(<SignupForm />)

    fireEvent.click(screen.getByText('SIGN UP'))

    expect(
      await screen.findByText(/Please log in or use another email/i)
    ).toBeInTheDocument()
  })

  test('displays error when fields are empty', async () => {
    signup.mockRejectedValue({
      response: {
        data: {
          errors: {
            lastname: 'Lastname is required'
          }
        }
      }
    })

    renderWithRouter(<SignupForm />)

    fireEvent.click(screen.getByText('SIGN UP'))

    expect(await screen.findByText(/Lastname is required/i)).toBeInTheDocument()
  })
})
