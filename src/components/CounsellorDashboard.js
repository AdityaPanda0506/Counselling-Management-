import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Brain, Calendar, ShieldAlert, User, CheckCircle } from 'lucide-react';
import { useUser } from '@clerk/react';

const CounsellorDashboard = () => {
  const { user } = useUser();
  const [appointments, setAppointments] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [profile, setProfile] = useState({
    name: user?.fullName || '',
    specialization: 'General Support'
  });
  const [updating, setUpdating] = useState(false);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const aptRes = await axios.get('http://localhost:5000/api/counselling/appointments');
        const predRes = await axios.get('http://localhost:5000/api/ml/predict');
        setAppointments(aptRes.data);
        setPredictions(predRes.data);
        
        // Fetch current profile
        const cRes = await axios.get('http://localhost:5000/api/counsellors');
        const myProfile = cRes.data.find(c => c.clerk_id === user?.id);
        if (myProfile) {
          setProfile({ name: myProfile.name, specialization: myProfile.specialization });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await axios.post('http://localhost:5000/api/counsellors/profile', {
        clerk_id: user?.id,
        name: profile.name,
        specialization: profile.specialization
      });
      setUpdated(true);
      setTimeout(() => setUpdated(false), 3000);
    } catch (err) {
      console.error('Counsellor Profile Update Error:', err.response || err);
      alert('Failed to update profile. Please see console for details.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div>Loading Counsellor Data...</div>;

  const sosAppointments = appointments.filter(a => a.is_sos);
  const regularAppointments = appointments.filter(a => !a.is_sos);

  return (
    <div className="animate-fade-in">
      <div className="dashboard-header">
        <h1>Counsellor Portal</h1>
        <p style={{ color: 'var(--text-muted)' }}>Logged in as: <strong>{profile.name || user?.username}</strong></p>
      </div>

      {/* Profile Section */}
      <div className="glass-panel" style={{ marginBottom: '32px', border: '1px solid var(--primary)' }}>
        <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)' }}>
          <User size={24} /> Complete Your Professional Profile
        </h2>
        <form onSubmit={handleUpdateProfile} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Public Name (Visible to Students)</label>
            <input 
              type="text" 
              value={profile.name} 
              onChange={e => setProfile({...profile, name: e.target.value})}
              placeholder="e.g. Dr. Jane Smith"
              required
              style={{ marginBottom: 0 }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Specialization</label>
            <input 
              type="text" 
              value={profile.specialization} 
              onChange={e => setProfile({...profile, specialization: e.target.value})}
              placeholder="e.g. Stress Management"
              required
              style={{ marginBottom: 0 }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button type="submit" className="btn btn-primary" disabled={updating}>
              {updating ? 'Saving...' : 'Update Public Profile'}
            </button>
            {updated && <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={16}/> Saved!</span>}
          </div>
        </form>
        <p style={{ marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Tip: Your profile will appear in the Student Portal for session booking.
        </p>
      </div>

      <div className="grid-cards">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ border: sosAppointments.length > 0 ? '1px solid var(--danger)' : '' }}>
            <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)' }}>
              <ShieldAlert size={24} /> Urgent SOS Requests
            </h2>
            {sosAppointments.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No urgent SOS requests at the moment.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {sosAppointments.map((apt, i) => (
                  <div key={i} style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '8px', borderLeft: '4px solid var(--danger)' }}>
                    <strong>Student ID:</strong> {apt.regno} <br />
                    <small style={{ color: 'var(--text-muted)' }}>Requested: {new Date(apt.created_at).toLocaleString()}</small>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-panel">
            <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={24} color="var(--primary)" /> Scheduled Sessions
            </h2>
            {regularAppointments.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No regular appointments scheduled.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {regularAppointments.map((apt, i) => (
                  <div key={i} style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '12px', borderRadius: '8px' }}>
                    <strong>Student ID:</strong> {apt.regno} <br />
                    <span>Date: {apt.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="glass-panel" style={{ border: '1px solid var(--accent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)' }}>
              <Brain size={24} /> ML Predictive Insights
            </h2>
            <span style={{ background: 'var(--accent)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>Beta API</span>
          </div>
          
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.9rem' }}>
            The machine learning model flags anonymized student hashes that display predictive patterns of declining mental health based on historical pulse logs.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {predictions.map((pred, i) => (
              <div key={i} style={{ background: 'var(--bg-dark)', padding: '16px', borderRadius: '8px', borderLeft: `4px solid ${pred.risk_level === 'High' ? 'var(--danger)' : 'var(--primary)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <strong style={{ fontFamily: 'monospace', fontSize: '0.8rem', wordBreak: 'break-all' }}>
                    {(pred.student_hash || pred.regno || '').substring(0, 16)}...
                  </strong>
                  <span style={{ color: pred.risk_level === 'High' ? 'var(--danger)' : 'var(--primary)', fontWeight: 'bold', fontSize: '0.9rem' }}>{pred.risk_level} Risk</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Pattern: {pred.reason}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CounsellorDashboard;
