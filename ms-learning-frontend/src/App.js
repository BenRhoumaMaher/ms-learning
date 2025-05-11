import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignupContainer from './components/containers/auth/SignupContainer'
import LoginContainer from './components/containers/auth/LoginContainer'
import ResetPasswordContainer from './components/containers/auth/ResetPasswordContainer'
import ForgotPasswordContainer from './components/containers/auth/ForgotPasswordContainer'
import Navbar from "./layouts/Navbar";
import Home from './pages/home/Home'
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
import StudentManagement from './pages/instructor-iot-dashboard/sections/StudentManagement'
import EngagementAnalytics from './pages/instructor-iot-dashboard/sections/EngagementAnalytics'
import OverView from './pages/instructor-iot-dashboard/sections/OverView'
import FeedbackAndSentiment from './pages/instructor-iot-dashboard/sections/FeedbackAndSentiment'

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
          <Route path='/student-dashboard' element={<StudentDashboard />} />
          <Route path='/student-notifications' element={<StudentNotification />} />
          <Route path='/student-payment' element={<StudentPayment />} />
          <Route path='/student-calendar' element={<StudentCalendar />} />
          <Route path='/registered-courses/:id' element={<RegisteredCourses />} />
          <Route path="/quiz/:id" element={<Quiz />} />
          <Route path="/quiz/:id/question/:questionId" element={<QuizQuestion />} />
          <Route path='/instructor-public/:id' element={<InstructorPublic />} />
          <Route path='/instructor-dashboard' element={<InsctructorDashboard />} />
          <Route path='/course-catalog' element={<CourseCatalog />} />
          <Route path='/account-settings' element={<AccountSettings />} />
          <Route path='/become-instructor' element={<BecomeInstructor />} />
          <Route path='/lesson-player/:id' element={<LessonPlayer />} />
          <Route path='/live-course' element={<LiveCourse />} />
          <Route path='/admin' element={<Dashboard />} />
          <Route path='/admin/users' element={<Users />} />
          <Route path='/admin/users-list' element={<UsersList />} />
          <Route path='/admin/instructor-demands' element={<InstructorDemands />} />
          <Route path='/admin/chatbot-messages' element={<ChatbotMessagesList />} />
          <Route path='/create-course' element={<CreateCourse />} />
          <Route path='/account-settings-instructor' element={<AccoyntSettingsInstructor />} />
          <Route path='/instructor-calendar' element={<InstructorCalendar />} />
          <Route path='/msconnect-home/:id' element={<MsConnectHome />} />
          <Route path='/msconnect-message/:id' element={<MsconnectMessage />} />
          <Route path='/msconnect-forum/:id' element={<MsconnectForum />} />
          <Route path='/forum-post/:id' element={<MsconnectForumPost />} />
          <Route
            path='/instructor-iot-dashboard/:id'
            element={
              <InstructorRouteGuard>
                <InstructorIotDashboard />
              </InstructorRouteGuard>
            }
          >
            <Route path="student-management" element={<StudentManagement />} />
            <Route path="engagement-analytics" element={<EngagementAnalytics />} />
            <Route path="feedback" element={<FeedbackAndSentiment />} />
            <Route path="" element={<OverView />} />
          </Route>
          <Route path='/msconnect-notifications/:id' element={<MsconnectNotifications />} />
          <Route path="/msconnect-profile/:id" element={<UserProfilePage />}>
            <Route index element={<UserProfileSection />} />
            <Route path="profile" element={<UserProfileSection />} />
            <Route path="activity" element={<UserActivitySection />} />
            <Route path="friends" element={<UserFriendsSection />} />
            <Route path="forum" element={<UserForumSection />} />
          </Route>
        </Routes>
        <ChatbotWidget />
      </Router>
    </div>
  )
}

export default App