import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  BookOpen, 
  Sparkles, 
  Users, 
  ArrowRight, 
  ShieldAlert,
  GraduationCap
} from 'lucide-react';
import { Course, AiRecommendation } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  recommendations: AiRecommendation[];
  onSelectCourse: (course: Course) => void;
  onNavigateTab: (tab: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  courses,
  recommendations,
  onSelectCourse,
  onNavigateTab,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // toggle handled by parent
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.code.toLowerCase().includes(query.toLowerCase()) ||
      c.instructor.toLowerCase().includes(query.toLowerCase())
  );

  const filteredRecs = recommendations.filter(
    (r) =>
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.courseCode.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type course code, recommendation, or command..."
            className="flex-1 bg-transparent border-none text-slate-800 placeholder-slate-400 text-sm focus:outline-hidden"
          />
          <kbd className="px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 border border-slate-200 rounded-md">
            ESC
          </kbd>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-4 text-xs">
          {/* Quick Action Commands */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Quick Navigation
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onNavigateTab('copilot');
                  onClose();
                }}
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-800 transition-colors text-left"
              >
                <Sparkles className="w-4 h-4 text-violet-600" />
                <span className="font-semibold text-xs">Open AI Copilot Advisor</span>
              </button>
              <button
                onClick={() => {
                  onNavigateTab('risk-predictor');
                  onClose();
                }}
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 transition-colors text-left"
              >
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span className="font-semibold text-xs">AI Risk Predictor</span>
              </button>
            </div>
          </div>

          {/* Matching Courses */}
          {filteredCourses.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Courses ({filteredCourses.length})
              </p>
              <div className="space-y-1">
                {filteredCourses.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectCourse(c);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-xs">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 group-hover:text-brand-600">
                            {c.title}
                          </span>
                          <span className="font-mono text-[10px] bg-slate-100 px-1 rounded text-slate-500">
                            {c.code}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {c.instructor} · Grade: {c.gradePercent}%
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand-600 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matching Recommendations */}
          {filteredRecs.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                AI Recommendations ({filteredRecs.length})
              </p>
              <div className="space-y-1">
                {filteredRecs.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => {
                      onNavigateTab('action-plan');
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-violet-500" />
                      <div>
                        <p className="font-semibold text-slate-800">{r.title}</p>
                        <p className="text-[11px] text-slate-400">{r.courseCode} · {r.impactEstimate}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-violet-600 font-bold bg-violet-50 px-2 py-0.5 rounded-md">
                      Action Plan
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
