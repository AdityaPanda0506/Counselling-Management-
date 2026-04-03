import React from 'react';
import { SignUp } from '@clerk/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const StudentSignUp = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', width: '100%', padding: '40px 20px' }}>
      <div style={{ position: 'relative', width: '100%', maxWidth: '480px' }}>
        <button
          onClick={() => navigate('/warden')}
          style={{ position: 'absolute', top: '-48px', left: '0', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <ArrowLeft size={18} /> Back to Warden Dashboard
        </button>

        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <h1 className="gradient-text">Register New Student</h1>
          <p style={{ color: 'var(--text-muted)' }}>Create a official account for a new hostel resident.</p>
        </div>

        <SignUp 
          appearance={{
            elements: {
              rootBox: "glass-panel animate-fade-in",
              card: "bg-transparent shadow-none border-none",
              headerTitle: "gradient-text text-2xl",
              headerSubtitle: "text-muted-foreground",
              formButtonPrimary: "btn btn-primary w-full",
              footer: "hidden",
            }
          }}
          routing="path"
          path="/warden/signup"
          signInUrl="/login/student"
          forceRedirectUrl="/student" // After registration, they can go to their dashboard
        />
      </div>
    </div>
  );
};

export default StudentSignUp;
