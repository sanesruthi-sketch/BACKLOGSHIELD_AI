import React, { useState } from 'react';
import { PerformanceHistoryItem } from '../types';
import { Sparkles, ArrowUpRight, Filter } from 'lucide-react';

interface PerformanceChartProps {
  data: PerformanceHistoryItem[];
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  const [activeMetric, setActiveMetric] = useState<'score' | 'hours'>('score');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG Chart dimensions
  const svgWidth = 650;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  const chartW = svgWidth - paddingX * 2;
  const chartH = svgHeight - paddingY * 2;

  // Scale calculations
  const minVal = activeMetric === 'score' ? 60 : 10;
  const maxVal = activeMetric === 'score' ? 100 : 35;

  const getX = (index: number) => paddingX + (index / (data.length - 1)) * chartW;
  const getY = (val: number) => paddingY + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;

  // Generate path data for Student Score
  const studentPoints = data.map((d, i) => ({
    x: getX(i),
    y: getY(activeMetric === 'score' ? d.studentScore : d.studyHours),
  }));

  const classPoints = data.map((d, i) => ({
    x: getX(i),
    y: getY(activeMetric === 'score' ? d.classAverage : 20),
  }));

  const studentPath = studentPoints.reduce(
    (acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
    ''
  );

  const studentArea = `${studentPath} L ${studentPoints[studentPoints.length - 1].x} ${
    paddingY + chartH
  } L ${studentPoints[0].x} ${paddingY + chartH} Z`;

  const classPath = classPoints.reduce(
    (acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
    ''
  );

  const activePoint = hoveredIndex !== null ? data[hoveredIndex] : data[data.length - 1];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
      {/* Header with Title and Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 text-base">Academic Trajectory vs Cohort</h3>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI Verified
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            10-week performance curve relative to class average benchmark
          </p>
        </div>

        {/* Metric Toggle */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-xl flex text-xs font-semibold text-slate-600">
            <button
              onClick={() => setActiveMetric('score')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeMetric === 'score'
                  ? 'bg-white text-brand-600 shadow-xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              Evaluation Score (%)
            </button>
            <button
              onClick={() => setActiveMetric('hours')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeMetric === 'hours'
                  ? 'bg-white text-brand-600 shadow-xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              Study Hours / Wk
            </button>
          </div>
        </div>
      </div>

      {/* SVG Visualization */}
      <div className="relative mt-4 w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id="studentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines (horizontal) */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = paddingY + chartH * ratio;
            const val = Math.round(maxVal - ratio * (maxVal - minVal));
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={svgWidth - paddingX}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 font-mono"
                >
                  {val}{activeMetric === 'score' ? '%' : 'h'}
                </text>
              </g>
            );
          })}

          {/* Benchmark line (Class average) */}
          <path
            d={classPath}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2"
            strokeDasharray="5 5"
            strokeLinecap="round"
          />

          {/* Student Area Fill */}
          <path d={studentArea} fill="url(#studentGradient)" />

          {/* Student Main Curve Line */}
          <path
            d={studentPath}
            fill="none"
            stroke="#4f46e5"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Data Points */}
          {studentPoints.map((pt, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <g key={i}>
                {/* Invisible hover trigger */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="12"
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
                {/* Visible dot */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : 4}
                  fill="#ffffff"
                  stroke="#4f46e5"
                  strokeWidth={isHovered ? 3 : 2.5}
                  className="transition-all duration-150 pointer-events-none"
                />
                {/* Week X-axis label */}
                <text
                  x={pt.x}
                  y={svgHeight - 8}
                  textAnchor="middle"
                  className={`text-[11px] font-medium transition-colors ${
                    isHovered ? 'fill-brand-600 font-bold' : 'fill-slate-400'
                  }`}
                >
                  {data[i].week}
                </text>
              </g>
            );
          })}

          {/* Hover indicator line & badge if hovered */}
          {hoveredIndex !== null && (
            <g>
              <line
                x1={studentPoints[hoveredIndex].x}
                y1={paddingY}
                x2={studentPoints[hoveredIndex].x}
                y2={paddingY + chartH}
                stroke="#6366f1"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
            </g>
          )}
        </svg>

        {/* Dynamic Tooltip / Details pill */}
        <div className="mt-3 flex items-center justify-between text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-600" />
              <span className="font-medium text-slate-700">Alex Rivera:</span>
              <strong className="text-slate-900 font-bold">
                {activeMetric === 'score' ? `${activePoint.studentScore}%` : `${activePoint.studyHours} hrs/wk`}
              </strong>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <span className="font-medium text-slate-500">Cohort Average:</span>
              <strong className="text-slate-700 font-bold">
                {activeMetric === 'score' ? `${activePoint.classAverage}%` : '20.0 hrs/wk'}
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+{(activePoint.studentScore - activePoint.classAverage).toFixed(1)}% above cohort</span>
          </div>
        </div>
      </div>
    </div>
  );
};
