import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShieldAlert, Brain, HeartHandshake, UsersRound } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const portals = [
    {
      icon: <User size={48} />,
      iconBg: 'rgba(59, 130, 246, 0.2)',
      iconColor: 'var(--primary)',
      title: 'Student Portal',
      desc: 'Log your daily mood, sleep, meals, attendance & stress. Track your 7-day well-being trends.',
      route: '/login/student',
    },
    {
      icon: <HeartHandshake size={48} />,
      iconBg: 'rgba(244, 114, 182, 0.2)',
      iconColor: '#f472b6',
      title: 'Parent Portal',
      desc: "Submit your observations about your child's mood, sleep, and social life directly.",
      route: '/login/parent',
    },
    {
      icon: <UsersRound size={48} />,
      iconBg: 'rgba(52, 211, 153, 0.2)',
      iconColor: '#34d399',
      title: 'Friend Portal',
      desc: "Notice something about your friend's mood or behaviour? Your honest observation could help them.",
      route: '/login/friend',
    },
    {
      icon: <ShieldAlert size={48} />,
      iconBg: 'rgba(16, 185, 129, 0.2)',
      iconColor: 'var(--success)',
      title: 'Warden Portal',
      desc: 'View aggregated block-level stress and mood analytics with individual anonymised records.',
      route: '/warden',
    },
    {
      icon: <Brain size={48} />,
      iconBg: 'rgba(139, 92, 246, 0.2)',
      iconColor: 'var(--accent)',
      title: 'Counsellor Portal',
      desc: 'Manage appointments, SOS requests, and review ML-driven predictive well-being insights.',
      route: '/login/counsellor',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', width: '100%', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '12px' }}>Pulse Tracker</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '560px', lineHeight: 1.6 }}>
          A privacy-first well-being system for hostel students. Tracked by students, verified by parents, monitored by wardens.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', maxWidth: '1100px', width: '100%' }}>
        {portals.map(p => (
          <div
            key={p.title}
            className="glass-panel"
            style={{ cursor: 'pointer', transition: 'transform 0.3s, box-shadow 0.3s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}
            onClick={() => navigate(p.route)}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.3)`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
          >
            <div style={{ background: p.iconBg, padding: '20px', borderRadius: '50%', color: p.iconColor }}>
              {p.icon}
            </div>
            <h2 style={{ fontSize: '1.3rem' }}>{p.title}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Landing;
