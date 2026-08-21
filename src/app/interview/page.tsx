"use client";

import React, { useState } from "react";
import Link from "next/link";
import { InterviewSession, InterviewSetup as SetupType, Question, AnswerEvaluation } from "@/types/interview";
import InterviewSetup from "@/components/interview/InterviewSetup";
import InterviewProgress from "@/components/interview/InterviewProgress";
import InterviewQuestion from "@/components/interview/InterviewQuestion";
import AnswerEditor from "@/components/interview/AnswerEditor";
import EvaluationResult from "@/components/interview/EvaluationResult";
import InterviewSummary from "@/components/interview/InterviewSummary";

export default function InterviewPage() {
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [currentEvaluation, setCurrentEvaluation] = useState<AnswerEvaluation | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Start new interview session
  const handleStartInterview = async (setup: SetupType) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/interview/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: setup.topic,
          difficulty: setup.difficulty,
          previousQuestions: [],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate initial question.");
      }

      const initialQuestion: Question = data.question;

      const newSession: InterviewSession = {
        id: `session_${Date.now()}`,
        setup,
        attempts: [],
        currentQuestion: initialQuestion,
        currentQuestionNumber: 1,
        status: "question",
        startTime: Date.now(),
      };

      setSession(newSession);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit candidate answer for AI evaluation
  const handleSubmitAnswer = async (userAnswer: string) => {
    if (!session || !session.currentQuestion) return;

    setIsEvaluating(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: session.setup.topic,
          difficulty: session.setup.difficulty,
          questionText: session.currentQuestion.questionText,
          keyConceptsExpected: session.currentQuestion.keyConceptsExpected,
          userAnswer,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to evaluate answer.");
      }

      const evaluation: AnswerEvaluation = data.evaluation;
      setCurrentEvaluation(evaluation);

      // Record question attempt
      const attempt = {
        questionNumber: session.currentQuestionNumber,
        question: session.currentQuestion,
        userAnswer,
        evaluation,
        timeSpentSeconds: 0,
      };

      setSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          attempts: [...prev.attempts, attempt],
          status: "result",
        };
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(msg);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Advance to next question or complete interview
  const handleNextQuestion = async () => {
    if (!session) return;

    const isLast = session.currentQuestionNumber >= session.setup.questionCount;

    if (isLast) {
      setSession((prev) => (prev ? { ...prev, status: "summary", endTime: Date.now() } : null));
      setCurrentEvaluation(null);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const previousQuestionsText = session.attempts.map((att) => att.question.questionText);

      const res = await fetch("/api/interview/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: session.setup.topic,
          difficulty: session.setup.difficulty,
          previousQuestions: previousQuestionsText,
          attempts: session.attempts,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate next question.");
      }

      const nextQuestion: Question = data.question;

      setSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          currentQuestion: nextQuestion,
          currentQuestionNumber: prev.currentQuestionNumber + 1,
          status: "question",
        };
      });
      setCurrentEvaluation(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndSession = () => {
    if (session && session.attempts.length > 0) {
      setSession((prev) => (prev ? { ...prev, status: "summary", endTime: Date.now() } : null));
    } else {
      setSession(null);
    }
  };

  const handleRestart = () => {
    setSession(null);
    setCurrentEvaluation(null);
    setErrorMessage(null);
  };

  return (
    <main className="relative min-h-screen bg-slate-950 bg-grid-pattern text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* Navigation Header */}
      <header className="mx-auto max-w-5xl mb-8 flex items-center justify-between border-b border-slate-800/80 pb-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white font-extrabold text-lg shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            AI
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
            Interview Coach
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Gemini 3.6 Flash
          </span>
        </div>
      </header>

      {/* Error Banner */}
      {errorMessage && (
        <div className="mx-auto max-w-5xl mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs font-semibold text-rose-300 flex items-center justify-between">
          <span>⚠️ {errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Stateful View Container */}
      <div className="mx-auto max-w-5xl">
        {(!session || session.status === "setup") && (
          <InterviewSetup onStart={handleStartInterview} isLoading={isLoading} />
        )}

        {session && session.status !== "setup" && session.status !== "summary" && (
          <div className="space-y-6">
            <InterviewProgress
              setup={session.setup}
              currentQuestionNumber={session.currentQuestionNumber}
              totalQuestions={session.setup.questionCount}
              onEndSession={handleEndSession}
            />

            {isLoading && (
              <div className="flex flex-col items-center justify-center py-20 space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
                <p className="text-sm font-semibold text-slate-300">
                  Generating Senior Technical Question...
                </p>
              </div>
            )}

            {!isLoading && session.status === "question" && session.currentQuestion && (
              <div className="space-y-6">
                <InterviewQuestion
                  question={session.currentQuestion}
                  questionNumber={session.currentQuestionNumber}
                />
                <AnswerEditor onSubmit={handleSubmitAnswer} isEvaluating={isEvaluating} />
              </div>
            )}

            {!isLoading && session.status === "result" && currentEvaluation && (
              <EvaluationResult
                evaluation={currentEvaluation}
                questionNumber={session.currentQuestionNumber}
                totalQuestions={session.setup.questionCount}
                onNextQuestion={handleNextQuestion}
                isLastQuestion={session.currentQuestionNumber >= session.setup.questionCount}
              />
            )}
          </div>
        )}

        {session && session.status === "summary" && (
          <InterviewSummary session={session} onRestart={handleRestart} />
        )}
      </div>
    </main>
  );
}
