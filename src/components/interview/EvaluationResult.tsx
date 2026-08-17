"use client";

import React, { useState } from "react";
import { AnswerEvaluation } from "@/types/interview";

interface EvaluationResultProps {
  evaluation: AnswerEvaluation;
  questionNumber: number;
  totalQuestions: number;
  onNextQuestion: () => void;
  isLastQuestion: boolean;
}

export default function EvaluationResult({
  evaluation,
  questionNumber,
  onNextQuestion,
  isLastQuestion,
}: EvaluationResultProps) {
  const [showBetterAnswer, setShowBetterAnswer] = useState<boolean>(true);

  const getScoreColor = (score: number) => {
    if (score >= 8) return { text: "text-emerald-400", bg: "bg-emerald-500", border: "border-emerald-500/30", gradient: "from-emerald-500 to-teal-400" };
    if (score >= 6) return { text: "text-amber-400", bg: "bg-amber-500", border: "border-amber-500/30", gradient: "from-amber-500 to-yellow-400" };
    return { text: "text-rose-400", bg: "bg-rose-500", border: "border-rose-500/30", gradient: "from-rose-500 to-red-400" };
  };

  const mainScoreColor = getScoreColor(evaluation.overallScore);

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Header Score Summary Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Main Radial/Badge Score */}
          <div className="flex items-center gap-5 text-center md:text-left">
            <div className={`relative flex h-24 w-24 flex-col items-center justify-center rounded-2xl border ${mainScoreColor.border} bg-slate-950 p-2 shadow-inner`}>
              <span className="text-xs font-semibold text-slate-400 uppercase">Score</span>
              <span className={`text-3xl font-extrabold ${mainScoreColor.text}`}>
                {evaluation.overallScore.toFixed(1)}
              </span>
              <span className="text-[10px] text-slate-500">/ 10</span>
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 rounded-md bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-300">
                Evaluation for Q{questionNumber}
              </div>
              <h2 className="text-2xl font-bold text-white">
                {evaluation.overallScore >= 8
                  ? "Strong Technical Performance"
                  : evaluation.overallScore >= 6
                  ? "Good Concept Awareness — Mind the Mechanics"
                  : "Needs Improvement & Fundamental Revision"}
              </h2>
              <p className="text-xs text-slate-400">
                Evaluated strictly against Staff Software Engineer expectations.
              </p>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={onNextQuestion}
            type="button"
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>{isLastQuestion ? "View Complete Session Results" : "Continue to Next Question"}</span>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

        {/* Criteria Breakdown Metrics */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 border-t border-slate-800/80 pt-6">
          {[
            { label: "Knowledge", value: evaluation.criteriaBreakdown.knowledge },
            { label: "Tech Accuracy", value: evaluation.criteriaBreakdown.technicalAccuracy },
            { label: "Clarity", value: evaluation.criteriaBreakdown.clarity },
            { label: "Completeness", value: evaluation.criteriaBreakdown.completeness },
          ].map((item, idx) => {
            const color = getScoreColor(item.value);
            return (
              <div key={idx} className="space-y-1.5 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>{item.label}</span>
                  <span className={`font-mono font-bold ${color.text}`}>{item.value}/10</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={`h-full bg-gradient-to-r ${color.gradient} transition-all duration-500`}
                    style={{ width: `${(item.value / 10) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strengths & Missing Concepts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths Card */}
        <div className="space-y-3 rounded-2xl border border-emerald-500/20 bg-slate-900/90 p-5 backdrop-blur-md">
          <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-400">
            <svg className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            What You Handled Well
          </h3>
          <ul className="space-y-2">
            {evaluation.strengths.map((strength, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                <span className="text-emerald-400 font-bold mt-0.5">•</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Missing Concepts Card */}
        <div className="space-y-3 rounded-2xl border border-amber-500/20 bg-slate-900/90 p-5 backdrop-blur-md">
          <h3 className="flex items-center gap-2 text-sm font-bold text-amber-400">
            <svg className="h-5 w-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Missing Concepts & Gaps
          </h3>
          <ul className="space-y-2">
            {evaluation.missingConcepts.map((concept, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                <span className="text-amber-400 font-bold mt-0.5">•</span>
                <span>{concept}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Incorrect Points (If Any) */}
      {evaluation.incorrectPoints && evaluation.incorrectPoints.length > 0 && (
        <div className="space-y-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 backdrop-blur-md">
          <h3 className="flex items-center gap-2 text-sm font-bold text-rose-400">
            <svg className="h-5 w-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Technical Flaws / Inaccuracies Noted
          </h3>
          <ul className="space-y-1.5">
            {evaluation.incorrectPoints.map((point, i) => (
              <li key={i} className="text-xs text-rose-200 leading-relaxed">
                • {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Detailed Feedback Paragraphs */}
      <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <svg className="h-4 w-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          Interviewer Detailed Feedback
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line font-sans">
          {evaluation.detailedFeedback}
        </p>
      </div>

      {/* Model Answer Card */}
      <div className="space-y-3 rounded-2xl border border-indigo-500/30 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
            <svg className="h-4 w-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Model Candidate Answer (Senior/Staff Benchmark)
          </h3>
          <button
            type="button"
            onClick={() => setShowBetterAnswer(!showBetterAnswer)}
            className="text-xs font-semibold text-indigo-400 hover:underline"
          >
            {showBetterAnswer ? "Collapse" : "Expand"}
          </button>
        </div>

        {showBetterAnswer && (
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs font-mono text-slate-200 leading-relaxed whitespace-pre-line overflow-x-auto">
            {evaluation.betterAnswer}
          </div>
        )}
      </div>

      {/* Bottom Floating Navigation */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onNextQuestion}
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <span>{isLastQuestion ? "Finish Session & View Full Scorecard" : "Next Question"}</span>
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
