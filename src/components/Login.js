import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Login = ({ fixedRole }) => {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState('');
  const [block, setBlock] = useState('Block A');
  const [loading, setLoading] = useState(false);

  // Capitalize role for display
  const roleDisplay = fixedRole.charAt(0).toUpperCase() + fixedRole.slice(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId) return alert('Enter ID/Name');
    
    setLoading(true);
    localStorage.setItem('student_id', studentId);
    localStorage.setItem('role', fixedRole);
    localStorage.setItem('block', block);

    if (fixedRole === 'student') {
      navigate('/student');
    } else if (fixedRole === 'warden') {
      navigate('/warden');
    } else {
      navigate('/counsellor');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100%' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px', position: 'relative' }}>
        <button 
          onClick={() => navigate('/')}
          style={{ position: 'absolute', top: '24px', left: '24px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <h1 className="gradient-text" style={{ textAlign: 'center', marginBottom: '8px', marginTop: '24px' }}>{roleDisplay} Login</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '32px' }}>Pulse Tracker System</p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>
              {fixedRole === 'student' ? 'Student ID / Roll No' : `${roleDisplay} ID`}
            </label>
            <input 
              type="text" 
              value={studentId} 
              onChange={(e) => setStudentId(e.target.value)} 
              placeholder={fixedRole === 'student' ? "e.g., 2023CS01" : `Enter ${roleDisplay} ID`}
              required 
            />
          </div>

          {(fixedRole === 'student' || fixedRole === 'warden') && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Hostel Block</label>
              <select value={block} onChange={(e) => setBlock(e.target.value)}>
                <option value="Block A">Block A</option>
                <option value="Block B">Block B</option>
                <option value="Block C">Block C</option>
                <option value="Block D">Block D</option>
              </select>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
