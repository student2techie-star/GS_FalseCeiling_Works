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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 flex items-center justify-center p-6 font-body relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <Helmet>
        <title>Login | GS Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="glass max-w-md w-full p-10 rounded-[2.5rem] relative z-10 animate-fade-in border-white/60 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-heading font-extrabold text-2xl shadow-lg shadow-accent/20 mx-auto mb-6">
          GS
        </div>
        <h1 className="text-3xl font-heading font-extrabold tracking-tight mb-2 text-center text-primary">
          Welcome Back
        </h1>
        <p className="text-slate-500 text-center mb-8 font-medium">
          {mode === 'login' ? 'Sign in to access your admin dashboard' : 'Enter your email to reset password'}
        </p>

        {errorMsg && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm mb-6 border border-red-100 font-medium animate-fade-in">
            {errorMsg}
          </div>
        )}
        
        {resetSent && (
          <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm mb-6 border border-emerald-100 font-medium animate-fade-in">
            Password reset link sent to your email.
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
              <input 
                type="email" 
                required
                className="w-full border-0 bg-white/80 shadow-inner rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-bold text-slate-700">Password</label>
                <button type="button" onClick={() => setMode('forgot')} className="text-sm font-semibold text-accent hover:text-primary transition-colors">
                  Forgot password?
                </button>
              </div>
              <input 
                type="password" 
                required
                className="w-full border-0 bg-white/80 shadow-inner rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-accent text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-accent/30 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-none mt-4"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
              <input 
                type="email" 
                required
                className="w-full border-0 bg-white/80 shadow-inner rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-accent text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-accent/30 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-none mt-4"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <button 
              type="button"
              onClick={() => setMode('login')}
              className="w-full text-center text-sm font-bold text-slate-500 hover:text-primary transition-colors mt-4"
            >
              Back to login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
