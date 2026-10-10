// @ts-nocheck
import React from 'react';
import { 
  LayoutDashboard, 
  BrainCircuit, 
  LineChart, 
  Compass, 
  MessageSquareText, 
  Users, 
  Sparkles, 
  Server, 
  GraduationCap, 
  ChevronRight,
  ShieldAlert,
  PlayCircle,
  Calendar,
  Database,
  History,
  ShieldCheck
} from 'lucide-react';
import { BackendHealth, UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  backendHealth: BackendHealth;
  onOpenBackendModal: () => void;
  onOpenLoginModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  backendHealth,
  onOpenBackendModal,
  onOpenLoginModal,
}) => {
  const studentNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'twin', label: 'Digital Learning Twin', icon: BrainCircuit, badge: 'Active' },
    { id: 'planner', label: '7-Day Study Planner', icon: Calendar, badge: '4 Tasks' },
    { id: 'risk-predictor', label: 'AI Risk Predictor', icon: ShieldAlert, badge: '1 Alert' },
    { id: 'analytics', label: 'Academic Trajectory', icon: LineChart, badge: null },
    { id: 'copilot', label: 'AI Advisor Copilot', icon: MessageSquareText, badge: null },
  ];

  const facultyNavItems = [
    { id: 'faculty-cohort', label: 'Cohort Overview', icon: Users, badge: '6 Students' },
    { id: 'risk-predictor', label: 'Risk Factor Analysis', icon: ShieldAlert, badge: null },
    { id: 'analytics', label: 'Curriculum Trends', icon: LineChart, badge: null },
  ];

  const adminNavItems = [
    { id: 'admin-csv', label: 'CSV Ingestion & Quality', icon: Database, badge: 'Verify' },
    { id: 'admin-users', label: 'User & Role Directory', icon: Users, badge: null },
    { id: 'admin-audit', label: 'Audit Trail Events', icon: History, badge: null },
  ];

  const navItems = 
    userRole === 'admin' 
      ? adminNavItems 
      : userRole === 'faculty' 
      ? facultyNavItems 
      : studentNavItems;

  return (
    <aside className="w-64 min-w-[16rem] bg-white border-r border-slate-200/80 flex flex-col justify-between h-screen sticky top-0 select-none z-30 shadow-[1px_0_10px_rgba(0,0,0,0.02)]">
      {/* Top Section */}
      <div className="p-5 flex flex-col gap-4 overflow-y-auto">
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25 ring-2 ring-brand-100">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-slate-900">CampusIQ</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700">AI</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Student Success Platform</p>
          </div>
        </div>

        {/* 3-Role Switcher */}
        <div className="bg-slate-100 p-1 rounded-xl flex items-center text-[11px] font-bold text-slate-600">
          <button
            onClick={() => {
              setUserRole('student');
              setActiveTab('dashboard');
            }}
            className={`flex-1 py-1.5 px-1.5 rounded-lg transition-all text-center cursor-pointer ${
              userRole === 'student'
                ? 'bg-white text-brand-600 shadow-sm font-extrabold'
                : 'hover:text-slate-900'
            }`}
          >
            Student
          </button>
          <button
            onClick={() => {
              setUserRole('faculty');
              setActiveTab('faculty-cohort');
            }}
            className={`flex-1 py-1.5 px-1.5 rounded-lg transition-all text-center cursor-pointer ${
              userRole === 'faculty'
                ? 'bg-white text-brand-600 shadow-sm font-extrabold'
                : 'hover:text-slate-900'
            }`}
          >
            Faculty
          </button>
          <button
            onClick={() => {
              setUserRole('admin');
              setActiveTab('admin-csv');
            }}
            className={`flex-1 py-1.5 px-1.5 rounded-lg transition-all text-center cursor-pointer ${
              userRole === 'admin'
                ? 'bg-white text-brand-600 shadow-sm font-extrabold'
                : 'hover:text-slate-900'
            }`}
          >
            Admin
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1 mt-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1">
            {userRole === 'student' ? 'Student Workspace' : userRole === 'faculty' ? 'Advisor Workspace' : 'Administrative Governance'}
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 font-bold shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.badge.includes('Alert') || item.badge.includes('Tasks')
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-brand-100 text-brand-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Launch Learning Twin Promotion */}
        {userRole === 'student' && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100/80 shadow-xs relative overflow-hidden">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="p-1 rounded-lg bg-violet-600 text-white">
                <BrainCircuit className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-violet-900">Learning Twin Ready</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed mb-2">
              Topic gap detected in MA-204 (SVD). Test your knowledge now.
            </p>
            <button
              onClick={() => setActiveTab('twin')}
              className="w-full text-[11px] font-bold py-1.5 px-3 rounded-lg bg-violet-600 hover:bg-violet-700 text-white transition-colors flex items-center justify-center gap-1 shadow-xs cursor-pointer"
            >
              <span>Inspect Gaps</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-slate-100 flex flex-col gap-2.5 bg-slate-50/50">
        <button
          onClick={onOpenBackendModal}
          className="w-full flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80 hover:border-brand-300 text-xs text-slate-600 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Server className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-700 text-[11px]">Python FastAPI</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                backendHealth.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span className="text-[10px] font-bold text-slate-500">
              {backendHealth.status === 'online' ? 'Online' : 'Demo'}
            </span>
          </div>
        </button>

        <button
          onClick={onOpenLoginModal}
          className="w-full py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors cursor-pointer text-center"
        >
          Switch Demo Account
        </button>

        <div className="text-center text-[10px] text-slate-400">
          HacXLerate 2026 · <span className="font-bold text-brand-600">DEBUG MASTERS</span>
        </div>
      </div>
    </aside>
  );
};
