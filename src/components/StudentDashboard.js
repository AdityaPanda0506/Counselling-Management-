import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShieldAlert, Calendar, CheckCircle } from 'lucide-react';

const StudentDashboard = () => {
  const studentId = localStorage.getItem('student_id');
  const [pulseData, setPulseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingStatus, setBookingStatus] = useState('');

  useEffect(() => {
    const fetchAverages = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/pulse/average/${studentId}`);
        setPulseData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAverages();
  }, [studentId]);

  const handleBook = async (isSos = false) => {
    if (!isSos && !bookingDate) {
      alert("Please select a date for regular booking.");
      return;
    }
    
    try {
      await axios.post('http://localhost:5000/api/counselling/book', {
        student_id: studentId,
        date: isSos ? new Date().toISOString().split('T')[0] : bookingDate,
        is_sos: isSos
      });
      setBookingStatus(isSos ? "SOS Alert Sent! Counsellor will contact you immediately." : "Session Booked Successfully!");
      setTimeout(() => setBookingStatus(''), 5000);
    } catch (err) {
      alert("Failed to book session.");
    }
  };

  if (loading) return <div>Loading your pulse...</div>;

  return (
    <div className="animate-fade-in">
      <div className="dashboard-header">
        <h1>Welcome, {studentId}</h1>
        <p style={{ color: 'var(--text-muted)' }}>Here is your well-being summary based on the last 7 days.</p>
      </div>

      {pulseData && pulseData.is_alarming && (
        <div className="glass-panel" style={{ border: '1px solid var(--danger)', background: 'rgba(239, 68, 68, 0.1)', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <ShieldAlert color="var(--danger)" size={48} />
            <div>
              <h2 style={{ color: 'var(--danger)', marginBottom: '8px' }}>High Stress Detected</h2>
              <p>Your recent pulse tracking indicates elevated stress levels. We highly recommend speaking to a counsellor.</p>
              <button 
                onClick={() => handleBook(true)}
                className="btn btn-danger" 
                style={{ marginTop: '16px' }}
              >
                Trigger SOS Intervention
              </button>
            </div>
          </div>
        </div>
      )}

      {bookingStatus && (
        <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid var(--success)', borderRadius: '8px', marginBottom: '24px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={20} />
          {bookingStatus}
        </div>
      )}

      <div className="grid-cards">
        <div className="glass-panel">
          <h3 style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>7-Day Average Mood</h3>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--accent)' }}>
            {pulseData?.avg_mood || "N/A"}<span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>/5</span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '8px' }}>Based on {pulseData?.logs_count} recent logs</p>
        </div>

        <div className="glass-panel">
          <h3 style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>7-Day Average Stress</h3>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: pulseData?.avg_stress >= 4 ? 'var(--danger)' : 'var(--primary)' }}>
            {pulseData?.avg_stress || "N/A"}<span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>/5</span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '8px' }}>{pulseData?.avg_stress >= 4 ? 'Higher than normal' : 'Manageable range'}</p>
        </div>
      </div>

      <div className="glass-panel">
        <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={24} color="var(--primary)" />
          Book a Counselling Session
        </h2>
        <div style={{ display: 'flex', gap: '16px', maxWidth: '400px' }}>
          <input 
            type="date" 
            value={bookingDate} 
            onChange={(e) => setBookingDate(e.target.value)}
            style={{ marginBottom: 0 }}
          />
          <button className="btn btn-primary" onClick={() => handleBook(false)}>Book</button>
        </div>
      </div>

    </div>
  );
};

export default StudentDashboard;
