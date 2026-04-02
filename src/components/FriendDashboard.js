import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, CheckCircle, Heart, Activity, Users } from 'lucide-react';

const FriendDashboard = () => {
  const navigate = useNavigate();
  const [regno, setRegno] = useState('');
  const [block, setBlock]             = useState('Block A');
  const [saving, setSaving]           = useState(false);
  const [saved, setSaved]             = useState(false);
  const [studentLocked, setStudentLocked] = useState(false);

  const [form, setForm] = useState({
    mood_obs:   3,
    stress_obs: 3,
    social_obs: 3,
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const moodLabel   = ['', 'Very Sad', 'Sad', 'Okay', 'Happy', 'Very Happy'];
  const stressLabel = ['', 'Very Calm', 'Low', 'Manageable', 'Stressed', 'Very Stressed'];
  const socialLabel = ['', 'Isolated', 'Withdrawn', 'Normal', 'Socially Active', 'Very Social'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!regno) { alert("Please enter your friend's registration number."); return; }
    setSaving(true);
    try {
      await axios.post('http://localhost:5000/api/wellbeing', {
        regno:             regno,
        block,
        submitted_by:      'friend',
        friend_mood_obs:   parseInt(form.mood_obs),
        friend_stress_obs: parseInt(form.stress_obs),
        friend_social_obs: parseInt(form.social_obs),
      });
      setSaved(true);
      setStudentLocked(true);
      setTimeout(() => setSaved(false), 5000);
    } catch {
      alert('Failed to submit. Make sure the backend is running.');
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    setStudentLocked(false);
    setRegno('');
    setForm({ mood_obs: 3, stress_obs: 3, social_obs: 3 });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh', padding: '40px 20px', width: '100%' }}>
      <div style={{ width: '100%', maxWidth: '580px' }}>

        <button onClick={() => navigate('/')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}>
          <ArrowLeft size={16} /> Back to Home
        </button>

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>
            <span style={{ background: 'linear-gradient(to right, #34d399, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Friend Observation Portal
            </span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>How is your friend doing? Your honest observations can make a real difference in catching early warning signs.</p>
        </div>

        {/* Student ID */}
        <div className="glass-panel" style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '1rem', color: 'var(--text-muted)' }}>Step 1 — Which friend are you reporting for?</h3>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Friend's Registration No. (1–1000)</label>
            <input type="number" min="1" max="1000" value={regno} onChange={e => setRegno(e.target.value)}
              placeholder="e.g., 42" disabled={studentLocked} style={{ marginBottom: 0, opacity: studentLocked ? 0.6 : 1 }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>Hostel Block</label>
            <select value={block} onChange={e => setBlock(e.target.value)} disabled={studentLocked}>
              <option value="Block A">Block A</option>
              <option value="Block B">Block B</option>
              <option value="Block C">Block C</option>
              <option value="Block D">Block D</option>
            </select>
          </div>

          {studentLocked && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
              <span style={{ color: 'var(--success)', fontSize: '0.85rem' }}>✓ Submitted for Reg. No. {regno}</span>
              <button onClick={reset} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                Submit for another friend
              </button>
            </div>
          )}
        </div>

        {/* Observation Form */}
        <div className="glass-panel animate-fade-in" style={{ border: '1px solid rgba(52, 211, 153, 0.4)' }}>
          <h3 style={{ marginBottom: '24px', fontSize: '1rem', color: '#34d399' }}>Step 2 — Your Honest Observations</h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

            {/* Mood */}
            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Heart size={15} color="var(--accent)" /> How is their mood lately?</span>
                <strong style={{ color: 'var(--accent)' }}>{moodLabel[form.mood_obs]}</strong>
              </label>
              <input type="range" min="1" max="5" value={form.mood_obs} onChange={e => set('mood_obs', e.target.value)} />
            </div>

            {/* Stress */}
            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={15} color="var(--primary)" /> How stressed do they appear?</span>
                <strong style={{ color: form.stress_obs >= 4 ? 'var(--danger)' : 'var(--primary)' }}>{stressLabel[form.stress_obs]}</strong>
              </label>
              <input type="range" min="1" max="5" value={form.stress_obs} onChange={e => set('stress_obs', e.target.value)} />
            </div>

            {/* Social Life */}
            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={15} color="#34d399" /> How is their social life?</span>
                <strong style={{ color: '#34d399' }}>{socialLabel[form.social_obs]}</strong>
              </label>
              <input type="range" min="1" max="5" value={form.social_obs} onChange={e => set('social_obs', e.target.value)} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button type="submit" className="btn" disabled={saving}
                style={{ background: 'linear-gradient(to right, #34d399, #3b82f6)', color: 'white', boxShadow: '0 0 15px rgba(52,211,153,0.3)' }}>
                {saving ? 'Submitting...' : 'Submit as Friend'}
              </button>
              {saved && (
                <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={16} /> Submitted!
                </span>
              )}
            </div>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '24px' }}>
          🔒 Your friend's identity is anonymised via SHA-256. Your submission is confidential.
        </p>
      </div>
    </div>
  );
};

export default FriendDashboard;
