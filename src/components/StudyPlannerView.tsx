// @ts-nocheck
import React, { useState } from 'react';
import { StudyPlannerData, StudyTask } from '../types';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  RefreshCw, 
  Plus, 
  BookOpen, 
  AlertTriangle,
  Award
} from 'lucide-react';

interface StudyPlannerViewProps {
  plannerData: StudyPlannerData;
  onToggleTask: (taskId: string, minutes: number) => void;
  onGeneratePlan: () => void;
  isGenerating: boolean;
}

export const StudyPlannerView: React.FC<StudyPlannerViewProps> = ({
  plannerData,
  onToggleTask,
  onGeneratePlan,
  isGenerating,
}) => {
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('all');

  const tasks = plannerData.tasks || [];
  const filteredTasks = selectedDayFilter === 'all' 
    ? tasks 
    : tasks.filter(t => t.planned_date.toLowerCase().includes(selectedDayFilter.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-brand-500/30 text-brand-200 border border-brand-400/30">
              Personalized Retention Planner · Rolling 7-Day Cycle
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
              7-Day Academic Study Planner
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Dynamically budgets daily preparation blocks based on weak topics detected by the Digital Learning Twin and upcoming exam deadlines.
            </p>
          </div>

          <button
            onClick={onGeneratePlan}
            disabled={isGenerating}
            className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-white text-brand-900 font-bold text-xs hover:bg-slate-100 transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className={`w-3.5 h-3.5 text-violet-600 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Synthesizing...' : 'Re-generate 7-Day Schedule'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Plan Completion</span>
          <h3 className="text-2xl font-extrabold text-brand-600 mt-1">{plannerData.completion_percent}%</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">{plannerData.completed_tasks} of {plannerData.total_tasks} blocks completed</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Planned Study</span>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{plannerData.planned_hours} Hours</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Budgeted for rolling cycle</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Actual Time Logged</span>
          <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">{plannerData.actual_hours} Hours</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Verified session time</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-violet-600 uppercase tracking-wider">Weekly Target</span>
          <h3 className="text-2xl font-extrabold text-violet-600 mt-1">25.0 Hours</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">CampusIQ Normative Target</p>
        </div>
      </div>

      {/* Task Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
          {['All', 'Today', 'Tomorrow'].map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDayFilter(day.toLowerCase())}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedDayFilter === day.toLowerCase()
                  ? 'bg-white text-brand-600 shadow-xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400">
          Showing {filteredTasks.length} study tasks
        </span>
      </div>

      {/* Task Cards List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const isDone = task.status === 'completed';
          const isUrgent = task.priority === 'urgent';

          return (
            <div
              key={task.id}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                isDone
                  ? 'bg-slate-50/70 border-slate-200/60 opacity-60'
                  : isUrgent
                  ? 'bg-white border-rose-200/80 hover:border-rose-300 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-brand-200 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1">
                <button
                  onClick={() => onToggleTask(task.id, task.planned_minutes)}
                  className={`mt-1 p-1 rounded-lg transition-colors cursor-pointer ${
                    isDone
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-slate-300 hover:text-brand-600 hover:bg-brand-50'
                  }`}
                  title={isDone ? 'Mark as planned' : 'Complete task and log minutes'}
                >
                  <CheckCircle2 className="w-5 h-5" />
                </button>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      {task.course_code}
                    </span>
                    <h4
                      className={`text-sm font-bold ${
                        isDone ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}
                    >
                      {task.title}
                    </h4>
                    {isUrgent && !isDone && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                        Priority Deficit
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {task.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1 text-slate-700 font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-brand-600" />
                      {task.planned_date}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Planned: {task.planned_minutes}m
                    </span>
                    {task.actual_minutes > 0 && (
                      <>
                        <span>·</span>
                        <span className="text-emerald-600 font-bold">
                          Logged: {task.actual_minutes}m
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {!isDone && (
                <button
                  onClick={() => onToggleTask(task.id, task.planned_minutes)}
                  className="px-3 py-1.5 rounded-lg bg-brand-50 text-brand-700 hover:bg-brand-100 font-bold text-xs transition-colors shrink-0 cursor-pointer"
                >
                  Log Done
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
