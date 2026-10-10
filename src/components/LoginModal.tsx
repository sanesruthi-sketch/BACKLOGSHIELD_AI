import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  GraduationCap, 
  Users, 
  ShieldCheck, 
  ArrowRight,
  User,
  Hash,
  BookOpen,
  LogOut,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { loginApi, registerApi } from '../services/api';
import { UserAuth } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAuth) => void;
  onSignOut?: () => void;
  currentUser?: any;
  initialMode?: 'login' | 'signup' | 'signout';
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onSignOut,
  currentUser,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'signout'>(initialMode);
  const [hasConfirmedSignOut, setHasConfirmedSignOut] = useState(false);
  
  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Sign Up Form State
  const [fullName, setFullName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (overrideEmail?: string, overridePass?: string) => {
    const loginEmail = overrideEmail || email;
    const loginPass = overridePass || password;

    if (!loginEmail || !loginPass) {
      setError('Please provide email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const user = await loginApi(loginEmail, loginPass);
      onLoginSuccess(user);
      onClose();
    } catch {
      setError('Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!fullName.trim() || !rollNumber.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const user = await registerApi({
        email: email.trim(),
        password,
        full_name: fullName.trim(),
        role: 'student',
        roll_number: rollNumber.trim().toUpperCase(),
        department,
      });
      setSuccessMsg(`Account created for ${user.name}! Logging in...`);
      setTimeout(() => {
        onLoginSuccess(user);
        onClose();
      }, 700);
    } catch {
      setError('Registration failed. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-md">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">CampusIQ Student Portal</h3>
              <p className="text-xs text-slate-300">
                {mode === 'login' ? 'Institutional Sign In' : mode === 'signup' ? 'New Student Registration' : 'Session Management & Sign Out'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="p-1.5 bg-slate-100 border-b border-slate-200 grid grid-cols-3 gap-1 text-xs font-bold text-center">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`py-2 rounded-xl transition ${
              mode === 'login' 
                ? 'bg-white text-brand-700 shadow-xs' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🎓 Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null); }}
            className={`py-2 rounded-xl transition ${
              mode === 'signup' 
                ? 'bg-white text-brand-700 shadow-xs' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            ✨ Sign Up
          </button>
          <button
            type="button"
            onClick={() => { setMode('signout'); setError(null); }}
            className={`py-2 rounded-xl transition ${
              mode === 'signout' 
                ? 'bg-white text-rose-700 shadow-xs' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🚪 Sign Out
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              {successMsg}
            </div>
          )}

          {/* SIGN IN MODE */}
          {mode === 'login' && (
            <>
              {/* Quick Demo Persona Login Buttons */}
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Instant Hackathon Demo Logins:
                </p>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => handleLogin('a.rivera@campus.edu', 'password123')}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-brand-50 hover:bg-brand-100 border border-brand-200 text-brand-900 font-bold transition-all text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-brand-600" />
                      <span>Student (Alex Rivera)</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-brand-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLogin('e.vance@campus.edu', 'password123')}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-violet-50 hover:bg-violet-100 border border-violet-200 text-violet-900 font-bold transition-all text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-violet-600" />
                      <span>Faculty (Dr. Evelyn Vance)</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-violet-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLogin('admin@campus.edu', 'admin123')}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 font-bold transition-all text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-slate-700" />
                      <span>Administrator (Dean Hayes)</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-2 text-[10px] font-bold uppercase text-slate-400">Or enter credentials</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {/* Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
                className="space-y-3"
              >
                <div>
                  <label className="font-bold text-slate-700 mb-1 block">University Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@campus.edu"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 mb-1 block">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all cursor-pointer"
                >
                  {loading ? 'Authenticating...' : 'Sign In to Portal'}
                </button>
              </form>
            </>
          )}

          {/* SIGN UP MODE */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 mb-1 block">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Maya Lin"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 mb-1 block">Roll Number / ID</label>
                  <div className="relative">
                    <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      placeholder="23CS089"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-mono uppercase"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 mb-1 block">Department</label>
                  <div className="relative">
                    <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full pl-9 pr-2 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    >
                      <option value="Computer Science & Engineering">Computer Science</option>
                      <option value="Artificial Intelligence">AI & Machine Learning</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Information Technology">Information Tech</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">University Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="m.lin@campus.edu"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 mb-1 block">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 mb-1 block">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all cursor-pointer mt-2"
              >
                {loading ? 'Creating Account...' : '✨ Create Student Account'}
              </button>
            </form>
          )}

          {/* SIGN OUT MODE */}
          {mode === 'signout' && (
            <div className="space-y-4">
              {!hasConfirmedSignOut ? (
                <>
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-indigo-600/60 border border-indigo-400/30 flex items-center justify-center font-bold text-lg text-white">
                        {currentUser?.name ? currentUser.name.split(' ').map((n: string)=>n[0]).join('').slice(0,2).toUpperCase() : 'AR'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-white">{currentUser?.name || 'Alex Rivera'}</h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                            Active
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5">{currentUser?.rollNo || '23CS048'} · {currentUser?.major || 'Computer Science'}</p>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-center text-xs">
                      <div className="bg-white/5 rounded-lg p-2">
                        <div className="text-[10px] text-slate-400">Cumulative CGPA</div>
                        <div className="font-bold text-emerald-400">{currentUser?.gpa || '3.78'}</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2">
                        <div className="text-[10px] text-slate-400">MongoDB Atlas</div>
                        <div className="font-bold text-indigo-300">Synchronized</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-rose-900">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Terminate Active Session</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-rose-700">
                      Ending this session locks student records on this device. Telemetry is saved in the database.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setHasConfirmedSignOut(true);
                        if (onSignOut) onSignOut();
                      }}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold text-xs shadow-md shadow-rose-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Confirm Sign Out & End Session</span>
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition cursor-pointer"
                    >
                      Cancel & Keep Signed In
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-6 text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-slate-900">Signed Out Successfully</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Your session has ended securely. You may log back in anytime.
                    </p>
                  </div>
                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setHasConfirmedSignOut(false);
                        setMode('login');
                      }}
                      className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition-all cursor-pointer shadow-md"
                    >
                      🔑 Log Back In
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
