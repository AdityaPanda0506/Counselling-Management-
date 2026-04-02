import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { User, Activity, ShieldAlert, LogOut } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('student_id') || 'User';
  const role = localStorage.getItem('role') || 'student';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="sidebar">
      <h2 className="gradient-text" style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>
        Pulse Tracker
      </h2>

      <div style={{ flex: 1 }}>
        {role === 'student' && (
          <NavLink to="/student" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <User size={20} />
            <span>My Pulse</span>
          </NavLink>
        )}

        {(role === 'warden' || role === 'counsellor') && (
          <NavLink to="/warden" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Activity size={20} />
            <span>Block Analytics</span>
          </NavLink>
        )}

        {role === 'counsellor' && (
          <NavLink to="/counsellor" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <ShieldAlert size={20} />
            <span>Counsellor Insights</span>
          </NavLink>
        )}
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>Logged in as: {userName}</p>
        <button onClick={handleLogout} className="btn" style={{ width: '100%', justifyContent: 'flex-start', background: 'transparent', color: 'var(--danger)' }}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
