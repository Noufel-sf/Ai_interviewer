"use client";

import React, { useState } from "react";
import { Question } from "@/types/interview";

interface InterviewQuestionProps {
  question: Question;
  questionNumber: number;
}

export default function InterviewQuestion({ question, questionNumber }: InterviewQuestionProps) {
  const [showHint, setShowHint] = useState<boolean>(false);

  return (
    <div className="w-full space-y-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-xs font-bold text-white">
            Q{questionNumber}
          </span>
          <h3 className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">
            Technical Interview Question
          </h3>
          {question.toolUsed && (
            <span className="hidden sm:inline-flex items-center gap-1 rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-mono text-cyan-300">
              🛠️ Tool: {question.toolUsed}()
            </span>
          )}
        </div>

        {question.contextHint && (
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 hover:border-indigo-500/50 hover:text-indigo-300 transition-all"
          >
            <svg className="h-3.5 w-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {showHint ? "Hide Context Hint" : "Show Hint"}
          </button>
        )}
      </div>

      {/* Question Text */}
      <div className="prose prose-invert max-w-none">
        <p className="text-lg font-semibold leading-relaxed text-slate-100 sm:text-xl">
          {question.questionText}
        </p>
      </div>

      {/* Collapsible Context Hint */}
      {showHint && question.contextHint && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs text-amber-200 leading-relaxed">
          <strong className="font-bold text-amber-300">Context & Scenario Hint:</strong> {question.contextHint}
        </div>
      )}

      {/* Expected Key Concepts Badges */}
      {question.keyConceptsExpected && question.keyConceptsExpected.length > 0 && (
        <div className="pt-2">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Interviewer Focus Areas:
          </div>
          <div className="flex flex-wrap gap-2">
            {question.keyConceptsExpected.map((concept, idx) => (
              <span
                key={idx}
                className="rounded-md border border-slate-800 bg-slate-800/80 px-2.5 py-1 text-xs text-slate-300 font-mono"
              >
                • {concept}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
