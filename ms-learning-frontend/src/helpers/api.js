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

export const getInstructors = async () => {
  try {
    const response = await bc.get('/users/instructors')
    return response.data
  } catch (error) {
    console.error('Error fetching instructors:', error)
    throw error
  }
}

export const getRecommendedCourses = async userId => {
  try {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token')
    const response = await bc.get(`/courses/recommended/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return Array.isArray(response.data)
      ? response.data
      : response.data.courses || []
  } catch (error) {
    console.error('Error fetching recommended courses:', error)
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

export const deleteCourse = async courseId => {
  try {
    await bc.delete(`/course/${courseId}`)
    return { success: true, message: 'Course deleted successfully' }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete course'
    }
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

export const getUserCourses = async () => {
  try {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token')
    const user = JSON.parse(atob(token.split('.')[1]))
    const userId = user?.user_id

    const response = await bc.get(`/courses/user/${userId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching user courses:', error)
    throw error
  }
}

export const getUserCoursesModules = async () => {
  try {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token')
    const user = JSON.parse(atob(token.split('.')[1]))
    const userId = user?.user_id

    const response = await bc.get(`/coursesmodules/user/${userId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching user courses modules:', error)
    throw error
  }
}

export const getUserCoursesModulesLessonsNoResource = async () => {
  try {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token')
    const user = JSON.parse(atob(token.split('.')[1]))
    const userId = user?.user_id

    const response = await bc.get(`/coursesmoduleslessons/user/${userId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching user courses modules:', error)
    throw error
  }
}

export const addResourceToLesson = async (id, resourceFile) => {
  try {
    const formData = new FormData()
    formData.append('resource', resourceFile)

    const response = await bc.post(`/lessons/${id}/resources`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    console.error('Error adding resource:', error)
    throw error
  }
}

export const createCourse = async (courseData, files) => {
  try {
    const formData = new FormData()

    formData.append('data', JSON.stringify(courseData))

    files.forEach(({ moduleIndex, lessonIndex, file }) => {
      formData.append(
        `modules[${moduleIndex}][lessons][${lessonIndex}][resource]`,
        file
      )
    })

    const response = await bc.post('/instructor/course/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  } catch (error) {
    console.error(
      'Error creating course:',
      error.response?.data || error.message
    )
    throw error
  }
}

export const getUserInfos = async () => {
  try {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token')
    const user = JSON.parse(atob(token.split('.')[1]))
    const userId = user?.user_id

    const response = await bc.get(`/user/infos/${userId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching user courses:', error)
    throw error
  }
}

export const updateUserInfos = async (userId, formData) => {
  try {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token')

    const response = await bc.put(`/user/${userId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`
        // 'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  } catch (error) {
    console.error('Detailed error:', {
      message: error.message,
      response: error.response?.data,
      config: error.config
    })
    throw error
  }
}

export const updateUserPassword = async (userId, passwordData) => {
  try {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token')
    const response = await bc.put(`/user/${userId}/password`, passwordData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error) {
    console.error('Password update error:', error)
    throw error
  }
}

export const deleteAccount = async userId => {
  try {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token')
    const response = await bc.delete(`/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error) {
    console.error('Account deletion error:', error)
    throw error
  }
}

export const createLesson = async formData => {
  try {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token')
    const response = await bc.post('/lesson/create', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    console.error('Error creating lesson:', error)
    throw error
  }
}

export const getLatestUserLiveLesson = async userId => {
  try {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token')
    const response = await bc.get(`/lessons/latest-live/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching latest live lesson:', error)
    throw error
  }
}

export const updateLesson = async (lessonId, payload) => {
  try {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token')

    const response = await bc.put(`/lessons/${lessonId}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return response.data
  } catch (error) {
    console.error('Error updating lesson:', error)
    throw error
  }
}

export const getCourseById = async courseId => {
  try {
    const response = await bc.get(`/course/${courseId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching course details:', error)
    throw error
  }
}

export const convertLessonToRegistered = async (lessonId, videoUrl) => {
  try {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token')
    const response = await bc.put(
      `/lessons/${lessonId}/convert-to-registered`,
      { videoUrl },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )
    return response.data
  } catch (error) {
    console.error('Error converting lesson:', error)
    throw error
  }
}

export const deleteLesson = async lessonId => {
  try {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token')
    const response = await bc.delete(`/lessons/${lessonId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error('Error deleting lesson:', error)
    throw error
  }
}

export const getUserLiveSessions = async userId => {
  try {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token')
    const response = await bc.get(`/user/${userId}/live-sessions`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching live sessions:', error)
    throw error
  }
}

export const updateUserInterests = async categories => {
  const response = await bc.post(
    '/user/interests',
    {
      categories
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  return response.data
}

export const getLessonInfo = async lessonId => {
  try {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token')
    const response = await bc.get(`/lesson-info/${lessonId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching lesson info:', error)
    throw error
  }
}

export const getLatestCourses = async () => {
  try {
    const response = await bc.get('/courses/latest')
    return response.data
  } catch (error) {
    console.error('Error fetching latest courses:', error)
    throw error
  }
}

export const getFreeCourses = async () => {
  try {
    const response = await bc.get('/courses/free')
    return response.data
  } catch (error) {
    console.error('Error fetching free courses:', error)
    throw error
  }
}

export const updateCourse = async (courseId, courseData) => {
  try {
    const response = await bc.put(`/course/${courseId}`, courseData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error) {
    console.error('Error updating course:', error)
    throw error
  }
}
