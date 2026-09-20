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
    <div className="min-h-screen bg-[var(--plaster)] flex items-center justify-center p-6 text-[var(--ink)] font-body">
      <Helmet>
        <title>Login | GS False Ceiling Works</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="bg-[var(--paper)] max-w-md w-full p-8 rounded-md border border-[var(--line)] shadow-sm">
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
                className="w-full border border-[var(--line)] rounded-md px-3 py-2 focus:outline-none focus:border-[var(--blue)] focus:ring-1 focus:ring-[var(--blue)]"
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
                className="w-full border border-[var(--line)] rounded-md px-3 py-2 focus:outline-none focus:border-[var(--blue)] focus:ring-1 focus:ring-[var(--blue)]"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[var(--ink)] text-[var(--paper)] py-2 rounded-md font-medium hover:bg-opacity-90 transition-colors disabled:opacity-70 mt-2"
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
                className="w-full border border-[var(--line)] rounded-md px-3 py-2 focus:outline-none focus:border-[var(--blue)] focus:ring-1 focus:ring-[var(--blue)]"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[var(--ink)] text-[var(--paper)] py-2 rounded-md font-medium hover:bg-opacity-90 transition-colors disabled:opacity-70 mt-2"
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
