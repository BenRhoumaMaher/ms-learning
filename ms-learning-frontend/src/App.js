import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignupContainer from './components/containers/auth/SignupContainer'
import LoginContainer from './components/containers/auth/LoginContainer'
import ResetPasswordContainer from './components/containers/auth/ResetPasswordContainer' 
import ForgotPasswordContainer from './components/containers/auth/ForgotPasswordContainer'
import Navbar from "./layouts/Navbar-student";
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
import AccoyntSettings from './pages/accountsettingsstudent/AccountSettings'
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
          <Route path='/registered-courses' element={<RegisteredCourses />} />
          <Route path='/quiz' element={<Quiz />} />
          <Route path='/instructor-public' element={<InstructorPublic />} />
          <Route path='/instructor-dashboard' element={<InsctructorDashboard />} />
          <Route path='/course-catalog' element={<CourseCatalog />} />
          <Route path='/account-settings' element={<AccoyntSettings />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App