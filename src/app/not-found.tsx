import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[700px] rounded-full bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-cyan-500/20 blur-3xl opacity-60" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-2xl opacity-40" />

      {/* Header Nav */}
      <header className="relative z-10 mx-auto w-full max-w-6xl px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white font-extrabold text-xl shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            AI
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
            AI Interview Coach
          </span>
        </Link>

        <Link
          href="/interview"
          className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-5 py-2 text-sm font-semibold text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-500/50 transition-all"
        >
          Start Practice
        </Link>
      </header>

      {/* Main 404 Content */}
      <main className="relative z-10 mx-auto w-full max-w-2xl px-6 py-16 flex flex-col items-center text-center space-y-8">
        {/* Glowing Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1.5 text-xs font-mono font-bold text-rose-300 shadow-inner">
          <span className="h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
          HTTP 404 • Page Not Found
        </div>

        {/* Large 404 Typography with Gradient */}
        <div className="relative">
          <span className="text-8xl sm:text-9xl font-black tracking-tighter bg-gradient-to-b from-white via-slate-300 to-slate-600 bg-clip-text text-transparent select-none drop-shadow-2xl">
            404
          </span>
        </div>

        {/* Heading & Subtext */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Looks Like You&apos;ve Hit an Unhandled Route
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-md mx-auto leading-relaxed">
            The technical interview question or page you are looking for doesn&apos;t exist, was moved, or had its pointer dereferenced.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 px-6 py-3.5 text-sm font-bold text-slate-200 transition-all shadow-lg hover:border-slate-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Home</span>
          </Link>

          <Link
            href="/interview"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Start an Interview</span>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mx-auto w-full max-w-6xl px-6 py-8 text-center text-xs text-slate-600 border-t border-slate-900">
        AI Technical Interview Coach • Master System Design, JavaScript, React, & Architecture
      </footer>
    </div>
  );
}
