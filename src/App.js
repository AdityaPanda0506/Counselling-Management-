import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import WardenDashboard from './components/WardenDashboard';
import CounsellorDashboard from './components/CounsellorDashboard';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/*" element={
            <>
              <Sidebar />
              <div className="main-content">
                <Routes>
                  <Route path="/student" element={<StudentDashboard />} />
                  <Route path="/warden" element={<WardenDashboard />} />
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
