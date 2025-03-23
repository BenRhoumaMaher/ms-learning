export const formatCourseData = (data, userId) => {
  return {
    course: data.course,
    user_id: userId,
    modules: data.modules.map(module => ({
      title: module.title,
      position: module.position,
      lessons: module.lessons.map(lesson => ({
        title: lesson.title,
        content: lesson.content,
        duration: lesson.duration,
        position: lesson.position,
        type: lesson.type,
        ...(lesson.type === 'registered' && { video_url: lesson.video_url }),
        ...(lesson.type === 'live' && {
          livestarttime: lesson.livestarttime,
          liveendtime: lesson.liveendtime,
          liveMeetingLink: lesson.liveMeetingLink
        })
      }))
    }))
  }
}
