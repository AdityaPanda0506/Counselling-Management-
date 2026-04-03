import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Brain, Calendar, ShieldAlert } from 'lucide-react';

const CounsellorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const aptRes = await axios.get('http://localhost:5000/api/counselling/appointments');
        const predRes = await axios.get('http://localhost:5000/api/ml/predict');
        setAppointments(aptRes.data);
        setPredictions(predRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading Counsellor Data...</div>;

  const sosAppointments = appointments.filter(a => a.is_sos);
  const regularAppointments = appointments.filter(a => !a.is_sos);

  return (
    <div className="animate-fade-in">
      <div className="dashboard-header">
        <h1>Counsellor Portal</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage appointments and upcoming ML-driven insights.</p>
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
