import { useState, useEffect } from 'react'
import {
  getUserCoursesModules,
  getCourseById,
  updateCourse,
  deleteCourse,
  createLesson,
  getUserCoursesModulesLessonsNoResource,
  addResourceToLesson
} from '../helpers/api'

export default function useInstructorCourses () {
  const [courses, setCourses] = useState([])
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [courseDetails, setCourseDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [coursesWithLessonsNoResources, setCoursesWithLessonsNoResources] =
    useState([])

  // Modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState(null)
  const [showContentModal, setShowContentModal] = useState(false)
  const [showAddResourceModal, setShowAddResourceModal] = useState(false)
  const [showAddLessonModal, setShowAddLessonModal] = useState(false)

  // Resource states
  const [selectedCourseForResource, setSelectedCourseForResource] = useState('')
  const [selectedModuleForResource, setSelectedModuleForResource] = useState('')
  const [selectedLessonForResource, setSelectedLessonForResource] = useState('')
  const [resourceFile, setResourceFile] = useState(null)

  // Lesson states
  const [selectedCourseForLesson, setSelectedCourseForLesson] = useState('')
  const [selectedModuleForLesson, setSelectedModuleForLesson] = useState('')
  const [lessonData, setLessonData] = useState({
    title: '',
    content: '',
    position: '',
    type: '',
    liveStartTime: '',
    liveEndTime: '',
    liveMeetingLink: '',
    videoUrl: '',
    resources: null
  })

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    level: 'beginner',
    price: ''
  })

  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  const user = token ? JSON.parse(atob(token.split('.')[1])) : null
  const userId = token ? user.user_id : null

  useEffect(() => {
    if (userId) {
      fetchCourses()
      fetchCoursesWithLessonsNoResources()
    }
  }, [userId])

  const fetchCoursesWithLessonsNoResources = async () => {
    try {
      const response = await getUserCoursesModulesLessonsNoResource()
      setCoursesWithLessonsNoResources(response.courses)
    } catch (error) {
      console.error('Error fetching courses without resources:', error)
    }
  }

  const fetchCourses = async () => {
    setLoading(true)
    try {
      const response = await getUserCoursesModules()
      setCourses(response.courses)
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCourseChange = async e => {
    const courseId = e.target.value
    setSelectedCourseId(courseId)

    if (courseId) {
      setLoading(true)
      try {
        const courseData = await getCourseById(courseId)
        setCourseDetails(courseData)
        setFormData({
          title: courseData.title,
          description: courseData.description,
          duration: courseData.duration,
          level: courseData.level || 'beginner',
          price: courseData.price
        })
      } catch (error) {
        console.error('Error fetching course details:', error)
      } finally {
        setLoading(false)
      }
    } else {
      setCourseDetails(null)
    }
  }

  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleUpdateCourse = async () => {
    if (!selectedCourseId) return

    try {
      setLoading(true)
      await updateCourse(selectedCourseId, formData)
      setSuccessMessage('Course updated successfully! ✅')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Error updating course:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return

    try {
      setDeleteLoading(true)
      await deleteCourse(courseToDelete)
      await fetchCourses()
      setSuccessMessage('Course deleted successfully! ✅')
      setDeleteModalOpen(false)
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Error deleting course:', error)
    } finally {
      setDeleteLoading(false)
    }
  }

  const getSelectedCourseModules = () => {
    if (!selectedCourseForLesson) return []
    const course = courses.find(c => c.id === selectedCourseForLesson)
    return course ? course.modules : []
  }

  const validateLessonData = () => {
    if (
      !lessonData.title ||
      !lessonData.content ||
      !lessonData.position ||
      !lessonData.type
    ) {
      return false
    }

    if (lessonData.type === 'live') {
      if (
        !lessonData.liveStartTime ||
        !lessonData.liveEndTime ||
        !lessonData.liveMeetingLink
      ) {
        return false
      }
    } else {
      if (!lessonData.videoUrl) return false
    }

    return true
  }

  const handleAddResource = async () => {
    if (!selectedLessonForResource || !resourceFile) return

    try {
      setLoading(true)
      await addResourceToLesson(selectedLessonForResource, resourceFile)
      setSuccessMessage('Resource added successfully! ✅')
      setShowAddResourceModal(false)
      setTimeout(() => setSuccessMessage(''), 3000)

      setSelectedCourseForResource('')
      setSelectedModuleForResource('')
      setSelectedLessonForResource('')
      setResourceFile(null)

      await fetchCoursesWithLessonsNoResources()
    } catch (error) {
      console.error('Error adding resource:', error)
      alert(
        error.response?.data?.error ||
          'Failed to add resource. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleAddLesson = async () => {
    if (
      !selectedCourseForLesson ||
      !selectedModuleForLesson ||
      !validateLessonData()
    ) {
      alert('Please fill all required fields')
      return
    }

    try {
      const token =
        localStorage.getItem('token') || sessionStorage.getItem('token')
      const user = token ? JSON.parse(atob(token.split('.')[1])) : null

      const formData = new FormData()
      formData.append('course_id', selectedCourseForLesson)
      formData.append('module_id', selectedModuleForLesson)
      formData.append('title', lessonData.title)
      formData.append('content', lessonData.content)
      formData.append('position', lessonData.position)
      formData.append('type', lessonData.type)
      formData.append('user_id', user.user_id)

      if (lessonData.type === 'live') {
        formData.append('liveStartTime', lessonData.liveStartTime)
        formData.append('liveEndTime', lessonData.liveEndTime)
        formData.append('liveMeetingLink', lessonData.liveMeetingLink)
      } else {
        formData.append('videoUrl', lessonData.videoUrl)
      }

      if (lessonData.resources) {
        formData.append('resources', lessonData.resources)
      }

      await createLesson(formData)
      setSuccessMessage('Lesson created successfully! ✅')
      setShowAddLessonModal(false)
      setTimeout(() => setSuccessMessage(''), 3000)

      setSelectedCourseForLesson('')
      setSelectedModuleForLesson('')
      setLessonData({
        title: '',
        content: '',
        position: '',
        type: '',
        liveStartTime: '',
        liveEndTime: '',
        liveMeetingLink: '',
        videoUrl: '',
        resources: null
      })
    } catch (error) {
      console.error('Error adding lesson:', error)
      alert(
        error.response?.data?.error ||
          'Failed to create lesson. Please try again.'
      )
    }
  }

  return {
    // State
    courses,
    selectedCourseId,
    courseDetails,
    loading,
    deleteLoading,
    successMessage,
    deleteModalOpen,
    courseToDelete,
    showContentModal,
    showAddResourceModal,
    showAddLessonModal,
    selectedCourseForResource,
    selectedModuleForResource,
    selectedLessonForResource,
    resourceFile,
    coursesWithLessonsNoResources,
    selectedCourseForLesson,
    selectedModuleForLesson,
    lessonData,
    formData,

    // Functions
    setSelectedCourseId,
    setCourseToDelete,
    setDeleteModalOpen,
    setShowContentModal,
    setShowAddResourceModal,
    setShowAddLessonModal,
    setSelectedCourseForResource,
    setSelectedModuleForResource,
    setSelectedLessonForResource,
    setResourceFile,
    setSelectedCourseForLesson,
    setSelectedModuleForLesson,
    setLessonData,
    setFormData,

    handleCourseChange,
    handleInputChange,
    handleUpdateCourse,
    handleDeleteCourse,
    handleAddResource,
    handleAddLesson,
    getSelectedCourseModules,
    validateLessonData
  }
}
