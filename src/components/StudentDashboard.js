import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { ShieldAlert, Calendar, CheckCircle, Activity, Heart, Moon, Zap } from 'lucide-react';
import { useUser } from '@clerk/react';

const row = (label, val, unit = '', color = 'var(--text-main)') =>
  val != null ? (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{label}</span>
      <span style={{ fontWeight: '600', color }}>{val}{unit}</span>
    </div>
  ) : null;

const StudentDashboard = () => {
  const { user } = useUser();
  const regno = user?.username?.toLowerCase();
  const block = user?.publicMetadata?.block || 'Block A';

  const [summary, setSummary]         = useState(null);
  const [loading, setLoading]         = useState(true);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingStatus, setBookingStatus] = useState('');
  const [logStatus, setLogStatus]     = useState('');
  const [saving, setSaving]           = useState(false);

  const [form, setForm] = useState({
    mood_score:   3,
    stress_score: 3,
    pulse_bpm:    72,
    sleep_hours:  7,
    social_life:  3,
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const moodLabel   = ['', 'Very Sad', 'Sad', 'Neutral', 'Happy', 'Very Happy'];
  const stressLabel = ['', 'Very Low', 'Low', 'Manageable', 'High', 'Severe'];
  const socialLabel = ['', 'Isolated', 'Withdrawn', 'Normal', 'Socially Active', 'Very Social'];

  const fetchSummary = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/wellbeing/summary/${regno}`);
      setSummary(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [regno]);

  useEffect(() => { fetchSummary(); }, [fetchSummary]);

  const handleLogWellbeing = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post('http://localhost:5000/api/wellbeing', {
        regno,
        block,
        submitted_by: 'student',
        mood_score:   parseInt(form.mood_score),
        stress_score: parseInt(form.stress_score),
        pulse_bpm:    parseInt(form.pulse_bpm),
        sleep_hours:  parseFloat(form.sleep_hours),
        social_life:  parseInt(form.social_life),
      });
      setLogStatus('Entry Saved!');
      setTimeout(() => setLogStatus(''), 3000);
      fetchSummary();
    } catch { alert('Failed to save entry.'); }
    finally { setSaving(false); }
  };

  const handleBook = async (isSos = false) => {
    if (!isSos && !bookingDate) { alert('Please select a date.'); return; }
    try {
      await axios.post('http://localhost:5000/api/counselling/book', {
        regno,
        date: isSos ? new Date().toISOString().split('T')[0] : bookingDate,
        is_sos: isSos
      });
      setBookingStatus(isSos ? 'SOS Alert Sent! Counsellor will contact you shortly.' : 'Session Booked!');
      setTimeout(() => setBookingStatus(''), 5000);
    } catch { alert('Failed to book session.'); }
  };

  if (loading) return <div style={{ padding: '40px', color: 'var(--text-muted)' }}>Loading...</div>;

  const s  = summary?.student;
  const p  = summary?.parent;
  const fr = summary?.friend;

  return (
    <div className="animate-fade-in">
      <div className="dashboard-header">
        <h1>Welcome, Reg. No. {regno}</h1>
        <p style={{ color: 'var(--text-muted)' }}>Your 7-day well-being snapshot — tracked by you, your parents, and friends.</p>
      </div>

      {/* SOS Banner */}
      {summary?.is_alarming && (
        <div className="glass-panel" style={{ border: '1px solid var(--danger)', background: 'rgba(239,68,68,0.1)', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <ShieldAlert color="var(--danger)" size={48} />
            <div>
              <h2 style={{ color: 'var(--danger)', marginBottom: '8px' }}>High Stress Detected</h2>
              <p>Your recent tracking shows elevated levels. We strongly recommend speaking to a counsellor.</p>
              <button onClick={() => handleBook(true)} className="btn btn-danger" style={{ marginTop: '16px' }}>
                Trigger SOS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Daily Check-in ─── */}
      <div className="glass-panel" style={{ marginBottom: '32px', border: '1px solid var(--accent)' }}>
        <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent)' }}>
          <Activity size={22} /> Daily Check-in
        </h2>

        <form onSubmit={handleLogWellbeing}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '28px' }}>

            {/* Mood */}
            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Heart size={15} color="var(--accent)" /> Mood</span>
                <strong style={{ color: 'var(--accent)' }}>{moodLabel[form.mood_score]}</strong>
              </label>
              <input type="range" min="1" max="5" value={form.mood_score} onChange={e => set('mood_score', e.target.value)} />
            </div>

            {/* Stress */}
            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={15} color="var(--primary)" /> Stress Level</span>
                <strong style={{ color: form.stress_score >= 4 ? 'var(--danger)' : 'var(--primary)' }}>{stressLabel[form.stress_score]}</strong>
              </label>
              <input type="range" min="1" max="5" value={form.stress_score} onChange={e => set('stress_score', e.target.value)} />
            </div>

            {/* Pulse BPM */}
            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Zap size={15} color="#f472b6" /> Pulse Rate</span>
                <strong style={{ color: form.pulse_bpm > 100 ? 'var(--danger)' : '#f472b6' }}>{form.pulse_bpm} BPM</strong>
              </label>
              <input
                type="number"
                min="40" max="200"
                value={form.pulse_bpm}
                onChange={e => set('pulse_bpm', e.target.value)}
                placeholder="e.g. 72"
                style={{ marginBottom: 0 }}
              />
            </div>

            {/* Sleep */}
            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Moon size={15} color="#a78bfa" /> Sleep Hours</span>
                <strong style={{ color: '#a78bfa' }}>{form.sleep_hours} hrs</strong>
              </label>
              <input type="range" min="1" max="12" step="0.5" value={form.sleep_hours} onChange={e => set('sleep_hours', e.target.value)} />
            </div>

            {/* Social Life */}
            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{fontSize:'15px'}}>👥</span> Social Life</span>
                <strong style={{ color: '#34d399' }}>{socialLabel[form.social_life]}</strong>
              </label>
              <input type="range" min="1" max="5" value={form.social_life} onChange={e => set('social_life', e.target.value)} />
            </div>

          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '28px' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Entry'}
            </button>
            {logStatus && (
              <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={16} /> {logStatus}
              </span>
            )}
          </div>
        </form>
      </div>

      {/* ─── 7-Day Summary ─── */}
      {summary?.has_data && (
        <>
          <h2 style={{ marginBottom: '16px' }}>Your 7-Day Averages</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>

            <div className="glass-panel">
              <h3 style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '0.9rem' }}>📊 Self-Reported</h3>
              {row('Mood', s?.avg_mood, '/5', 'var(--accent)')}
              {row('Stress', s?.avg_stress, '/5', s?.avg_stress >= 4 ? 'var(--danger)' : 'var(--primary)')}
              {row('Pulse Rate', s?.avg_pulse, ' BPM', s?.avg_pulse > 100 ? 'var(--danger)' : '#f472b6')}
              {row('Sleep', s?.avg_sleep, ' hrs', '#a78bfa')}
              {row('Social Life', s?.avg_social, '/5', '#34d399')}
              {!s?.count && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No entries yet.</p>}
            </div>

            <div className="glass-panel" style={{ border: p?.count ? '1px solid rgba(244,114,182,0.35)' : '' }}>
              <h3 style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '0.9rem' }}>👨‍👩‍👦 Parent Observations</h3>
              {p?.count ? (
                <>
                  {row('Mood', p?.avg_mood_obs, '/5', 'var(--accent)')}
                  {row('Stress', p?.avg_stress_obs, '/5', p?.avg_stress_obs >= 4 ? 'var(--danger)' : 'var(--primary)')}
                  {row('Sleep Cycle', p?.avg_sleep_obs, ' hrs', '#a78bfa')}
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>{p.count} report(s)</p>
                </>
              ) : <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No parent data yet. Ask your parent to use the <strong>Parent Portal</strong>.</p>}
            </div>

            <div className="glass-panel" style={{ border: fr?.count ? '1px solid rgba(52,211,153,0.35)' : '' }}>
              <h3 style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '0.9rem' }}>👥 Friend Observations</h3>
              {fr?.count ? (
                <>
                  {row('Mood', fr?.avg_mood_obs, '/5', 'var(--accent)')}
                  {row('Stress', fr?.avg_stress_obs, '/5', fr?.avg_stress_obs >= 4 ? 'var(--danger)' : 'var(--primary)')}
                  {row('Social Life', fr?.avg_social_obs, '/5', '#34d399')}
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>{fr.count} report(s)</p>
                </>
              ) : <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No friend data yet. Friends can use the <strong>Friend Portal</strong>.</p>}
            </div>

          </div>
        </>
      )}

      {/* ─── Book Session ─── */}
      <div className="glass-panel">
        <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={24} color="var(--primary)" /> Book a Counselling Session
        </h2>
        {bookingStatus && (
          <div style={{ padding: '14px', background: 'rgba(16,185,129,0.15)', border: '1px solid var(--success)', borderRadius: '8px', marginBottom: '20px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={18} /> {bookingStatus}
          </div>
        )}
        <div style={{ display: 'flex', gap: '16px', maxWidth: '420px' }}>
          <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} style={{ marginBottom: 0 }} />
          <button className="btn btn-primary" onClick={() => handleBook(false)}>Book</button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
