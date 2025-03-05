import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function useAuthRedirect () {
  const navigate = useNavigate()

  useEffect(() => {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token')

    if (!token) {
      navigate('/login')
    }
  }, [navigate])
}