import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignupForm from './pages/auth/SignupForm'
import LoginForm from './pages/auth/LoginForm'
import WelcomePage from './pages/WelcomePage'
import ResetPassword from './pages/auth/ResetPassword'
import ForgotPassword from './pages/auth/ForgotPassword'

function App () {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/signup' element={<SignupForm />} />
          <Route path='/login' element={<LoginForm />} />
          <Route path='/' element={<WelcomePage />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App