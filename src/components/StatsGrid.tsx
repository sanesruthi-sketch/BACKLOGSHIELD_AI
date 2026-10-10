import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  GraduationCap, 
  ShieldCheck, 
  CalendarCheck, 
  ClipboardCheck,
  Info
} from 'lucide-react';
import { MetricSummary } from '../types';

interface StatsGridProps {
  metrics: MetricSummary;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* 1. CGPA Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 group relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
            <TrendingUp className="w-3 h-3" />
            +{metrics.gpaChange.toFixed(2)}
          </span>
        </div>

        <div className="mt-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cumulative GPA</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {metrics.cgpa.toFixed(2)}
            </h3>
            <span className="text-xs text-slate-400 font-medium">/ 4.00</span>
          </div>
        </div>

        {/* Progress bar to 4.0 */}
        <div className="mt-3">
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-brand-600 h-full rounded-full transition-all duration-500" 
              style={{ width: `${(metrics.cgpa / 4.0) * 100}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2 text-[11px] text-slate-500">
            <span>Projected: <strong className="text-brand-700 font-bold">{metrics.projectedCgpa.toFixed(2)}</strong></span>
            <span>91st Percentile</span>
          </div>
        </div>
      </div>

      {/* 2. AI Retention / Success Probability */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 group relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
            <TrendingUp className="w-3 h-3" />
            +{metrics.retentionChange}%
          </span>
        </div>

        <div className="mt-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Success Probability</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {metrics.retentionProbability}%
            </h3>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Low Risk</span>
          </div>
        </div>

        <div className="mt-3">
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${metrics.retentionProbability}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2 text-[11px] text-slate-500">
            <span>CampusIQ AI Confidence</span>
            <span className="font-semibold text-slate-700">98.4%</span>
          </div>
        </div>
      </div>

      {/* 3. Average Attendance */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 group relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 ring-1 ring-amber-100 group-hover:scale-105 transition-transform">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700">
            <TrendingDown className="w-3 h-3" />
            {metrics.attendanceChange}%
          </span>
        </div>

        <div className="mt-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overall Attendance</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {metrics.attendanceAverage}%
            </h3>
            <span className="text-xs text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-semibold">1 Alert</span>
          </div>
        </div>

        <div className="mt-3">
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-amber-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${metrics.attendanceAverage}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2 text-[11px] text-slate-500">
            <span>Min. Req: 75%</span>
            <span className="text-rose-600 font-semibold">MA-204 at 71%</span>
          </div>
        </div>
      </div>

      {/* 4. Assignment Completion Rate */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 group relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="p-2.5 rounded-xl bg-violet-50 text-violet-600 ring-1 ring-violet-100 group-hover:scale-105 transition-transform">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
            <TrendingUp className="w-3 h-3" />
            +{metrics.assignmentChange}%
          </span>
        </div>

        <div className="mt-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assignment Completion</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {metrics.assignmentRate}%
            </h3>
            <span className="text-xs text-slate-400 font-medium">32/35 on time</span>
          </div>
        </div>

        <div className="mt-3">
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-violet-600 h-full rounded-full transition-all duration-500" 
              style={{ width: `${metrics.assignmentRate}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2 text-[11px] text-slate-500">
            <span>Weekly Study: <strong className="text-slate-700">{metrics.studyHoursWeekly}h</strong></span>
            <span className="font-semibold text-violet-700">3 Due Soon</span>
          </div>
        </div>
      </div>
    </div>
  );
};
