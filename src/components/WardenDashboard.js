import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, Lock } from 'lucide-react';

const WardenDashboard = () => {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/analytics/blocks');
        setAnalytics(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div>Loading Analytics...</div>;

  const highStressBlocks = analytics.filter(block => block.avg_stress >= 3.5);

  return (
    <div className="animate-fade-in">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Block Analytics</h1>
          <p style={{ color: 'var(--text-muted)' }}>Aggregated hostel well-being metrics.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(59, 130, 246, 0.1)', padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--primary)', color: 'var(--primary)' }}>
          <Lock size={16} />
          <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Privacy-Preserved Aggregation</span>
        </div>
      </div>

      {highStressBlocks.length > 0 && (
        <div className="glass-panel" style={{ border: '1px solid var(--danger)', background: 'rgba(239, 68, 68, 0.1)', marginBottom: '32px' }}>
          <h2 style={{ color: 'var(--danger)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={24} /> Actions Required
          </h2>
          <p style={{ marginBottom: '16px' }}>The following blocks require immediate counsellor visits due to aggregated high stress levels:</p>
          <div style={{ display: 'flex', gap: '16px' }}>
            {highStressBlocks.map(b => (
              <div key={b.block} style={{ background: 'var(--danger)', color: 'white', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold' }}>
                {b.block} (Avg Stress: {b.avg_stress})
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="glass-panel" style={{ height: '400px', marginBottom: '32px' }}>
        <h2 style={{ marginBottom: '24px' }}>Stress & Mood Distribution</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={analytics}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="block" stroke="var(--text-main)" />
            <YAxis yAxisId="left" orientation="left" stroke="var(--primary)" domain={[0, 5]} />
            <YAxis yAxisId="right" orientation="right" stroke="var(--accent)" domain={[0, 5]} />
            <Tooltip contentStyle={{ backgroundColor: 'var(--bg-dark)', borderColor: 'var(--border)' }} />
            <Legend />
            <Bar yAxisId="left" dataKey="avg_stress" name="Avg Stress Level" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="avg_mood" name="Avg Mood Level" fill="var(--accent)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid-cards">
        {analytics.map(b => (
          <div key={b.block} className="glass-panel">
            <h3>{b.block}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>Total Interactions: {b.total_logs}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Stress Index:</span>
              <span style={{ fontWeight: 'bold', color: b.avg_stress >= 3.5 ? 'var(--danger)' : 'var(--text-main)' }}>{b.avg_stress} / 5</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Mood Index:</span>
              <span style={{ fontWeight: 'bold' }}>{b.avg_mood} / 5</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WardenDashboard;
