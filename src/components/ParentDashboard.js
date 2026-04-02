import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, CheckCircle, Heart, Activity, Moon } from 'lucide-react';

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [regno, setRegno] = useState('');
  const [block, setBlock]             = useState('Block A');
  const [saving, setSaving]           = useState(false);
  const [saved, setSaved]             = useState(false);
  const [studentLocked, setStudentLocked] = useState(false);

  const [form, setForm] = useState({
    mood_obs:    3,
    stress_obs:  3,
    sleep_obs:   7,
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const moodLabel   = ['', 'Very Sad', 'Sad', 'Neutral', 'Happy', 'Very Happy'];
  const stressLabel = ['', 'Very Calm', 'Low', 'Manageable', 'Stressed', 'Very Stressed'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!regno) { alert('Please enter the student registration number.'); return; }
    setSaving(true);
    try {
      await axios.post('http://localhost:5000/api/wellbeing', {
        regno:             regno,
        block,
        submitted_by:      'parent',
        parent_mood_obs:   parseInt(form.mood_obs),
        parent_stress_obs: parseInt(form.stress_obs),
        parent_sleep_obs:  parseFloat(form.sleep_obs),
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
    setForm({ mood_obs: 3, stress_obs: 3, sleep_obs: 7 });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh', padding: '40px 20px', width: '100%' }}>
      <div style={{ width: '100%', maxWidth: '580px' }}>

        <button onClick={() => navigate('/')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}>
          <ArrowLeft size={16} /> Back to Home
        </button>

        <div style={{ marginBottom: '32px' }}>
          <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '8px' }}>Parent Observation Portal</h1>
          <p style={{ color: 'var(--text-muted)' }}>Share your observations about your child's mood, stress, and sleep. This helps counsellors get a complete picture.</p>
        </div>

        {/* Student ID */}
        <div className="glass-panel" style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '1rem', color: 'var(--text-muted)' }}>Step 1 — Your Child's Details</h3>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Student Registration No. (1–1000)</label>
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
                Submit for another student
              </button>
            </div>
          )}
        </div>

        {/* Observation Form */}
        <div className="glass-panel animate-fade-in" style={{ border: '1px solid rgba(244,114,182,0.4)' }}>
          <h3 style={{ marginBottom: '24px', fontSize: '1rem', color: '#f472b6' }}>Step 2 — Your Observations</h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

            {/* Mood */}
            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Heart size={15} color="var(--accent)" /> How is their mood?</span>
                <strong style={{ color: 'var(--accent)' }}>{moodLabel[form.mood_obs]}</strong>
              </label>
              <input type="range" min="1" max="5" value={form.mood_obs} onChange={e => set('mood_obs', e.target.value)} />
            </div>

            {/* Stress */}
            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={15} color="var(--primary)" /> How stressed do they seem?</span>
                <strong style={{ color: form.stress_obs >= 4 ? 'var(--danger)' : 'var(--primary)' }}>{stressLabel[form.stress_obs]}</strong>
              </label>
              <input type="range" min="1" max="5" value={form.stress_obs} onChange={e => set('stress_obs', e.target.value)} />
            </div>

            {/* Sleep */}
            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Moon size={15} color="#a78bfa" /> How is their sleep cycle?</span>
                <strong style={{ color: '#a78bfa' }}>{form.sleep_obs} hrs/night</strong>
              </label>
              <input type="range" min="1" max="12" step="0.5" value={form.sleep_obs} onChange={e => set('sleep_obs', e.target.value)} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Submitting...' : 'Submit Observations'}
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
          🔒 Your child's identity is anonymised via SHA-256. No names are exposed in analytics.
        </p>
      </div>
    </div>
  );
};

export default ParentDashboard;
