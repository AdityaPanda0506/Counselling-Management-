import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Login = ({ fixedRole }) => {
  const navigate = useNavigate();
  const [regno, setRegno]   = useState('');
  const [block, setBlock]   = useState('Block A');
  const [loading, setLoading] = useState(false);

  const roleDisplay = fixedRole.charAt(0).toUpperCase() + fixedRole.slice(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!regno) return alert('Please enter your ID');

    if (fixedRole === 'student') {
      const num = parseInt(regno);
      if (isNaN(num) || num < 1 || num > 1000) {
        return alert('Student Registration No. must be a number between 1 and 1000');
      }
    }

    setLoading(true);
    localStorage.setItem('regno',      regno);
    localStorage.setItem('student_id', regno);   // backward compat
    localStorage.setItem('role',       fixedRole);
    localStorage.setItem('block',      block);

    if (fixedRole === 'student')    navigate('/student');
    else if (fixedRole === 'warden') navigate('/warden');
    else                             navigate('/counsellor');
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
              {fixedRole === 'student' ? 'Registration No. (1–1000)' : `${roleDisplay} ID`}
            </label>
            <input
              type={fixedRole === 'student' ? 'number' : 'text'}
              min={fixedRole === 'student' ? 1 : undefined}
              max={fixedRole === 'student' ? 1000 : undefined}
              value={regno}
              onChange={e => setRegno(e.target.value)}
              placeholder={fixedRole === 'student' ? 'e.g., 42' : `Enter ${roleDisplay} ID`}
              required
            />
          </div>

          {(fixedRole === 'student' || fixedRole === 'warden') && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Hostel Block</label>
              <select value={block} onChange={e => setBlock(e.target.value)}>
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

        {fixedRole === 'student' && (
          <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '16px' }}>
            🔒 Your regno is hashed before storage — no names are saved.
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
