import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SignIn } from '@clerk/react';

const Login = ({ fixedRole, redirect }) => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100%', padding: '20px' }}>
      <div style={{ position: 'relative', width: '100%', maxWidth: '480px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button
          onClick={() => navigate('/')}
          style={{ position: 'absolute', top: '-48px', left: '0', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <ArrowLeft size={16} /> Back to Portals
        </button>

        <SignIn 
          appearance={{
            elements: {
              rootBox: "glass-panel animate-fade-in",
              card: "bg-transparent shadow-none border-none",
              headerTitle: "gradient-text text-2xl",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton: "glass-panel hover:bg-white/10",
              formButtonPrimary: "btn btn-primary w-full",
              footer: "hidden", 
            }
          }}
          routing="path"
          path={`/login/${fixedRole}`}
          signUpUrl="/sign-up" 
          forceRedirectUrl={redirect}
        />
        
        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '24px' }}>
          Registration Number is your Username.
        </p>
      </div>
    </div>
  );
};

export default Login;
