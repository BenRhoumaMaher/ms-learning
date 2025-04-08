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
function App () {
  return (
    <div className='App'>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/signup' element={<SignupContainer />} />
          <Route path='/login' element={<LoginContainer  />} />
          <Route path='/' element={<Home />} />
          <Route path='/forgot-password' element={<ForgotPasswordContainer />} />
          <Route path='/reset-password' element={<ResetPasswordContainer />} />
          <Route path='/student-dashboard' element={<StudentDashboard />} />
          <Route path='/student-notifications' element={<StudentNotification />} />
          <Route path='/student-payment' element={<StudentPayment />} />
          <Route path='/student-calendar' element={<StudentCalendar />} />
          <Route path='/registered-courses/:id' element={<RegisteredCourses />} />
          <Route path='/quiz' element={<Quiz />} />
          <Route path='/instructor-public/:id' element={<InstructorPublic />} />
          <Route path='/instructor-dashboard' element={<InsctructorDashboard />} />
          <Route path='/course-catalog' element={<CourseCatalog />} />
          <Route path='/account-settings' element={<AccountSettings />} />
          <Route path='/become-instructor' element={<BecomeInstructor />} />
          <Route path='/lesson-player' element={<LessonPlayer />} />
          <Route path='/live-course' element={<LiveCourse />} />
          <Route path='/admin' element={<Dashboard />} />
          <Route path='/admin/users' element={<Users />} />
          <Route path='/admin/users-list' element={<UsersList />} />
          <Route path='/admin/instructor-demands' element={<InstructorDemands />} />
          <Route path='/create-course' element={<CreateCourse />} />
          <Route path='/account-settings-instructor' element={<AccoyntSettingsInstructor />} />
          <Route path='/instructor-calendar' element={<InstructorCalendar />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App