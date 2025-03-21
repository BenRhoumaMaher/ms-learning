import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { becomeInstructor, getCourses } from '../../../helpers/api'
import JoinFamily from '../../../pages/becomeinsctructor/sections/JoinFamily'

export default function JoinFamilyContainer () {
  const formMethods = useForm({
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      expertise: '',
      course: '',
      resume: null
    }
  })

  const [courses, setCourses] = useState([])
  const [globalError, setGlobalError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courseList = await getCourses()
        setCourses(courseList.sort((a, b) => a.title.localeCompare(b.title)))
      } catch (error) {
        console.error('Failed to fetch courses:', error)
        setGlobalError('Failed to load courses. Please try again later.')
      }
    }
    fetchCourses()
  }, [])

  const onSubmit = async data => {
    try {
      const formData = new FormData()

      formData.append('firstname', data.firstname)
      formData.append('lastname', data.lastname)
      formData.append('email', data.email)
      formData.append('expertise', data.expertise)

      data.courses.forEach((courseId, index) => {
        formData.append(`courses[${index}]`, courseId)
      })

      if (data.resume instanceof File) {
        formData.append('resume', data.resume)
      }

      await becomeInstructor(formData)

      setSuccessMessage('Your demand has been received.')
      setGlobalError(null)
      formMethods.reset()
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
    <JoinFamily
      formMethods={formMethods}
      courses={courses}
      globalError={globalError}
      successMessage={successMessage}
      onSubmit={onSubmit}
    />
  )
}
