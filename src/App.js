import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Show, RedirectToSignIn } from '@clerk/react';
import Sidebar from './components/Sidebar';
import Landing from './components/Landing';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import WardenDashboard from './components/WardenDashboard';
import CounsellorDashboard from './components/CounsellorDashboard';
import ParentDashboard from './components/ParentDashboard';
import FriendDashboard from './components/FriendDashboard';
import StudentSignUp from './components/StudentSignUp';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          
          {/* Public Warden Portal & Signup */}
          <Route path="/warden"           element={<WardenDashboard />} />
          <Route path="/warden/signup/*" element={<StudentSignUp />} />

          {/* Clerk Login Routes */}
          <Route path="/login/student/*"     element={<Login fixedRole="student" redirect="/student" />} />
          <Route path="/login/warden/*"      element={<Login fixedRole="warden" redirect="/warden" />} />
          <Route path="/login/counsellor/*"  element={<Login fixedRole="counsellor" redirect="/counsellor" />} />
          <Route path="/login/parent/*"      element={<Login fixedRole="parent" redirect="/parent" />} />
          <Route path="/login/friend/*"      element={<Login fixedRole="friend" redirect="/friend" />} />

          {/* Authenticated Routes with Sidebar */}
          <Route path="/*" element={
            <>
              <Show when="signed-in">
                <Sidebar />
                <div className="main-content">
                  <Routes>
                    <Route path="/student"    element={<StudentDashboard />} />
                    <Route path="/counsellor" element={<CounsellorDashboard />} />
                    <Route path="/parent"     element={<ParentDashboard />} />
                    <Route path="/friend"     element={<FriendDashboard />} />
                    <Route path="*"           element={<Navigate to="/" replace />} />
                  </Routes>
                </div>
              </Show>
              <Show when="signed-out">
                <Routes>
                   <Route path="/student"    element={<RedirectToSignIn />} />
                   <Route path="/counsellor" element={<RedirectToSignIn />} />
                   <Route path="/parent"     element={<RedirectToSignIn />} />
                   <Route path="/friend"     element={<RedirectToSignIn />} />
                </Routes>
              </Show>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
