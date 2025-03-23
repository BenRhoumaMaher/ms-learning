import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { createCourse } from '../helpers/api'
import { formatCourseData } from '../helpers/formatCourseData'

const useCourseForm = (userId, userCourses, resetForm) => {
  const { register, handleSubmit, control, watch, setValue, reset } = useForm()
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const {
    fields: moduleFields,
    append: appendModule,
    remove: removeModule
  } = useFieldArray({
    control,
    name: 'modules'
  })

  const onSubmit = async data => {
    setLoading(true)
    setMessage(null)

    const files = []
    data.modules.forEach((module, moduleIndex) => {
      module.lessons.forEach((lesson, lessonIndex) => {
        if (lesson.ressources && lesson.ressources.length > 0) {
          files.push({
            moduleIndex,
            lessonIndex,
            file: lesson.ressources[0]
          })
        }
      })
    })

    try {
      const formattedData = formatCourseData(data, userId)

      const response = await createCourse(formattedData, files)
      setMessage({
        type: 'success',
        text: response.message || 'Course created successfully!'
      })
      reset()
      resetForm()
      setSelectedCourse(null)
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to create course. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  return {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    selectedCourse,
    setSelectedCourse,
    loading,
    message,
    moduleFields,
    appendModule,
    removeModule,
    onSubmit
  }
}

export default useCourseForm
