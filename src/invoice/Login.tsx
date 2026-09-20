import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Helmet } from 'react-helmet-async';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mode, setMode] = useState<'login' | 'forgot'>('login');
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // auth state change will be picked up by InvoiceApp
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/invoice/reset-password',
      });
      if (error) throw error;
      setResetSent(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-[var(--plaster)] flex items-center justify-center p-6 text-[var(--ink)] font-body relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--blue)]/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--cove)]/10 rounded-full blur-[100px]" />
      <Helmet>
        <title>Login | GS False Ceiling Works</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="bg-white/70 backdrop-blur-xl max-w-md w-full p-10 rounded-[2rem] border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative z-10">
        <h1 className="text-2xl font-heading font-bold tracking-tight mb-2 text-center">
          GS False Ceiling Works
        </h1>
        <p className="text-[var(--slate)] text-center mb-8">
          {mode === 'login' ? 'Sign in to access your dashboard' : 'Reset your password'}
        </p>

        {errorMsg && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm mb-6 border border-red-200">
            {errorMsg}
          </div>
        )}
        
        {resetSent && (
          <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm mb-6 border border-green-200">
            Password reset link sent to your email.
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input 
                type="email" 
                required
                className="w-full border-0 bg-white/60 shadow-inner rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--blue)]/30 transition-all"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <label className="block text-sm font-medium">Password</label>
                <button type="button" onClick={() => setMode('forgot')} className="text-sm text-[var(--blue)] hover:underline">
                  Forgot password?
                </button>
              </div>
              <input 
                type="password" 
                required
                className="w-full border-0 bg-white/60 shadow-inner rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--blue)]/30 transition-all"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[var(--ink)] text-[var(--paper)] py-3 rounded-xl font-medium hover:bg-[var(--ink)]/90 hover:shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 mt-4"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input 
                type="email" 
                required
                className="w-full border-0 bg-white/60 shadow-inner rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--blue)]/30 transition-all"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[var(--ink)] text-[var(--paper)] py-3 rounded-xl font-medium hover:bg-[var(--ink)]/90 hover:shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 mt-4"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <button 
              type="button"
              onClick={() => setMode('login')}
              className="w-full text-center text-sm text-[var(--slate)] hover:text-[var(--ink)] transition-colors mt-4"
            >
              Back to login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
