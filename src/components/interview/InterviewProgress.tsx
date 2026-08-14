"use client";

import React, { useEffect, useState } from "react";
import { InterviewSetup } from "@/types/interview";

interface InterviewProgressProps {
  setup: InterviewSetup;
  currentQuestionNumber: number;
  totalQuestions: number;
  onEndSession: () => void;
}

export default function InterviewProgress({
  setup,
  currentQuestionNumber,
  totalQuestions,
  onEndSession,
}: InterviewProgressProps) {
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage = Math.round(((currentQuestionNumber - 1) / totalQuestions) * 100);

  return (
    <div className="w-full rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl backdrop-blur-md space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Topic & Level Badges */}
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-300 border border-indigo-500/30 capitalize">
            {setup.topic.replace("-", " ")}
          </span>
          <span className="rounded-lg bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300 border border-slate-700 capitalize">
            {setup.difficulty} Level
          </span>
        </div>

        {/* Progress Tracker & Timer */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <svg className="h-4 w-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Timer: <strong className="font-mono text-white text-sm">{formatTimer(secondsElapsed)}</strong></span>
          </div>

          <div className="text-xs font-semibold text-slate-300">
            Question <span className="text-indigo-400 font-bold">{currentQuestionNumber}</span> of {totalQuestions}
          </div>

          <button
            onClick={onEndSession}
            type="button"
            className="rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1 text-xs font-medium text-slate-400 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            End Interview
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
}
