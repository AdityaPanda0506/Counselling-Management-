import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, Lock, Users, ChevronDown, ChevronUp } from 'lucide-react';

const WardenDashboard = () => {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

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

  const toggleBlockDetail = async (block) => {
    if (selectedBlock === block) {
      setSelectedBlock(null);
      setStudents([]);
      return;
    }

    setSelectedBlock(block);
    setStudentsLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/analytics/students/${block}`);
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setStudentsLoading(false);
    }
  };

  if (loading) return <div>Loading Analytics...</div>;

  const highStressBlocks = analytics.filter(block => block.avg_stress >= 3.5);

  const getMoodColor = (score) => {
    if (score >= 4) return 'var(--success)';
    if (score >= 3) return 'var(--primary)';
    return 'var(--danger)';
  };

  const getStressColor = (score) => {
    if (score >= 4) return 'var(--danger)';
    if (score >= 3) return '#f59e0b';
    return 'var(--success)';
  };

  return (
    <div className="animate-fade-in">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Block Analytics</h1>
          <p style={{ color: 'var(--text-muted)' }}>Aggregated hostel well-being metrics. Click a block to see individual details.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(59, 130, 246, 0.1)', padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--primary)', color: 'var(--primary)' }}>
          <Lock size={16} />
          <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Privacy-Preserved (SHA-256)</span>
        </div>
      </div>

      {highStressBlocks.length > 0 && (
        <div className="glass-panel" style={{ border: '1px solid var(--danger)', background: 'rgba(239, 68, 68, 0.1)', marginBottom: '32px' }}>
          <h2 style={{ color: 'var(--danger)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={24} /> Action Required
          </h2>
          <p style={{ marginBottom: '16px' }}>The following blocks have aggregated high-stress and require counsellor visits:</p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {highStressBlocks.map(b => (
              <div key={b.block} style={{ background: 'var(--danger)', color: 'white', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold' }}>
                {b.block} (Avg Stress: {b.avg_stress})
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="glass-panel" style={{ height: '380px', marginBottom: '32px' }}>
        <h2 style={{ marginBottom: '24px' }}>Block-Level Stress & Mood Distribution</h2>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={analytics} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="block" stroke="var(--text-main)" />
            <YAxis stroke="var(--text-muted)" domain={[0, 5]} />
            <Tooltip contentStyle={{ backgroundColor: 'var(--bg-dark)', borderColor: 'var(--border)', color: 'var(--text-main)' }} />
            <Legend />
            <Bar dataKey="avg_stress" name="Avg Stress Level" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="avg_mood" name="Avg Mood Level" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Block Cards with expandable individual details */}
      <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Users size={22} color="var(--primary)" /> Block Details
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {analytics.map(b => (
          <div key={b.block} style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Block Summary Row */}
            <div
              className="glass-panel"
              onClick={() => toggleBlockDetail(b.block)}
              style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: selectedBlock === b.block ? '0' : '0', borderBottomLeftRadius: selectedBlock === b.block ? '0' : '16px', borderBottomRightRadius: selectedBlock === b.block ? '0' : '16px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <h3 style={{ minWidth: '80px' }}>{b.block}</h3>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{b.total_logs} total entries</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Avg Mood: </span>
                  <span style={{ fontWeight: 'bold', color: getMoodColor(b.avg_mood) }}>{b.avg_mood}/5</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Avg Stress: </span>
                  <span style={{ fontWeight: 'bold', color: getStressColor(b.avg_stress) }}>{b.avg_stress}/5</span>
                </div>
                <div style={{ color: 'var(--text-muted)' }}>
                  {selectedBlock === b.block ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
            </div>

            {/* Expandable Individual Students Table */}
            {selectedBlock === b.block && (
              <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid var(--border)', borderTop: 'none', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', padding: '24px' }}>
                {studentsLoading ? (
                  <p style={{ color: 'var(--text-muted)' }}>Loading student details...</p>
                ) : students.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)' }}>No data in the last 7 days for this block.</p>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h4 style={{ color: 'var(--text-muted)' }}>Individual Student Averages (Last 7 Days)</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        <Lock size={12} />
                        IDs anonymized via SHA-256
                      </div>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                          <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--text-muted)', fontWeight: '500', fontSize: '0.875rem' }}>Anonymous ID</th>
                          <th style={{ textAlign: 'center', padding: '10px 16px', color: 'var(--text-muted)', fontWeight: '500', fontSize: '0.875rem' }}>Avg Mood</th>
                          <th style={{ textAlign: 'center', padding: '10px 16px', color: 'var(--text-muted)', fontWeight: '500', fontSize: '0.875rem' }}>Avg Stress</th>
                          <th style={{ textAlign: 'center', padding: '10px 16px', color: 'var(--text-muted)', fontWeight: '500', fontSize: '0.875rem' }}>Entries</th>
                          <th style={{ textAlign: 'center', padding: '10px 16px', color: 'var(--text-muted)', fontWeight: '500', fontSize: '0.875rem' }}>Status</th>
                          <th style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--text-muted)', fontWeight: '500', fontSize: '0.875rem' }}>Last Logged</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((s, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: s.is_alarming ? 'rgba(239, 68, 68, 0.05)' : 'transparent' }}>
                            <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                              {s.short_id}...
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 'bold', color: getMoodColor(s.avg_mood) }}>
                              {s.avg_mood}/5
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 'bold', color: getStressColor(s.avg_stress) }}>
                              {s.avg_stress}/5
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                              {s.logs_count}
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                              {s.is_alarming
                                ? <span style={{ background: 'rgba(239,68,68,0.2)', color: 'var(--danger)', padding: '3px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>⚠ Alarming</span>
                                : <span style={{ background: 'rgba(16,185,129,0.2)', color: 'var(--success)', padding: '3px 10px', borderRadius: '20px', fontSize: '0.8rem' }}>✓ Normal</span>
                              }
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                              {s.latest ? new Date(s.latest).toLocaleDateString() : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

export default WardenDashboard;
