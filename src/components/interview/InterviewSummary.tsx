"use client";

import React from "react";
import { InterviewSession } from "@/types/interview";

interface InterviewSummaryProps {
  session: InterviewSession;
  onRestart: () => void;
}

export default function InterviewSummary({ session, onRestart }: InterviewSummaryProps) {
  const totalAttempts = session.attempts.length;
  const averageScore = totalAttempts > 0
    ? session.attempts.reduce((acc, curr) => acc + curr.evaluation.overallScore, 0) / totalAttempts
    : 0;

  const getPerformanceGrade = (score: number) => {
    if (score >= 9.0) return { grade: "S", title: "Staff / Principal Level", color: "text-amber-400 border-amber-500/40 bg-amber-500/10" };
    if (score >= 7.5) return { grade: "A", title: "Strong Senior Engineer Pass", color: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10" };
    if (score >= 6.0) return { grade: "B", title: "Mid-Level Solid Candidate", color: "text-cyan-400 border-cyan-500/40 bg-cyan-500/10" };
    if (score >= 4.5) return { grade: "C", title: "Junior / Partially Qualified", color: "text-indigo-400 border-indigo-500/40 bg-indigo-500/10" };
    return { grade: "D", title: "Needs Technical Revision", color: "text-rose-400 border-rose-500/40 bg-rose-500/10" };
  };

  const performance = getPerformanceGrade(averageScore);

  const allStrengths = Array.from(
    new Set(session.attempts.flatMap((att) => att.evaluation.strengths))
  );

  const allMissingConcepts = Array.from(
    new Set(session.attempts.flatMap((att) => att.evaluation.missingConcepts))
  );

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Banner & Final Rating */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
              Technical Interview Summary Report
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Interview Completed!
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Topic: <strong className="text-white capitalize">{session.setup.topic.replace("-", " ")}</strong> • Difficulty: <strong className="text-white capitalize">{session.setup.difficulty}</strong>
            </p>
          </div>

          {/* Grade Badge */}
          <div className={`flex flex-col items-center justify-center rounded-2xl border p-6 min-w-[200px] text-center shadow-lg ${performance.color}`}>
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">Grade</span>
            <span className="text-5xl font-black">{performance.grade}</span>
            <span className="text-xs font-semibold mt-1">{performance.title}</span>
            <span className="text-2xl font-bold mt-2 font-mono">{averageScore.toFixed(1)} <span className="text-xs font-normal opacity-70">/ 10</span></span>
          </div>
        </div>
      </div>

      {/* Strengths vs Growth Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3 rounded-2xl border border-emerald-500/20 bg-slate-900/90 p-6 backdrop-blur-md">
          <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Key Demonstrated Strengths
          </h3>
          <ul className="space-y-2">
            {allStrengths.map((str, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3 rounded-2xl border border-amber-500/20 bg-slate-900/90 p-6 backdrop-blur-md">
          <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Key Recommended Focus Topics
          </h3>
          <ul className="space-y-2">
            {allMissingConcepts.map((concept, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{concept}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Detailed Question Timeline */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Question Breakdown</h2>
        <div className="space-y-4">
          {session.attempts.map((attempt, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-3 backdrop-blur-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-xs font-bold text-white">
                    Q{index + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">Score:</span>
                  <span className="font-mono font-bold text-indigo-400 text-sm">
                    {attempt.evaluation.overallScore.toFixed(1)} / 10
                  </span>
                </div>
              </div>

              <p className="text-sm font-semibold text-slate-100">
                {attempt.question.questionText}
              </p>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs font-mono text-slate-300 line-clamp-3">
                <span className="text-slate-500 font-sans block mb-1">Your Answer:</span>
                {attempt.userAnswer}
              </div>

              <div className="text-xs text-slate-400 leading-relaxed pt-1">
                <strong className="text-slate-200">Feedback Summary:</strong> {attempt.evaluation.detailedFeedback.slice(0, 200)}...
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={onRestart}
          type="button"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Practice Another Interview Session
        </button>
      </div>
    </div>
  );
}
