"use client";

import React, { useState } from "react";
import { DifficultyLevel, InterviewSetup as SetupType, TopicId, TopicOption } from "@/types/interview";

interface InterviewSetupProps {
  onStart: (setup: SetupType) => void;
  isLoading?: boolean;
}

const TOPICS: TopicOption[] = [
  {
    id: "javascript",
    name: "JavaScript Mechanics",
    category: "Fundamentals",
    description: "Event Loop, Closures, Prototypes, Memory Leaks & Async patterns",
    iconName: "js",
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "Fundamentals",
    description: "Generics, Utility types, Type narrowing & Discriminated unions",
    iconName: "ts",
  },
  {
    id: "react",
    name: "React 19 & Next.js",
    category: "Frontend",
    description: "Concurrent rendering, Fiber, Server Components & Hooks",
    iconName: "react",
  },
  {
    id: "nodejs",
    name: "Node.js & Backend",
    category: "Backend",
    description: "Event emitter, Streams, Worker threads, Microservices & I/O",
    iconName: "node",
  },
  {
    id: "system-design",
    name: "System Design",
    category: "Architecture",
    description: "Scalability, Caching, Rate limiting, Distributed consensus",
    iconName: "sys",
  },
  {
    id: "dsa",
    name: "Data Structures & Algos",
    category: "Fundamentals",
    description: "Trees, Graphs, Dynamic Programming, Time & Space Complexity",
    iconName: "dsa",
  },
  {
    id: "databases",
    name: "Databases & SQL",
    category: "Backend",
    description: "Indexing, B-Trees, ACID transactions, Sharding & Query optimization",
    iconName: "db",
  },
  {
    id: "web-performance",
    name: "Web Performance",
    category: "Frontend",
    description: "Core Web Vitals, Reflows, Bundle optimization & Rendering paths",
    iconName: "perf",
  },
  {
    id: "security",
    name: "Web Security",
    category: "DevOps",
    description: "XSS, CSRF, CORS, JWT, OAuth2 & Cryptographic hashing",
    iconName: "sec",
  },
  {
    id: "devops",
    name: "DevOps & Cloud",
    category: "DevOps",
    description: "Docker, Kubernetes, CI/CD pipelines & Cloud architecture",
    iconName: "cloud",
  },
];

const DIFFICULTIES: { id: DifficultyLevel; label: string; exp: string; color: string; ring: string }[] = [
  {
    id: "junior",
    label: "Junior Engineer",
    exp: "0 - 2 yrs • Core concepts, syntax & fundamental problem solving",
    color: "from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30",
    ring: "peer-checked:ring-emerald-500",
  },
  {
    id: "mid",
    label: "Mid-Level Engineer",
    exp: "2 - 5 yrs • Internal mechanics, edge cases & pragmatic trade-offs",
    color: "from-blue-500/20 to-cyan-500/10 text-cyan-400 border-cyan-500/30",
    ring: "peer-checked:ring-cyan-500",
  },
  {
    id: "senior",
    label: "Senior Engineer",
    exp: "5+ yrs • Architecture, performance, concurrency & deep technical accuracy",
    color: "from-purple-500/20 to-indigo-500/10 text-purple-400 border-purple-500/30",
    ring: "peer-checked:ring-purple-500",
  },
  {
    id: "lead",
    label: "Staff / Lead Architect",
    exp: "8+ yrs • Distributed resilience, fault tolerance, system scaling & cost trade-offs",
    color: "from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30",
    ring: "peer-checked:ring-amber-500",
  },
];

export default function InterviewSetup({ onStart, isLoading = false }: InterviewSetupProps) {
  const [selectedTopic, setSelectedTopic] = useState<TopicId>("javascript");
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>("senior");
  const [questionCount, setQuestionCount] = useState<number>(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart({
      topic: selectedTopic,
      difficulty: selectedDifficulty,
      questionCount,
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative z-10 space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
            <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
            AI Technical Interview Simulation Engine
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Prepare Like a Senior Engineer
          </h1>
          <p className="max-w-2xl text-slate-400 text-sm sm:text-base leading-relaxed">
            Simulate rigorous engineering interviews with real-time feedback, detailed criteria breakdown, missing concepts detection, and model answers.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Select Topic */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white">
                1
              </span>
              Select Technical Specialization
            </h2>
            <span className="text-xs text-slate-400">10 Topics Available</span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TOPICS.map((topic) => {
              const isSelected = selectedTopic === topic.id;
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`group relative flex flex-col justify-between rounded-xl border p-4 text-left transition-all duration-200 ${
                    isSelected
                      ? "border-indigo-500/60 bg-slate-800/90 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/50"
                      : "border-slate-800/80 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/50"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
                        {topic.category}
                      </span>
                      {isSelected && (
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-white text-[10px]">
                          ✓
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {topic.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {topic.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Target Difficulty */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white">
              2
            </span>
            Target Seniority Level
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {DIFFICULTIES.map((diff) => {
              const isSelected = selectedDifficulty === diff.id;
              return (
                <button
                  key={diff.id}
                  type="button"
                  onClick={() => setSelectedDifficulty(diff.id)}
                  className={`relative flex flex-col justify-between rounded-xl border p-4 text-left transition-all duration-200 ${
                    isSelected
                      ? `bg-gradient-to-b ${diff.color} ring-1 ring-indigo-500/50 shadow-md`
                      : "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/50"
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-sm">{diff.label}</h3>
                      {isSelected && <span className="text-xs text-indigo-400 font-bold">Active</span>}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{diff.exp}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Question Count & Submit */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-md">
          <div className="space-y-1 text-center sm:text-left">
            <label className="text-sm font-semibold text-slate-300">Interview Length</label>
            <div className="flex items-center gap-2">
              {[3, 5, 7].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setQuestionCount(num)}
                  className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
                    questionCount === num
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  {num} Questions
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating Questions...
              </>
            ) : (
              <>
                <span>Start Technical Interview</span>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
