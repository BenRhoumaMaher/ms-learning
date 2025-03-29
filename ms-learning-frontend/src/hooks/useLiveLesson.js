import { useState, useEffect, useCallback } from 'react'
import {
  getLatestUserLiveLesson,
  updateLesson,
  convertLessonToRegistered,
  deleteLesson
} from '../helpers/api'

export const useLiveLesson = () => {
  const [latestLesson, setLatestLesson] = useState(null)
  const [timeRemaining, setTimeRemaining] = useState('Loading...')
  const [isLoading, setIsLoading] = useState(true)
  const [alert, setAlert] = useState({
    show: false,
    message: '',
    variant: 'success'
  })

  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  const user = token ? JSON.parse(atob(token.split('.')[1])) : null
  const userId = token ? user.user_id : null

  const fetchLatestLesson = useCallback(async () => {
    try {
      setIsLoading(true)
      if (!userId) return

      const lesson = await getLatestUserLiveLesson(userId)
      setLatestLesson(lesson || null)
      return lesson
    } catch (error) {
      console.error('Error fetching latest lesson:', error)
      setAlert({
        show: true,
        message: 'Error loading session data',
        variant: 'danger'
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  const updateCountdown = useCallback(lesson => {
    if (!lesson) return

    const now = new Date()
    const startTime = new Date(lesson.liveStartTime)
    const diff = startTime - now

    if (diff <= 0) {
      setTimeRemaining('Live session has started!')
      return
    }

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    setTimeRemaining(`Starting in ${hours}h ${minutes}m ${seconds}s`)
  }, [])

  const handleUpdateLesson = async (lessonId, payload) => {
    try {
      setIsLoading(true)
      await updateLesson(lessonId, payload)
      const updatedLesson = await fetchLatestLesson()
      setAlert({
        show: true,
        message: 'Lesson updated successfully!',
        variant: 'success'
      })
      return updatedLesson
    } catch (error) {
      setAlert({
        show: true,
        message: error.response?.data?.error || 'Failed to update lesson',
        variant: 'danger'
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelAction = async (action, lessonId, videoUrl = '') => {
    try {
      setIsLoading(true)
      if (action === 'convert') {
        await convertLessonToRegistered(lessonId, videoUrl)
        setAlert({
          show: true,
          message: 'Lesson converted successfully!',
          variant: 'success'
        })
      } else if (action === 'delete') {
        await deleteLesson(lessonId)
        setAlert({
          show: true,
          message: 'Lesson deleted successfully!',
          variant: 'success'
        })
      }
      await fetchLatestLesson()
    } catch (error) {
      setAlert({
        show: true,
        message: error.response?.data?.error || 'Failed to process action',
        variant: 'danger'
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchLatestLesson()
    }
  }, [userId, fetchLatestLesson])

  useEffect(() => {
    if (!latestLesson) return

    const timer = setInterval(() => updateCountdown(latestLesson), 1000)
    updateCountdown(latestLesson)
    return () => clearInterval(timer)
  }, [latestLesson, updateCountdown])

  return {
    userId,
    latestLesson,
    timeRemaining,
    isLoading,
    alert,
    setAlert,
    fetchLatestLesson,
    handleUpdateLesson,
    handleCancelAction
  }
}
