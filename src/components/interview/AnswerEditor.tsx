"use client";

import React, { useState } from "react";

interface AnswerEditorProps {
  onSubmit: (answer: string) => void;
  isEvaluating?: boolean;
}

export default function AnswerEditor({ onSubmit, isEvaluating = false }: AnswerEditorProps) {
  const [answer, setAnswer] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim() || isEvaluating) return;
    onSubmit(answer.trim());
  };

  const insertTemplate = (templateText: string) => {
    setAnswer((prev) => (prev ? `${prev}\n\n${templateText}` : templateText));
  };

  const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0;
  const charCount = answer.length;

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label htmlFor="answer-input" className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <svg className="h-4 w-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Your Technical Answer
        </label>

        {/* Quick Structure Helper Buttons */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 hidden sm:inline">Add Structure:</span>
          <button
            type="button"
            onClick={() => insertTemplate("### Core Concept\n")}
            className="rounded bg-slate-800 px-2 py-0.5 text-slate-300 hover:bg-slate-700 hover:text-white transition-all text-[11px]"
          >
            + Core Concept
          </button>
          <button
            type="button"
            onClick={() => insertTemplate("### Mechanics & Code Example\n```javascript\n\n```")}
            className="rounded bg-slate-800 px-2 py-0.5 text-slate-300 hover:bg-slate-700 hover:text-white transition-all text-[11px]"
          >
            + Code Block
          </button>
          <button
            type="button"
            onClick={() => insertTemplate("### Trade-offs & Edge Cases\n")}
            className="rounded bg-slate-800 px-2 py-0.5 text-slate-300 hover:bg-slate-700 hover:text-white transition-all text-[11px]"
          >
            + Trade-offs
          </button>
        </div>
      </div>

      {/* Answer Input */}
      <div className="relative">
        <textarea
          id="answer-input"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Explain your answer thoroughly like in a real technical interview... Include core principles, execution mechanics, code snippets, and trade-offs."
          rows={10}
          disabled={isEvaluating}
          className="w-full rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm font-mono text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 transition-all leading-relaxed"
        />
      </div>

      {/* Footer Info & Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span>Words: <strong className="text-slate-200">{wordCount}</strong></span>
          <span>Characters: <strong className="text-slate-200">{charCount}</strong></span>
          {wordCount < 30 && wordCount > 0 && (
            <span className="text-amber-400 text-[11px]">Tip: Senior answers benefit from detailed execution mechanics</span>
          )}
        </div>

        <button
          type="submit"
          disabled={!answer.trim() || isEvaluating}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isEvaluating ? (
            <>
              <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Evaluating Answer...
            </>
          ) : (
            <>
              <span>Submit Answer for AI Evaluation</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
