import './App.css'
import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import LandingPage from './Components/LandingPage'
import Signup from './Components/Signup'
import Login from './Components/Login'
import Logout from './Components/Logout'
import ProtectedRoute from './Components/ProtectedRoute'
import Unauthorized from './Components/Unauthorized'

// Voter Pages
import Dashboard from './Components/VoterPages/Dashboard'
import CandidateList from './Components/VoterPages/CandidateList'
import UpcomingPastElection from './Components/VoterPages/UpcomingPastElection'
import UpcomingElection from './Components/VoterPages/UpcomingElection'
import VotePage from './Components/VoterPages/VotePage'
import ResultsPage from './Components/VoterPages/ResultsPage'
import ClosedElectionsPage from './Components/VoterPages/ClosedElectionsPage'
import ProfilePage from './Components/VoterPages/ProfilePage'
import ChangePassword from './Components/VoterPages/ChangePassword'

// Admin Pages
import AdminDashboard from './Components/AdminPages/AdminDashboard'
import ManageElections from './Components/AdminPages/ManageElections'
import AddElection from './Components/AdminPages/AddElection'
import Voters from './Components/AdminPages/Voters'
import AdminResultsPage from './Components/AdminPages/AdminResultsPage'
import AddCandidate from './Components/AdminPages/AddCandidate'
import AdminCandidatesList from './Components/AdminPages/AdminCandidateList'
import AdminUpcomingPastElection from './Components/AdminPages/AdminUpcomingPastElection'
import AdminUpcomingElection from './Components/AdminPages/AdminUpcomingElection'
import ViewCandidatesList from './Components/AdminPages/ViewCandidatesList'
import AdminClosedElections from './Components/AdminPages/AdminClosedElections'



function App() {
  

  return (
    <>
    <Routes>
      {/* Landing Pages */}
      <Route path='/' element={<LandingPage />}  ></Route>
      <Route path='/login' element={<Login />}  ></Route>
      <Route path='/signup' element={<Signup />}></Route>
      <Route path="/logout" element={<Logout />}></Route>

      {/* Voter Pages */}
      <Route element={<ProtectedRoute allowedRoles={["voter"]} />}>
        <Route path='/voter/dashboard' element={<Dashboard />}></Route>
        <Route path='/voter/profile' element={<ProfilePage />}></Route>
        <Route path='/voter/profile/change-password' element={<ChangePassword />}></Route>
        <Route path='/voter/elections' element={<UpcomingPastElection />}></Route>
        <Route path='/voter/elections/upcoming' element={<UpcomingElection />}></Route>
        <Route path='/voter/elections/upcoming/list/:electionId' element={<CandidateList />}></Route>
        <Route path='/voter/elections/upcoming/vote/:electionId' element={<VotePage />}></Route>
        <Route path='/voter/elections/closed' element={<ClosedElectionsPage />}></Route>
        <Route path='/voter/:electionId/results' element={<ResultsPage />}></Route>
      </Route>

      {/* Admin Pages */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path='/admin/dashboard' element={<AdminDashboard />}></Route> 
        <Route path='/admin/elections' element={<AdminUpcomingPastElection />}></Route>
        <Route path='/admin/elections/upcoming' element={<AdminUpcomingElection />}></Route>
        <Route path='/admin/elections/closed' element={<AdminClosedElections />}></Route> 
        <Route path='/admin/elections/upcoming/list/:electionId' element={<ViewCandidatesList />}></Route> 
        {/* <Route path='/admin/manage-election' element={<ManageElections />}></Route>  */}
        <Route path='/admin/add-election' element={<AddElection />}></Route>
        <Route path='/admin/manage-election/edit/:id' element={<AddElection />}></Route> {/* Remaining to implement */}
        <Route path='/admin/voters' element={<Voters />}></Route>
        <Route path='/admin/:electionId/results' element={<AdminResultsPage />}></Route>
        <Route path='/admin/candidates/add' element={<AddCandidate />}></Route>
        <Route path='/admin/candidates/list' element={<AdminCandidatesList />}></Route> 
      </Route>

      {/* Unauthorized page */}
      <Route path="/unauthorized" element={<Unauthorized />} />
    </Routes>

    <Toaster />

    </>
  )
}

export default App;
