import { FunctionDeclaration } from "@google/genai";
import { QuestionAttempt } from "@/types/interview";

/**
 * Tool 1: getCandidatePerformanceHistory
 * Allows Gemini to inspect the candidate's previous attempt history, scores, and missed concepts in the current session.
 */
export const candidatePerformanceTool: FunctionDeclaration = {
  name: "getCandidatePerformanceHistory",
  description: "Retrieves the candidate's scores, missed concepts, and strengths from previous questions in the current interview session to generate an adaptive follow-up question.",
  parametersJsonSchema: {
    type: "object",
    properties: {
      topic: {
        type: "string",
        description: "The current interview topic (e.g., javascript, react, system-design)",
      },
    },
    required: ["topic"],
  },
};

/**
 * Executes getCandidatePerformanceHistory locally in our application backend.
 */
export function executeCandidatePerformanceTool(
  attempts: QuestionAttempt[],
  args?: { topic?: string }
) {
  const targetTopic = args?.topic;
  if (!attempts || attempts.length === 0) {
    return {
      status: "no_prior_attempts",
      topic: targetTopic,
      message: "This is the first question in the session. No previous performance data is available.",
      attemptsCount: 0,
      weakAreas: [],
      strengths: [],
      previousQuestions: [],
    };
  }

  const previousQuestions = attempts.map((a) => a.question.questionText);
  const weakAreas = Array.from(new Set(attempts.flatMap((a) => a.evaluation.missingConcepts)));
  const strengths = Array.from(new Set(attempts.flatMap((a) => a.evaluation.strengths)));
  const averageScore =
    attempts.reduce((acc, curr) => acc + curr.evaluation.overallScore, 0) / attempts.length;

  return {
    status: "success",
    attemptsCount: attempts.length,
    averageScore: Number(averageScore.toFixed(1)),
    previousQuestions,
    weakAreas,
    strengths,
    recommendation: weakAreas.length > 0
      ? `Focus the next question on testing one of these missed areas: ${weakAreas.slice(0, 3).join(", ")}`
      : "The candidate answered well previously. Increase the depth and challenge level.",
  };
}
