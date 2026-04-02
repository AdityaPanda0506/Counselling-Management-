import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Landing from './components/Landing';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import WardenDashboard from './components/WardenDashboard';
import CounsellorDashboard from './components/CounsellorDashboard';
import ParentDashboard from './components/ParentDashboard';
import FriendDashboard from './components/FriendDashboard';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Public */}
          <Route path="/"                  element={<Landing />} />
          <Route path="/login/student"     element={<Login fixedRole="student" />} />
          <Route path="/login/warden"      element={<Login fixedRole="warden" />} />
          <Route path="/login/counsellor"  element={<Login fixedRole="counsellor" />} />

          {/* Parent — standalone, no sidebar */}
          <Route path="/parent" element={<ParentDashboard />} />

          {/* Friend — standalone, no sidebar */}
          <Route path="/friend" element={<FriendDashboard />} />

          {/* Protected with Sidebar */}
          <Route path="/*" element={
            <>
              <Sidebar />
              <div className="main-content">
                <Routes>
                  <Route path="/student"    element={<StudentDashboard />} />
                  <Route path="/warden"     element={<WardenDashboard />} />
                  <Route path="/counsellor" element={<CounsellorDashboard />} />
                </Routes>
              </div>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
