import React from 'react';
import { UpcomingTask } from '../types';
import { Calendar, Clock, CheckCircle2, AlertCircle, FileText, Code2, Award } from 'lucide-react';

interface UpcomingDeadlinesProps {
  tasks: UpcomingTask[];
  onToggleTask: (id: string) => void;
}

export const UpcomingDeadlines: React.FC<UpcomingDeadlinesProps> = ({
  tasks,
  onToggleTask,
}) => {
  const getTaskIcon = (type: UpcomingTask['type']) => {
    switch (type) {
      case 'exam':
        return <Award className="w-4 h-4 text-rose-600" />;
      case 'project':
        return <Code2 className="w-4 h-4 text-violet-600" />;
      case 'assignment':
        return <FileText className="w-4 h-4 text-brand-600" />;
      default:
        return <Clock className="w-4 h-4 text-amber-600" />;
    }
  };

  const getDifficultyBadge = (diff: UpcomingTask['difficulty']) => {
    switch (diff) {
      case 'hard':
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">Hard</span>;
      case 'medium':
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">Medium</span>;
      default:
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">Easy</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Upcoming Evaluative Milestones</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Key deadlines prioritized by AI grade weighting & study complexity
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
          {tasks.filter(t => !t.completed).length} Pending
        </span>
      </div>

      {/* Task List */}
      <div className="flex flex-col gap-3 mt-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => onToggleTask(task.id)}
            className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
              task.completed
                ? 'bg-slate-50/70 border-slate-100 opacity-60'
                : 'bg-white border-slate-200 hover:border-brand-200 hover:shadow-xs'
            }`}
          >
            <div className="flex items-center gap-3">
              <button
                className={`p-1 rounded-lg transition-colors ${
                  task.completed ? 'text-emerald-600 bg-emerald-50' : 'text-slate-300 hover:text-brand-600'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                    {task.courseCode}
                  </span>
                  <h4
                    className={`text-xs font-bold ${
                      task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                    }`}
                  >
                    {task.title}
                  </h4>
                </div>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1 font-medium text-rose-600">
                    <Calendar className="w-3 h-3" />
                    <span>{task.dueDate}</span>
                  </div>
                  <span>·</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Est. {task.estHours} hrs prep</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              {getDifficultyBadge(task.difficulty)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
