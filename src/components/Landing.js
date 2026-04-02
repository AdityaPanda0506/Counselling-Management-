import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShieldAlert, Brain } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '16px' }}>Happiness Index System</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Select your portal to continue</p>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '1000px', padding: '0 20px' }}>
        
        {/* Student Portal */}
        <div 
          className="glass-panel" 
          style={{ width: '300px', cursor: 'pointer', transition: 'transform 0.3s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
          onClick={() => navigate('/login/student')}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '24px', borderRadius: '50%', color: 'var(--primary)' }}>
            <User size={48} />
          </div>
          <h2 style={{ fontSize: '1.5rem' }}>Student Portal</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Log your daily pulse and book counselling sessions.</p>
        </div>

        {/* Warden Portal */}
        <div 
          className="glass-panel" 
          style={{ width: '300px', cursor: 'pointer', transition: 'transform 0.3s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
          onClick={() => navigate('/login/warden')}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '24px', borderRadius: '50%', color: 'var(--success)' }}>
            <ShieldAlert size={48} />
          </div>
          <h2 style={{ fontSize: '1.5rem' }}>Warden Portal</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>View aggregated block stress and mood analytics.</p>
        </div>

        {/* Counsellor Portal */}
        <div 
          className="glass-panel" 
          style={{ width: '300px', cursor: 'pointer', transition: 'transform 0.3s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
          onClick={() => navigate('/login/counsellor')}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '24px', borderRadius: '50%', color: 'var(--accent)' }}>
            <Brain size={48} />
          </div>
          <h2 style={{ fontSize: '1.5rem' }}>Counsellor Portal</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Manage appointments and view ML predictive alerts.</p>
        </div>

      </div>
    </div>
  );
};

export default Landing;
