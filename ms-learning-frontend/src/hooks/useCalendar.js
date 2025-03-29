import { useState, useEffect, useCallback } from 'react';
import { 
  getUserCoursesModules, 
  createLesson, 
  getUserLiveSessions 
} from '../helpers/api';

export const useCalendar = (userId) => {
  const [state, setState] = useState({
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
    selectedDate: null,
    showModal: false,
    message: { text: '', type: '' },
    userCourses: [],
    selectedCourse: '',
    selectedModule: '',
    loading: false,
    liveSessions: [],
    hoveredSession: null,
    popupPosition: { x: 0, y: 0 },
    lessonForm: {
      title: '',
      content: '',
      startTime: '',
      endTime: '',
      position: '',
      meetingLink: '',
      resources: null,
      resourcesPreview: ''
    }
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su'];

  const fetchUserCourses = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const data = await getUserCoursesModules();
      setState(prev => ({ ...prev, userCourses: data.courses || [] }));
    } catch (error) {
      console.error('Error fetching user courses:', error);
      setState(prev => ({ 
        ...prev, 
        message: { text: 'Failed to load courses', type: 'error' } 
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const fetchLiveSessions = useCallback(async () => {
    try {
      const sessions = await getUserLiveSessions(userId);
      setState(prev => ({ ...prev, liveSessions: sessions }));
    } catch (error) {
      console.error('Error fetching live sessions:', error);
    }
  }, [userId]);

  const navigateMonth = (direction) => {
    setState(prev => {
      const newMonth = direction === 'prev' 
        ? prev.currentMonth === 0 ? 11 : prev.currentMonth - 1
        : prev.currentMonth === 11 ? 0 : prev.currentMonth + 1;
      
      const newYear = direction === 'prev' 
        ? prev.currentMonth === 0 ? prev.currentYear - 1 : prev.currentYear
        : prev.currentMonth === 11 ? prev.currentYear + 1 : prev.currentYear;
      
      return { 
        ...prev, 
        currentMonth: newMonth,
        currentYear: newYear,
        selectedDate: null
      };
    });
  };

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getStartDay = (month, year) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const hasLiveSession = (day) => {
    const dateStr = `${state.currentYear}-${(state.currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return state.liveSessions.some(session => session.date === dateStr);
  };

  const getSessionsForDate = (day) => {
    const dateStr = `${state.currentYear}-${(state.currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return state.liveSessions.filter(session => session.date === dateStr);
  };

  const handleDateHover = (e, day) => {
    const sessions = getSessionsForDate(day);
    if (sessions.length > 0) {
      const rect = e.target.getBoundingClientRect();
      setState(prev => ({
        ...prev,
        hoveredSession: { day, sessions },
        popupPosition: {
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY - 10
        }
      }));
    }
  };

  const handleSaveLesson = async () => {
    const { selectedCourse, selectedModule, lessonForm, currentMonth, currentYear, selectedDate } = state;
    
    if (!selectedCourse || !selectedModule || !lessonForm.title || 
        !lessonForm.startTime || !lessonForm.endTime) {
      setState(prev => ({
        ...prev,
        message: { text: 'Please fill all required fields', type: 'error' }
      }));
      return;
    }

    try {
      setState(prev => ({ ...prev, loading: true }));
      
      const formattedDate = `${currentYear}-${(currentMonth + 1)
        .toString()
        .padStart(2, '0')}-${selectedDate.toString().padStart(2, '0')}`;
      
      const formData = new FormData();
      formData.append('course_id', selectedCourse);
      formData.append('module_id', selectedModule);
      formData.append('title', lessonForm.title);
      formData.append('content', lessonForm.content);
      formData.append('liveStartTime', `${formattedDate}T${lessonForm.startTime}`);
      formData.append('liveEndTime', `${formattedDate}T${lessonForm.endTime}`);
      formData.append('position', lessonForm.position);
      formData.append('liveMeetingLink', lessonForm.meetingLink);
      formData.append('user_id', userId);
      
      if (lessonForm.resources) {
        formData.append('resources', lessonForm.resources);
      }

      await createLesson(formData);
      
      setState(prev => ({
        ...prev,
        message: { text: 'Lesson scheduled successfully!', type: 'success' },
        loading: false
      }));
      
      await fetchLiveSessions();
    } catch (error) {
      console.error('Error creating lesson:', error);
      setState(prev => ({
        ...prev,
        message: {
          text: error.response?.data?.error || 'Failed to schedule lesson',
          type: 'error'
        },
        loading: false
      }));
    }
  };

  return {
    state,
    setState,
    months,
    daysOfWeek,
    fetchUserCourses,
    fetchLiveSessions,
    navigateMonth,
    getDaysInMonth,
    getStartDay,
    hasLiveSession,
    getSessionsForDate,
    handleDateHover,
    handleSaveLesson
  };
};