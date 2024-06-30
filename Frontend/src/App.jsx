import { useState } from 'react'
import { useSelector } from "react-redux"
import { selectSelectedRole } from "./State/Reducers/roleSlice"
import './App.css'
import { BrowserRouter as Router,Routes,Route, Navigate } from 'react-router-dom'
import Login from './Components/Login/Login'
import Signup from './Components/Signup/Signup'
import Home from './Components/HomeScreen/Home'
// import Header from './Components/Header/Header'
import Hackathons from './Components/Hackathons/Hackathons'
import Organize from './Components/Organize/Organize'
import OrganizerLayout from './Layouts/OrganizerLayout'
import ParticipantLayout from './Layouts/ParticipantLayout'
import UserProfile from './Components/UserProfile/UserProfile'
import Update from './Components/UserProfile/UpdateProfile'
import Par_Hackathons from './Components/Participant/Par_Hackathons'
import Par_UserProfile from './Components/Participant/Par_UserProfile'
import ChatBot from './Components/AI Bot/ChatBot'
import Compiler from './Components/Compiler/Compiler'
import SubmissionPage from './Components/Hackathons/SubmissionPage'
import GradeProject from './Components/Hackathons/GradeProject'
import Par_Update from './Components/Participant/Par_UpdateProfile'
import EventDetails from './Components/Participant/EventDetails'


function App() {
  const rolehistory = localStorage.getItem("selectedRole")
  const selectedRole = useSelector(selectSelectedRole) || rolehistory

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to='/login' />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/organizer/profile/update-profile' element={<Update />} />
        <Route path='/participant/profile/update-profile' element={<Par_Update />} />
        {/* <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} /> */}
        {selectedRole && (
          <Route
            path={`/${selectedRole.toLowerCase()}/*`}
            element={
              selectedRole === "Organizer" ? (
                <OrganizerLayout>
                  <Routes>
                    <Route path='home' element={<Home />} />
                    <Route path='hackathons' element={<Hackathons />} />
                    <Route path='compiler' element={< Compiler/>} />
                    <Route path='ai-bot' element={<ChatBot />} /> 
                    <Route path='organize-hackathons' element={<Organize />} />
                    <Route path='profile' element={<UserProfile />} />
                    <Route path="submissions/:id" element={<SubmissionPage/>} />
                    <Route path="grade/:submissionId" element={<GradeProject />} />
                  </Routes>
                </OrganizerLayout>
              ) : selectedRole === "Participant" ? (
                <ParticipantLayout>
                  <Routes>
                  <Route path='home' element={<Home />} />
                    <Route path='hackathons' element={<Par_Hackathons />} />
                    <Route path='profile' element={<Par_UserProfile />} />
                    <Route path='ai-bot' element={<ChatBot />} /> 
                    <Route path="event-details/:eventId" element={<EventDetails />} />
                    <Route path='compiler/:eventId' element={< Compiler/>} />
                  </Routes>
                </ParticipantLayout>
              ) : null
            }
          />
        )}
      </Routes>
    </Router>
  )
}

export default App
