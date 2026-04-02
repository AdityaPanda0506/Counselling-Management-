import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Heart, Activity } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState('');
  const [block, setBlock] = useState('Block A');
  const [role, setRole] = useState('student');
  const [moodScore, setMoodScore] = useState(3);
  const [stressScore, setStressScore] = useState(3);
  const [loading, setLoading] = useState(false);

  // Mapping scores to labels
  const getMoodLabel = (score) => {
    if (score < 2) return "Very Sad";
    if (score < 3) return "Sad";
    if (score < 4) return "Neutral";
    if (score < 5) return "Happy";
    return "Very Happy";
  };

  const getStressLabel = (score) => {
    if (score < 2) return "Very Low";
    if (score < 3) return "Low";
    if (score < 4) return "Manageable";
    if (score < 5) return "High";
    return "Severe Stress";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId) return alert('Enter ID/Name');
    
    setLoading(true);
    localStorage.setItem('student_id', studentId);
    localStorage.setItem('role', role);
    localStorage.setItem('block', block);

    if (role === 'student') {
      try {
        await axios.post('http://localhost:5000/api/pulse', {
          student_id: studentId,
          mood_score: parseInt(moodScore),
          stress_score: parseInt(stressScore),
          block: block
        });
        navigate('/student');
      } catch (err) {
        console.error(err);
        alert('Failed to log pulse, check API connection.');
        setLoading(false);
      }
    } else if (role === 'warden') {
      navigate('/warden');
    } else {
      navigate('/counsellor');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100%' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
        <h1 className="gradient-text" style={{ textAlign: 'center', marginBottom: '8px' }}>Welcome Back</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '32px' }}>Pulse Tracker System</p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>User ID / Roll No</label>
            <input 
              type="text" 
              value={studentId} 
              onChange={(e) => setStudentId(e.target.value)} 
              placeholder="e.g., 2023CS01"
              required 
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="student">Student</option>
              <option value="warden">Hostel Warden</option>
              <option value="counsellor">Counsellor</option>
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Hostel Block</label>
            <select value={block} onChange={(e) => setBlock(e.target.value)}>
              <option value="Block A">Block A</option>
              <option value="Block B">Block B</option>
              <option value="Block C">Block C</option>
              <option value="Block D">Block D</option>
            </select>
          </div>

          {role === 'student' && (
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
              <h3 style={{ marginBottom: '16px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={18} color="var(--primary)" /> 
                Quick Pulse Check (3 sec)
              </h3>
              
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span>Mood</span>
                  <span style={{ color: 'var(--accent)' }}>{getMoodLabel(moodScore)}</span>
                </div>
                <input 
                  type="range" 
                  min="1" max="5" 
                  value={moodScore} 
                  onChange={(e) => setMoodScore(e.target.value)} 
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span>Stress Level</span>
                  <span style={{ color: stressScore >= 4 ? 'var(--danger)' : 'var(--success)' }}>
                    {getStressLabel(stressScore)}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="1" max="5" 
                  value={stressScore} 
                  onChange={(e) => setStressScore(e.target.value)} 
                />
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Entering...' : 'Log In & Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
