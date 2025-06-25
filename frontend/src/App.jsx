import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import LoginForm from './pages/LoginForm'
import RegisterUser from './pages/RegisterUser'
import MainDashboard from './pages/Dashboard'
import FeedbackForm from './pages/FeedbackForm'
import EditFeedback from './pages/EditFeedback'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm  />} />
        <Route path="/register" element={<RegisterUser />} />
        <Route path="/dashboard" element={<MainDashboard />} />
        <Route path="/create-feedback/:employeeId" element={<FeedbackForm />} />
        <Route path="/edit-feedback/:feedbackId" element={<EditFeedback />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
