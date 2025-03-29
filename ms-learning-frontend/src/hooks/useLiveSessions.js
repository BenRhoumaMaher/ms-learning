import { useState, useEffect, useCallback } from 'react'
import {
  getUserLiveSessions,
  getLessonInfo,
  updateLesson
} from '../helpers/api'

export const useLiveSessions = () => {
  const [state, setState] = useState({
    sessions: [],
    visibleIndex: 0,
    selectedSession: null,
    lessonDetails: null,
    showModal: false,
    loading: false
  })

  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  const user = token ? JSON.parse(atob(token.split('.')[1])) : null
  const userId = user?.user_id

  const fetchSessions = useCallback(async () => {
    try {
      if (userId) {
        const data = await getUserLiveSessions(userId)
        setState(prev => ({ ...prev, sessions: data }))
      }
    } catch (error) {
      console.error('Error fetching live sessions:', error)
    }
  }, [userId])

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  const handlePrev = () => {
    setState(prev => ({
      ...prev,
      visibleIndex:
        prev.visibleIndex === 0
          ? prev.sessions.length - 3
          : prev.visibleIndex - 1
    }))
  }

  const handleNext = () => {
    setState(prev => ({
      ...prev,
      visibleIndex:
        prev.visibleIndex + 3 >= prev.sessions.length
          ? 0
          : prev.visibleIndex + 1
    }))
  }

  const handleModifyClick = async session => {
    setState(prev => ({
      ...prev,
      selectedSession: session,
      showModal: true,
      loading: true
    }))

    try {
      const lessonData = await getLessonInfo(session.id)
      setState(prev => ({
        ...prev,
        lessonDetails: lessonData,
        loading: false
      }))
    } catch (error) {
      console.error('Error fetching lesson details:', error)
      setState(prev => ({
        ...prev,
        loading: false
      }))
    }
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setState(prev => ({
      ...prev,
      lessonDetails: {
        ...prev.lessonDetails,
        [name]: value
      }
    }))
  }

  const handleSaveChanges = async () => {
    if (!state.lessonDetails) return

    setState(prev => ({ ...prev, loading: true }))

    try {
      await updateLesson(state.selectedSession.id, {
        title: state.lessonDetails.title,
        content: state.lessonDetails.content,
        liveStartTime: state.lessonDetails.liveStartTime,
        liveEndTime: state.lessonDetails.liveEndTime,
        position: state.lessonDetails.position,
        liveMeetingLink: state.lessonDetails.liveMeetingLink
      })

      setState(prev => ({
        ...prev,
        showModal: false,
        loading: false,
        sessions: prev.sessions.map(session =>
          session.id === prev.selectedSession.id
            ? { ...session, ...prev.lessonDetails }
            : session
        )
      }))
    } catch (error) {
      console.error('Error updating lesson:', error)
      setState(prev => ({ ...prev, loading: false }))
    }
  }

  return {
    state,
    setState,
    userId,
    handlePrev,
    handleNext,
    handleModifyClick,
    handleInputChange,
    handleSaveChanges,
    fetchSessions
  }
}
