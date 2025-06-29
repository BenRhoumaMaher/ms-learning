import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import SignupContainer from './components/containers/auth/SignupContainer'
import LoginContainer from './components/containers/auth/LoginContainer'
import ResetPasswordContainer from './components/containers/auth/ResetPasswordContainer'
import ForgotPasswordContainer from './components/containers/auth/ForgotPasswordContainer'
import Navbar from "./layouts/Navbar";
import Home from './pages/home/Home'
import RoleBasedRoute from './components/RoleBasedRoute'
import StudentDashboard from './pages/student-dashboard/StudentDashboard'
import StudentNotification from './pages/student-notifications/StudentNotification'
import StudentPayment from './pages/student-payment/StudentPayment'
import StudentCalendar from './pages/student-calendar/StudentCalendar'
import RegisteredCourses from './pages/registered-courses/RegisteredCourses'
import Quiz from './pages/quiz/Quiz'
import InstructorPublic from './pages/insctructor-public/InstructorPublic'
import InsctructorDashboard from './pages/insctructor-dashboard/InstructorDashboard'
import CourseCatalog from './pages/coursecatalog/CourseCatalog'
import AccountSettings from './pages/accountsettingsstudent/AccountSettings'
import BecomeInstructor from './pages/becomeinsctructor/BeComeInstructor'
import LessonPlayer from './pages/lessonplayer/LessonPlayer'
import LiveCourse from './pages/livecourse/LiveCourse'
import Dashboard from './pages/admin/Dashboard'
import Users from './pages/admin/Users'
import UsersList from './pages/admin/UsersList'
import InstructorDemands from './pages/admin/InstructorDemands'
import CreateCourse from './pages/createCourseInstructor/CreateCourse'
import AccoyntSettingsInstructor from './pages/accountsettingsinstructor/AccountSettingsInstructor'
import InstructorCalendar from './pages/instructor-calendar/InstructorCalendar'
import UserProfilePage from './pages/msconnect/msconnectprofile/UserProfilePage'
import UserProfileSection from './pages/msconnect/msconnectprofile/sections/UserProfileSection'
import UserActivitySection from './pages/msconnect/msconnectprofile/sections/UserActivitySection'
import UserFriendsSection from './pages/msconnect/msconnectprofile/sections/UserFriendsSection'
import UserForumSection from './pages/msconnect/msconnectprofile/sections/UserForumSection'
import MsConnectHome from './pages/msconnect/msconnecthome/msconnectHome'
import MsconnectMessage from './pages/msconnect/msconnectMessage/msconnectMessage'
import MsconnectForum from './pages/msconnect/forum/MsconnectForum'
import MsconnectForumPost from './pages/msconnect/forumpost/msconnectforumpost'
import MsconnectNotifications from './pages/msconnect/msnotifications/msconnectnotifications'
import ChatbotMessagesList from './pages/admin/ChatbotMessagesList'
import ChatbotWidget from './pages/admin/ChatbotWidget'
import QuizQuestion from './pages/quiz/sections/QuizQuestion'
import InstructorIotDashboard from './pages/instructor-iot-dashboard/InstructorIotDashboard'
import InstructorRouteGuard from './components/instructor-dashboard/InstructorRouteGuard'
import UserSpecificRoute from './components/UserSpecificRoute';
import StudentManagement from './pages/instructor-iot-dashboard/sections/StudentManagement'
import EngagementAnalytics from './pages/instructor-iot-dashboard/sections/EngagementAnalytics'
import OverView from './pages/instructor-iot-dashboard/sections/OverView'
import FeedbackAndSentiment from './pages/instructor-iot-dashboard/sections/FeedbackAndSentiment'
import UserEnrollements from './pages/studentenrollements/UserEnrollements'
import LogsDashboard from './pages/admin/LogsDashboard'
import EnrollmentCheckRoute from './components/EnrollmentCheckRoute'
import LessonAccessCheckRoute from './components/LessonAccessCheckRoute'

function App() {

  return (
    <div className='App'>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/signup' element={<SignupContainer />} />
          <Route path='/login' element={<LoginContainer />} />
          <Route path='/' element={<Home />} />
          <Route path='/forgot-password' element={<ForgotPasswordContainer />} />
          <Route path='/reset-password' element={<ResetPasswordContainer />} />
          <Route path='/student-dashboard' element={<RoleBasedRoute allowedRoles={['ROLE_STUDENT']}><StudentDashboard /></RoleBasedRoute>} />
          <Route path='/student-notifications' element={<StudentNotification />} />
          <Route path='/student-payment' element={<RoleBasedRoute allowedRoles={['ROLE_STUDENT']}><StudentPayment /></RoleBasedRoute>} />
          <Route path='/student-calendar' element={<RoleBasedRoute allowedRoles={['ROLE_STUDENT']}><StudentCalendar /></RoleBasedRoute>} />
          <Route path='/registered-courses/:id' element={<RoleBasedRoute allowedRoles={['ROLE_STUDENT']}><EnrollmentCheckRoute><RegisteredCourses /></EnrollmentCheckRoute></RoleBasedRoute>} />
          <Route path='/user-enrollements/:id' element={<RoleBasedRoute allowedRoles={['ROLE_STUDENT']}><UserSpecificRoute><UserEnrollements /></UserSpecificRoute></RoleBasedRoute>} />
          <Route path="/quiz/:id" element={<RoleBasedRoute allowedRoles={['ROLE_STUDENT']}><LessonAccessCheckRoute><Quiz /></LessonAccessCheckRoute></RoleBasedRoute>} />
          <Route path="/quiz/:id/question/:questionId" element={<RoleBasedRoute allowedRoles={['ROLE_STUDENT']}><QuizQuestion /></RoleBasedRoute>} />
          <Route path='/instructor-public/:id' element={<RoleBasedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_INSTRUCTOR', 'ROLE_ADMIN']}><InstructorPublic /></RoleBasedRoute>} />
          <Route path='/instructor-dashboard' element={<RoleBasedRoute allowedRoles={['ROLE_INSTRUCTOR']}><InsctructorDashboard /></RoleBasedRoute>} />
          <Route path='/course-catalog' element={<RoleBasedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_INSTRUCTOR', 'ROLE_ADMIN']}><CourseCatalog /></RoleBasedRoute>} />
          <Route path='/account-settings' element={<RoleBasedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_INSTRUCTOR']}><AccountSettings /></RoleBasedRoute>} />
          <Route path='/become-instructor' element={<BecomeInstructor />} />
          <Route path='/lesson-player/:id' element={<RoleBasedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_INSTRUCTOR']}><LessonAccessCheckRoute><LessonPlayer /></LessonAccessCheckRoute></RoleBasedRoute>} />
          <Route path='/live-course' element={<LiveCourse />} />
          <Route path='/admin' element={<RoleBasedRoute allowedRoles={['ROLE_ADMIN']}><Dashboard /></RoleBasedRoute>} />
          <Route path='/admin/users' element={<RoleBasedRoute allowedRoles={['ROLE_ADMIN']}><Users /></RoleBasedRoute>} />
          <Route path='/admin/users-list' element={<RoleBasedRoute allowedRoles={['ROLE_ADMIN']}><UsersList /></RoleBasedRoute>} />
          <Route path='/admin/instructor-demands' element={<RoleBasedRoute allowedRoles={['ROLE_ADMIN']}><InstructorDemands /></RoleBasedRoute>} />
          <Route path='/admin/chatbot-messages' element={<RoleBasedRoute allowedRoles={['ROLE_ADMIN']}><ChatbotMessagesList /></RoleBasedRoute>} />
          <Route path="/admin/logs" element={<RoleBasedRoute allowedRoles={['ROLE_ADMIN']}><LogsDashboard /></RoleBasedRoute>} />
          <Route path='/create-course' element={<RoleBasedRoute allowedRoles={['ROLE_INSTRUCTOR']}><CreateCourse /></RoleBasedRoute>} />
          <Route path='/account-settings-instructor' element={<RoleBasedRoute allowedRoles={['ROLE_INSTRUCTOR']}><AccoyntSettingsInstructor /></RoleBasedRoute>} />
          <Route path='/instructor-calendar' element={<RoleBasedRoute allowedRoles={['ROLE_INSTRUCTOR']}><InstructorCalendar /></RoleBasedRoute>} />
          <Route path='/msconnect-home/:id' element={<RoleBasedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_INSTRUCTOR']}><UserSpecificRoute><MsConnectHome /></UserSpecificRoute></RoleBasedRoute>} />
          <Route path='/msconnect-message/:id' element={<RoleBasedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_INSTRUCTOR']}><UserSpecificRoute><MsconnectMessage /></UserSpecificRoute></RoleBasedRoute>} />
          <Route path='/msconnect-forum/:id' element={<RoleBasedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_INSTRUCTOR']}><UserSpecificRoute><MsconnectForum /></UserSpecificRoute></RoleBasedRoute>} />
          <Route path='/forum-post/:id' element={<RoleBasedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_INSTRUCTOR']}><MsconnectForumPost /></RoleBasedRoute>} />
          <Route
            path='/instructor-iot-dashboard/:id'
            element={
              <RoleBasedRoute allowedRoles={['ROLE_INSTRUCTOR']}>
                <UserSpecificRoute><InstructorIotDashboard /></UserSpecificRoute>
              </RoleBasedRoute>
            }
          >
            <Route path="student-management" element={<RoleBasedRoute allowedRoles={['ROLE_INSTRUCTOR']}><StudentManagement /></RoleBasedRoute>} />
            <Route path="engagement-analytics" element={<RoleBasedRoute allowedRoles={['ROLE_INSTRUCTOR']}><EngagementAnalytics /></RoleBasedRoute>} />
            <Route path="feedback" element={<RoleBasedRoute allowedRoles={['ROLE_INSTRUCTOR']}><FeedbackAndSentiment /></RoleBasedRoute>} />
            <Route path="" element={<RoleBasedRoute allowedRoles={['ROLE_INSTRUCTOR']}><OverView /></RoleBasedRoute>} />
          </Route>
          <Route path='/msconnect-notifications/:id' element={<RoleBasedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_INSTRUCTOR']}><UserSpecificRoute><MsconnectNotifications /></UserSpecificRoute></RoleBasedRoute>} />
          <Route path="/msconnect-profile/:id" element={<RoleBasedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_INSTRUCTOR']}><UserProfilePage /></RoleBasedRoute>}>
            <Route index element={<UserProfileSection />} />
            <Route path="profile" element={<RoleBasedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_INSTRUCTOR']}><UserProfileSection /></RoleBasedRoute>} />
            <Route path="activity" element={<RoleBasedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_INSTRUCTOR']}><UserActivitySection /></RoleBasedRoute>} />
            <Route path="friends" element={<RoleBasedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_INSTRUCTOR']}><UserFriendsSection /></RoleBasedRoute>} />
            <Route path="forum" element={<RoleBasedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_INSTRUCTOR']}><UserForumSection /></RoleBasedRoute>} />
          </Route>
        </Routes>
        <ChatbotConditional />
      </Router>
    </div>
  )

  function ChatbotConditional() {
    const location = useLocation();
    const excludedPaths = [
      '/signup',
      '/login',
      '/forgot-password',
      '/reset-password'
    ];
    const shouldShowChatbot = !excludedPaths.includes(location.pathname);

    return shouldShowChatbot ? <ChatbotWidget /> : null;
  }
}

export default App