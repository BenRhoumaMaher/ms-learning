import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

export const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}))

export function renderWithRouter (ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

export function fillFormFields (screen, { email, password }) {
  
  fireEvent.change(screen.getByPlaceholderText(/Email/i), {
    target: { value: email }
  })

  const passwordFields = screen.getAllByPlaceholderText(/Password/i)
  fireEvent.change(passwordFields[0], { target: { value: password } })
}
