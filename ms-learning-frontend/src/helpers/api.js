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

export const getPlans = async () => {
  try {
    const response = await bc.get('/plans');
    return response.data;
  } catch (error) {
    console.error('Error fetching plans:', error);
    throw error;
  }
};

export const subscribeToPlan = async (planId) => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const user = JSON.parse(atob(token.split('.')[1]));

    const response = await bc.post('/plans/subscribe', {
      planId,
      userId: user.user_id
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error subscribing to plan:', error);
    throw error;
  }
};

export const enrollInPaidCourse = async (courseId) => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const user = JSON.parse(atob(token.split('.')[1]));

    const response = await bc.post('/payment/enroll', {
      courseId,
      userId: user.user_id
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error enrolling in course:', error);
    throw error;
  }
};

export const payForPlan = async (planId) => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const user = JSON.parse(atob(token.split('.')[1]));

    const response = await bc.post('/plans/pay', {
      planId,
      userId: user.user_id
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error initiating plan payment:', error);
    throw error;
  }
};

export const googleLogin = async (googleToken, rememberMe) => {

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
    throw error
  }
}

export const getForumPostById = async (id) => {
  try {
    const response = await bc.get(`/forum-posts/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch post');
  }
};


export const getSiblingsById = async (id) => {
  const response = await bc.get(`/forum-posts/${id}/siblings`);
  return response.data;
};



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

export const getPosts = async () => {
  try {
    const response = await bc.get('/posts')
    return response.data
  } catch (error) {
    console.error('Error fetching courses:', error)
    throw error
  }
}

export const getTestimonials = async () => {
  try {
    const response = await bc.get('/testimonials');
    return response.data;
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    throw error;
  }
};

export const getFAQs = async () => {
  try {
    const response = await bc.get('/faqs');
    return response.data;
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    throw error;
  }
};

export const createTestimonial = async (testimonialData) => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const response = await bc.post('/testimonials', testimonialData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating testimonial:', error);
    throw error;
  }
};

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

export const getQaInstructor = async () => {
  try {
    const response = await bc.get('/qa-instructor');
    return response.data;
  } catch (error) {
    console.error('Error fetching QA data:', error);
    throw error;
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

export const trackLessonEngagement = async (lessonId, engagementData) => {
  try {
    const response = await bc.post(`/lessons/${lessonId}/engagement`, engagementData);
    return response.data;
  } catch (error) {
    console.error('Error tracking engagement:', error);
    throw error;
  }
};

export const trackLessonView = async (lessonId) => {
  try {
    const response = await bc.post(`/lessons/${lessonId}/view`);
    return response.data;
  } catch (error) {
    console.error('Error tracking lesson view:', error);
    throw error;
  }
};

export const getInstructorStudents = async (instructorId) => {
  try {
    const response = await bc.get(`/instructor/${instructorId}/students`);
    return response.data;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
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

export const getUserPurchasedCourses = async (userId = null) => {
  try {
    if (!userId) {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const user = JSON.parse(atob(token.split('.')[1]));
      userId = user?.user_id;

      if (!userId) throw new Error('User ID not found in token');
    }

    const response = await bc.get(`/payment/pruchased-user-courses/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching purchased courses:', error);
    throw error;
  }
};

export const getUserPaymentHistory = async (userId = null) => {
  try {
    if (!userId) {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const user = JSON.parse(atob(token.split('.')[1]));
      userId = user?.user_id;

      if (!userId) throw new Error('User ID not found in token');
    }

    const response = await bc.get(`/payment/history/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching purchased courses:', error);
    throw error;
  }
};

export const getCurrentSubscription = async (userId = null) => {
  try {
    if (!userId) {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const user = JSON.parse(atob(token.split('.')[1]));
      userId = user?.user_id;

      if (!userId) throw new Error('User ID not found in token');
    }

    const response = await bc.get(`/user-subscription/current/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching current subscription:', error);
    throw error;
  }
};

export const getUserCourses = async (userId = null) => {
  try {
    if (!userId) {
      const token =
        localStorage.getItem('token') || sessionStorage.getItem('token');
      const user = JSON.parse(atob(token.split('.')[1]));
      userId = user?.user_id;
    }

    const response = await bc.get(`/courses/user/${userId}`)
    console.log('Backend response:', response.data)
    return response.data
  } catch (error) {
    console.error('Error fetching user courses:', error)
    throw error
  }
}

export const getUserPlan = async (userId = null) => {
  try {
    if (!userId) {
      const token =
        localStorage.getItem('token') || sessionStorage.getItem('token');
      const user = JSON.parse(atob(token.split('.')[1]));
      userId = user?.user_id;
    }

    const response = await bc.get(`/plans/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user plan:', error);
    throw error;
  }
};

export const getInstructorCourses = async instructorId => {
  try {
    const response = await bc.get(`/courses/user/${instructorId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching instructor courses:', error)
    throw error
  }
}

export const getInstructorContent = async Id => {
  try {
    const response = await bc.get(`/content/user/${Id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching instructor content:', error)
    throw error
  }
}

export const searchCourses = async (query) => {
  try {
    const response = await bc.get(`/search/courses?q=${encodeURIComponent(query)}`);
    return response.data.results;
  } catch (error) {
    console.error('Error searching courses:', error);
    throw error;
  }
};

export const saveQuizScore = async (userId, quizId, score, totalQuestions) => {
  try {
    console.log("Sending to backend:", { userId, quizId, score, totalQuestions });
    const response = await bc.post('/scores/save', {
      userId,
      quizId,
      score,
      totalQuestions
    });
    return response.data;
  } catch (error) {
    console.error('Error saving quiz score:', error);
    throw error;
  }
};


export const getQuizComparisonData = async (quizId, userId, userScore, totalQuestions) => {
  try {
    const response = await bc.get(`/scores/comparison/${quizId}`, {
      params: {
        userId,
        userScore,
        totalQuestions
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching comparison data:', error);
    throw error;
  }
};

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

export const getUserInfos = async (userId = null) => {
  try {
    if (!userId) {
      const token =
        localStorage.getItem('token') || sessionStorage.getItem('token');
      const user = JSON.parse(atob(token.split('.')[1]));
      userId = user?.user_id;
    }

    const response = await bc.get(`/user/infos/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user infos:', error);
    throw error;
  }
};

export const getUserEnrollements = async (userId = null) => {
  try {
    if (!userId) {
      const token =
        localStorage.getItem('token') || sessionStorage.getItem('token');
      const user = JSON.parse(atob(token.split('.')[1]));
      userId = user?.user_id;
    }

    const response = await bc.get(`/student/${userId}/courses/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user infos:', error);
    throw error;
  }
};

export const getTrendingCourses = async () => {
  try {
    const response = await bc.get('/trending-courses')
    return response.data
  } catch (error) {
    console.error('Error fetching courses:', error)
    throw error
  }
}

export const getLessonQuizScores = async id => {
  try {
    const response = await bc.get(`${id}/scores`)
    return response.data
  } catch (error) {
    console.error('Error fetching courses:', error)
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

export const createPost = async formData => {
  try {
    const response = await bc.post('/create/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    console.error('Error creating post:', error)
    throw error
  }
}

export const createForumPost = async formData => {
  try {
    const response = await bc.post('/createforum', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    console.error('Error creating post:', error)
    throw error
  }
}

export const getForumPosts = async () => {
  try {
    const response = await bc.get('/forum')
    return response.data
  } catch (error) {
    console.error('Error fetching courses:', error)
    throw error
  }
}

export const getInstructorForumPosts = async userId => {
  try {
    const response = await bc.get(`instructor/${userId}/forum-posts`)
    return response.data
  } catch (error) {
    console.error('Error fetching courses:', error)
    throw error
  }
}

export const getLogLevelStats = async () => {
  try {
    const response = await bc.get('/logs/stats/levels');
    return response.data;
  } catch (error) {
    console.error('Error fetching log stats:', error);
    throw error;
  }
};

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

export const getPostById = async postId => {
  try {
    const response = await bc.get(`/post/${postId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching post details:', error)
    throw error
  }
}

export const sendChatbotMessage = async (message) => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const user = JSON.parse(atob(token.split('.')[1]));
    const userId = user?.user_id;

    const response = await bc.post('/chatbot/send', {
      message,
      user_id: userId
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error sending chatbot message:', error);
    throw error;
  }
};


export const getUserChatbotMessages = async () => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const user = JSON.parse(atob(token.split('.')[1]));
    const userId = user?.user_id;

    const response = await bc.get('/chatbot/messages', {
      params: {
        user_id: userId
      }
    });

    return response.data.messages;
  } catch (error) {
    console.error('Error fetching user chatbot messages:', error);
    throw error;
  }
};
export const getPendingChatbotMessages = async () => {
  try {
    const response = await bc.get('/chatbot/admin/pending');
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const user = JSON.parse(atob(token.split('.')[1]));
    const userId = user?.user_id;
    return response.data;
  } catch (error) {
    console.error('Error fetching pending chatbot messages:', error);
    throw error;
  }
};

export const respondToChatbotMessage = async (messageId, response) => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const user = JSON.parse(atob(token.split('.')[1]));
    const userId = user?.user_id;
    const result = await bc.post(`/chatbot/admin/respond/${messageId}`, {
      response: response,
      user_id: userId
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return result.data;
  } catch (error) {
    console.error('Error responding to chatbot message:', error);
    throw error;
  }
};

export const markChatbotMessageAsRead = async (messageId) => {
  try {
    const response = await bc.post(`/chatbot/mark-as-read/${messageId}`);
    return response.data;
  } catch (error) {
    console.error('Error marking message as read:', error);
    throw error;
  }
};

export const createComment = async formData => {
  try {
    const response = await bc.post('/comments', formData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error) {
    console.error('Error creating post:', error)
    throw error
  }
}

export const followUser = async (userId, targetId) => {
  return await bc.post('/follow', {
    user_id: userId,
    target_id: targetId,
  });
};

export const unfollowUser = async (userId, targetId) => {
  return await bc.post('/unfollow', {
    user_id: userId,
    target_id: targetId,
  });
};

export const fetchSuggestedUsers = async (userId) => {
  const response = await bc.get(`/suggested/${userId}`);
  return response.data;
};

export const fetchUserFollowers = async (userId) => {
  const response = await bc.get(`/followers/${userId}`);
  return response.data;
};

export const fetchUserFollowings = async (userId) => {
  const response = await bc.get(`/followings/${userId}`);
  return response.data;
};

export const sendMessage = async (roomId, content, receiverId) => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const user = JSON.parse(atob(token.split('.')[1]));
    const userId = user?.user_id;

    const response = await bc.post('/messages', {
      content,
      roomId: roomId,
      user_id: userId,
      receiver_id: receiverId
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getMessages = async (roomId) => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const user = token ? JSON.parse(atob(token.split('.')[1])) : null;
    const userId = user?.user_id;

    const response = await bc.get(`/messages/${roomId}`, {
      params: {
        userId: userId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const fetchUserPostsWithComments = async (userId) => {
  const response = await bc.get(`/user/posts/${userId}`);
  return response.data;
};

export const toggleLike = async (postId, userId) => {
  try {
    const response = await bc.post(
      `/posts/${postId}/like`,
      { user_id: userId },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};


export const updatePost = async (postId, data) => {
  try {
    const response = await bc.put(`/posts/${postId}`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (err) {
    console.error('Error updating post:', err);
    throw err;
  }
};
export const deletePost = async (postId) => {
  try {
    const response = await bc.delete(`/posts/${postId}`);
    return response.data;
  } catch (err) {
    console.error('Error deleting post:', err);
    throw err;
  }
};

export const createReply = async (commentId, formData) => {
  try {
    const response = await bc.post(`/comments/${commentId}/replies`, formData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating reply:', error);
    throw error;
  }
};

export const getRepliesByComment = async (commentId) => {
  try {
    const response = await bc.get(`/comments/${commentId}/replies`);
    return response.data;
  } catch (error) {
    console.error('Error fetching replies:', error);
    throw error;
  }
};

export const getCommentsByPost = async postId => {
  try {
    const response = await bc.get(`/${postId}/comments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments for post:', error);
    throw error;
  }
};

export const getCommentById = async commentId => {
  try {
    const response = await bc.get(`/comment/${commentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comment:', error);
    throw error;
  }
};



export const getEnrolledCourse = async courseId => {
  try {
    const response = await bc.get(`/enrolledCourse/${courseId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching course details:', error)
    throw error
  }
}

export const getQuizQuestions = async (lessonId) => {
  try {
    const response = await bc.get(`/quizzes/lesson/${lessonId}/questions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    throw error;
  }
};

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

export const getCoursesByCategory = async (categoryId) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const response = await bc.get(`/courses/by-category/${categoryId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getLatestCourses = async () => {
  try {
    const response = await bc.get('/courses/latest')
    return response.data
  } catch (error) {
    console.error('Error fetching latest courses:', error)
    throw error
  }
}

export const getLatestLiveLessons = async () => {
  try {
    const response = await bc.get('/lessons/latest');
    return response.data;
  } catch (error) {
    console.error('Error fetching latest live lessons:', error);
    throw error;
  }
};


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

export const getInstructorById = async id => {
  try {
    const response = await bc.get(`/instructor/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching instructor:', error)
    throw error
  }
}

export const enrollInCourse = async (courseId, userId) => {
  const response = await bc.post(`/enroll/${courseId}`, { userId })
  return response.data
}

export const getCourseReviews = async courseId => {
  try {
    const response = await bc.get(`/${courseId}/reviews`)
    return response.data
  } catch (error) {
    console.error('Error fetching course reviews:', error)
    throw error
  }
}

export const createCourseReview = async (courseId, reviewData) => {
  try {
    const response = await bc.post(`/courses/${courseId}/reviews`, reviewData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error) {
    console.error('Error creating review:', error)
    throw error
  }
}
