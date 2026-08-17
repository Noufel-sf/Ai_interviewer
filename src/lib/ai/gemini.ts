import { GoogleGenAI } from "@google/genai";
import { DifficultyLevel, TopicId } from "@/types/interview";
import { QuestionResponseType, EvaluationResponseType, QuestionResponseSchema, EvaluationResponseSchema } from "./schemas";
import { INTERVIEWER_SYSTEM_PROMPT, getQuestionGenerationPrompt, getEvaluationPrompt } from "./prompts";

/**
 * Initializes the official Google Gen AI client.
 * Throws a clear error if the API key is not configured.
 */
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey === "your-gemini-api-key-here") {
    throw new Error(
      "GEMINI_API_KEY is not configured. Please add your GEMINI_API_KEY to .env.local"
    );
  }
  return new GoogleGenAI({ apiKey });
}

/**
 * Calls Gemini 3.6 Flash to dynamically generate a realistic technical interview question.
 * Temperature is set to 0.7 to ensure a variety of unique questions across attempts.
 */
export async function generateInterviewQuestion(
  topic: TopicId,
  difficulty: DifficultyLevel,
  previousQuestions: string[] = []
): Promise<QuestionResponseType> {
  const client = getGeminiClient();

  const prompt = getQuestionGenerationPrompt(topic, difficulty, previousQuestions);

  const response = await client.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
    config: {
      systemInstruction: INTERVIEWER_SYSTEM_PROMPT,
      responseMimeType: "application/json",
      temperature: 0.7,
    },
  });

  const text = response.text || "";
  if (!text.trim()) {
    throw new Error("Received empty response from Gemini during question generation.");
  }

  const parsed = JSON.parse(text);
  // Validating against Zod schema ensures type-safety and prevents runtime crashes
  return QuestionResponseSchema.parse(parsed);
}

/**
 * Calls Gemini 3.6 Flash to rigorously evaluate the candidate's answer.
 * Temperature is set to 0.2 to ensure deterministic, consistent, and calibrated scoring.
 */
export async function evaluateUserAnswer(
  topic: TopicId,
  difficulty: DifficultyLevel,
  questionText: string,
  keyConceptsExpected: string[],
  userAnswer: string
): Promise<EvaluationResponseType> {
  const client = getGeminiClient();

  const prompt = getEvaluationPrompt(topic, difficulty, questionText, keyConceptsExpected, userAnswer);

  const response = await client.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
    config: {
      systemInstruction: INTERVIEWER_SYSTEM_PROMPT,
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  });

  const text = response.text || "";
  if (!text.trim()) {
    throw new Error("Received empty response from Gemini during answer evaluation.");
  }

  const parsed = JSON.parse(text);
  // Validating against Zod schema ensures type-safety and prevents runtime crashes
  return EvaluationResponseSchema.parse(parsed);
}
