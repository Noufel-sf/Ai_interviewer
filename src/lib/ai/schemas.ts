import { z } from "zod";

export const QuestionResponseSchema = z.object({
  id: z.string(),
  topic: z.string(),
  difficulty: z.string(),
  questionText: z.string(),
  contextHint: z.string().optional(),
  keyConceptsExpected: z.array(z.string()),
  toolUsed: z.string().optional(),
});

export const EvaluationResponseSchema = z.object({
  overallScore: z.number().min(0).max(10),
  criteriaBreakdown: z.object({
    knowledge: z.number().min(0).max(10),
    technicalAccuracy: z.number().min(0).max(10),
    clarity: z.number().min(0).max(10),
    completeness: z.number().min(0).max(10),
  }),
  strengths: z.array(z.string()),
  missingConcepts: z.array(z.string()),
  incorrectPoints: z.array(z.string()),
  detailedFeedback: z.string(),
  betterAnswer: z.string(),
  keyTakeaways: z.array(z.string()),
  ragSources: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        category: z.string(),
        score: z.number(),
        content: z.string(),
      })
    )
    .optional(),
  conceptCoverage: z
    .array(
      z.object({
        concept: z.string(),
        similarity: z.number(),
        covered: z.boolean(),
      })
    )
    .optional(),
});

export type QuestionResponseType = z.infer<typeof QuestionResponseSchema>;
export type EvaluationResponseType = z.infer<typeof EvaluationResponseSchema>;
