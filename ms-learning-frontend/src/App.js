import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignupContainer from './components/containers/auth/SignupContainer'
import LoginContainer from './components/containers/auth/LoginContainer'
import WelcomePage from './pages/WelcomePage'
import ResetPasswordContainer from './components/containers/auth/ResetPasswordContainer' 
import ForgotPasswordContainer from './components/containers/auth/ForgotPasswordContainer'
import Navbar from "./layouts/Navbar";
import Home from './pages/home/Home'
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
        </Routes>
      </Router>
    </div>
  )
}

export default App