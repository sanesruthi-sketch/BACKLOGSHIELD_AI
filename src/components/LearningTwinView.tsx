// @ts-nocheck
import React, { useState } from 'react';
import { TopicMasteryItem } from '../types';
import { 
  Sparkles, 
  BrainCircuit, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Play, 
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';

interface LearningTwinViewProps {
  topics: TopicMasteryItem[];
  onTakeQuiz: (courseId: string, topicName: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const LearningTwinView: React.FC<LearningTwinViewProps> = ({
  topics,
  onTakeQuiz,
  onRefresh,
  isRefreshing,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTopics = topics.filter((t) => {
    const matchesFilter = filterStatus === 'all' || t.status === filterStatus;
    const matchesSearch =
      t.topic_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.course_code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const gapCount = topics.filter((t) => t.status === 'priority learning gap').length;
  const practiceCount = topics.filter((t) => t.status === 'needs practice').length;
  const masteryCount = topics.filter((t) => t.status === 'provisional mastery').length;
  const unassessedCount = topics.filter((t) => t.status === 'NOT ASSESSED').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-violet-500/30 text-violet-200 border border-violet-400/30">
                Digital Learning Twin · Profile Model
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Topic Mastery & Competency Twin
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Maintains an evolving competency state for every course topic updated via verified server-side quizzes: <code className="bg-black/30 px-1.5 py-0.5 rounded text-violet-300 font-mono text-xs">New Mastery = 0.7 × Old + 0.3 × Quiz</code>.
            </p>
          </div>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-white text-violet-950 font-bold text-xs hover:bg-slate-100 transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-violet-600' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Twin State'}</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Priority Gaps (&lt;50%)</span>
          <h3 className="text-2xl font-extrabold text-rose-600 mt-1">{gapCount} Topics</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">High midterm risk weight</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Needs Practice (50-69%)</span>
          <h3 className="text-2xl font-extrabold text-amber-600 mt-1">{practiceCount} Topics</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Requires reinforcement</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Provisional Mastery (&ge;70%)</span>
          <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">{masteryCount} Topics</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Demonstrated competency</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Unassessed</span>
          <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{unassessedCount} Topics</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Baseline quiz needed</p>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:max-w-xs relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topic or course code..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs font-semibold bg-slate-100 p-1 rounded-xl">
          {[
            { id: 'all', label: `All (${topics.length})` },
            { id: 'priority learning gap', label: `Priority Gaps (${gapCount})` },
            { id: 'needs practice', label: `Needs Practice (${practiceCount})` },
            { id: 'provisional mastery', label: `Mastered (${masteryCount})` },
            { id: 'NOT ASSESSED', label: `Not Assessed (${unassessedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer ${
                filterStatus === tab.id
                  ? 'bg-white text-violet-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Topic Cards Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTopics.map((topic) => {
          const isGap = topic.status === 'priority learning gap';
          const isPractice = topic.status === 'needs practice';
          const isMastery = topic.status === 'provisional mastery';

          return (
            <div
              key={topic.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isGap
                  ? 'bg-rose-50/30 border-rose-200/90 shadow-xs hover:border-rose-300'
                  : isPractice
                  ? 'bg-amber-50/20 border-amber-200/80 shadow-xs hover:border-amber-300'
                  : isMastery
                  ? 'bg-white border-slate-200 hover:border-emerald-200 shadow-xs'
                  : 'bg-slate-50/70 border-slate-200/70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {topic.course_code}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      isGap
                        ? 'bg-rose-100 text-rose-700'
                        : isPractice
                        ? 'bg-amber-100 text-amber-700'
                        : isMastery
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {topic.status_label}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm">{topic.topic_name}</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">{topic.course_name}</p>

                {/* Mastery Gauge */}
                <div className="mt-4">
                  <div className="flex items-baseline justify-between text-xs mb-1">
                    <span className="text-slate-400 font-medium">Mastery Level:</span>
                    <strong
                      className={`text-sm font-extrabold ${
                        isGap ? 'text-rose-600' : isPractice ? 'text-amber-600' : isMastery ? 'text-emerald-600' : 'text-slate-400'
                      }`}
                    >
                      {topic.mastery_percent !== null ? `${topic.mastery_percent}%` : 'Not Assessed'}
                    </strong>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isGap ? 'bg-rose-500' : isPractice ? 'bg-amber-500' : isMastery ? 'bg-emerald-500' : 'bg-transparent'
                      }`}
                      style={{ width: `${topic.mastery_percent || 0}%` }}
                    />
                  </div>
                </div>

                {/* Evidence Recommendation */}
                <p className="text-[11px] text-slate-600 mt-3 leading-relaxed">
                  {topic.recommendation}
                </p>
              </div>

              {/* Action Footer */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>{topic.attempt_count} attempts · {topic.last_assessed_at}</span>
                <button
                  onClick={() => onTakeQuiz(topic.course_id, topic.topic_name)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
                >
                  <Play className="w-3 h-3" />
                  <span>Adaptive Quiz</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
