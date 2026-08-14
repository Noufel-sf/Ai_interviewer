import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-slate-950 bg-grid-pattern text-slate-100 flex flex-col justify-between">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-tr from-indigo-600/20 via-purple-600/10 to-cyan-500/20 blur-3xl opacity-50" />

      {/* Header Nav */}
      <header className="relative z-10 mx-auto w-full max-w-6xl px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white font-extrabold text-xl shadow-lg shadow-indigo-600/30">
            AI
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            AI Interview Coach
          </span>
        </div>

        <Link
          href="/interview"
          className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-5 py-2 text-sm font-semibold text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-500/50 transition-all"
        >
          Start Practice
        </Link>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 mx-auto w-full max-w-5xl px-6 py-12 space-y-16">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-bold text-indigo-300">
            <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
            Designed for Mid, Senior & Staff Developers
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Stop Guessing.{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
              Master Engineering Interviews
            </span>{" "}
            with AI.
          </h1>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Simulate realistic technical interviews, receive detailed criteria scores out of 10, uncover missing concepts, and learn what a Staff Engineer model answer looks like.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/interview"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 px-8 py-4 text-base font-bold text-white shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Start Technical Interview</span>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-3 backdrop-blur-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              ⚡
            </div>
            <h3 className="text-lg font-bold text-white">Targeted Engineering Questions</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tailored across 10 core domains (JavaScript, React, System Design, Node.js, Databases, DSA) and seniority levels.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-3 backdrop-blur-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              📊
            </div>
            <h3 className="text-lg font-bold text-white">4-Axis Detailed Scoring</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every answer evaluated on Knowledge, Technical Accuracy, Clarity, and Completeness out of 10.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-3 backdrop-blur-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              💡
            </div>
            <h3 className="text-lg font-bold text-white">Missing Concepts & Model Answers</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Identify exact technical gaps and compare your response directly against Staff Engineer model answers.
            </p>
          </div>
        </div>

        {/* Sample Preview Card */}
        <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/90 p-8 shadow-2xl space-y-6 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-300">
                Sample Evaluation Output
              </span>
              <span className="text-xs text-slate-400">JavaScript • Senior Level</span>
            </div>
            <span className="font-mono text-sm font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
              Score: 7.5 / 10
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs">
              <span className="font-bold text-emerald-400">• Strengths</span>
              <p className="text-slate-300">Correctly explained call stack mechanics & microtask event ordering.</p>
            </div>
            <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs">
              <span className="font-bold text-amber-400">• Missing Concepts</span>
              <p className="text-slate-300">Omitted process.nextTick priority vs Promise microtask queue in Node.js.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 py-8 text-center text-xs text-slate-500">
        AI Technical Interview Coach • Empowering software engineers to pass real interviews.
      </footer>
    </div>
  );
}
