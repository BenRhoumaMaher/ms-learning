import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

const bc = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json'
  }
})

export const signup = async newuserdata => {
  try {
    const response = await api.post('/register', newuserdata)
    return response.data
  } catch (error) {
    // console.error("Signup Error Response:", error.response?.data);
    throw error
  }
}

export const login = async (credentials, rememberme) => {
  try {
    const response = await api.post('/login', {
      ...credentials,
      _remember_me: rememberme
    })
    if (rememberme) {
      localStorage.setItem('token', response.data.token)
    } else {
      sessionStorage.setItem('token', response.data.token)
    }
    return response.data
  } catch (error) {
    throw error
  }
}

export const forgotPassword = async email => {
  try {
    const response = await bc.post('forgot-password', { email })
    return response.data
  } catch (error) {
    throw error
  }
}

export const resetPassword = async (token, password) => {
  try {
    const response = await bc.post('reset-password', { token, password })
    return response.data
  } catch (error) {
    throw error
  }
}

export const googleLogin = async (googleToken, rememberMe) => {
  // console.log("Sending Google Token to Backend:", googleToken)

  try {
    const response = await axios.post(
      'http://localhost:8080/auth/google',
      JSON.stringify({ token: googleToken }),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    console.log('Backend Response:', response.data)
    if (rememberMe) {
      localStorage.setItem('token', response.data.token)
    } else {
      sessionStorage.setItem('token', response.data.token)
    }
    return response.data
  } catch (error) {
    // console.error("Backend Error:", error.response?.data || error.message)
    throw error
  }
}

export const getCategories = async () => {
  try {
    const response = await bc.get('/categories')
    return response.data
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}

export const getCourses = async () => {
  try {
    const response = await bc.get('/courses')
    return response.data
  } catch (error) {
    console.error('Error fetching courses:', error)
    throw error
  }
}

export const becomeInstructor = async newuserdata => {
  try {
    const response = await bc.post('/become-instructor', newuserdata, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    console.error('Signup Error Response:', error.response?.data)
    throw error
  }
}

export const getUsers = async () => {
  try {
    const response = await bc.get('/users')
    return response.data
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

export const getINstructorDemands = async () => {
  try {
    const response = await bc.get('/instructor-demands')
    return response.data
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

export const DeleteINstructorDemands = async id => {
  try {
    const response = await bc.delete(`/demande/${id}`)
    return response.data
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }
}

export const handleAccept = async id => {
  try {
    const response = await bc.post(`/accept-instructor/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to accept instructor')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}
