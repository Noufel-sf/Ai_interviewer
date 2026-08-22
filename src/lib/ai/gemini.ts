import { GoogleGenAI } from "@google/genai";
import { DifficultyLevel, TopicId, QuestionAttempt } from "@/types/interview";
import { QuestionResponseType, EvaluationResponseType, QuestionResponseSchema, EvaluationResponseSchema } from "./schemas";
import { INTERVIEWER_SYSTEM_PROMPT, getQuestionGenerationPrompt, getEvaluationPrompt } from "./prompts";
import { candidatePerformanceTool, executeCandidatePerformanceTool } from "./tools";

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

function cleanJsonString(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }
  cleaned = cleaned.trim();

  // If valid JSON as-is, return immediately
  try {
    JSON.parse(cleaned);
    return cleaned;
  } catch {
    // Fix unescaped control characters in string literals (e.g. raw newlines in code examples)
    return cleaned.replace(/[\x00-\x1F\x7F]/g, (char) => {
      if (char === "\n") return "\\n";
      if (char === "\r") return "\\r";
      if (char === "\t") return "\\t";
      return "";
    });
  }
}

/**
 * Calls Gemini 3.6 Flash to dynamically generate a realistic technical interview question.
 * Supports Stage 4 Function Calling: When prior attempts exist in the session, Gemini is equipped
 * with the `getCandidatePerformanceHistory` tool to inspect weaknesses and craft an adaptive question.
 */
export async function generateInterviewQuestion(
  topic: TopicId,
  difficulty: DifficultyLevel,
  previousQuestions: string[] = [],
  attempts: QuestionAttempt[] = []
): Promise<QuestionResponseType> {
  const client = getGeminiClient();

  const basePrompt = getQuestionGenerationPrompt(topic, difficulty, previousQuestions);
  const hasPriorAttempts = attempts && attempts.length > 0;

  // Stage 4: If there are previous attempts in this session, provide the candidate performance tool
  if (hasPriorAttempts) {
    try {
      const promptWithToolContext = `${basePrompt}

CRITICAL: You have access to the tool "getCandidatePerformanceHistory".
Before writing the question, invoke "getCandidatePerformanceHistory" with topic "${topic}" to see the candidate's previous scores, missing concepts, and weak areas.
Then generate a targeted follow-up question that addresses their missed concepts or tests deeper mechanics.`;

      const initialResponse = await client.models.generateContent({
        model: "gemini-3.6-flash",
        contents: promptWithToolContext,
        config: {
          systemInstruction: INTERVIEWER_SYSTEM_PROMPT,
          tools: [{ functionDeclarations: [candidatePerformanceTool] }],
          temperature: 0.7,
        },
      });

      // Check if Gemini decided to invoke the tool
      if (initialResponse.functionCalls && initialResponse.functionCalls.length > 0) {
        const call = initialResponse.functionCalls[0];
        console.log(`[Stage 4: Tool Calling] Gemini invoked tool: ${call.name} with args:`, call.args);

        // Execute tool locally
        const toolOutput = executeCandidatePerformanceTool(attempts, call.args as { topic?: string });
        console.log("[Stage 4: Tool Calling] Tool execution output:", toolOutput);

        // Use the original candidate content to preserve thought_signatures and internal metadata
        const modelContent = initialResponse.candidates?.[0]?.content || {
          role: "model",
          parts: [{ functionCall: call }],
        };

        // Send the tool response back to Gemini to complete question generation
        const followUpResponse = await client.models.generateContent({
          model: "gemini-3.6-flash",
          contents: [
            { role: "user", parts: [{ text: promptWithToolContext }] },
            modelContent,
            {
              role: "user",
              parts: [
                {
                  functionResponse: {
                    name: call.name,
                    response: { output: toolOutput },
                  },
                },
              ],
            },
          ],
          config: {
            systemInstruction: INTERVIEWER_SYSTEM_PROMPT,
            responseMimeType: "application/json",
            temperature: 0.7,
          },
        });

        const text = followUpResponse.text || "";
        if (text.trim()) {
          const parsed = JSON.parse(cleanJsonString(text));
          const validated = QuestionResponseSchema.parse(parsed);
          return {
            ...validated,
            toolUsed: call.name,
          };
        }
      }

      // If Gemini returned direct JSON without tool invocation:
      if (initialResponse.text && initialResponse.text.trim()) {
        const parsed = JSON.parse(cleanJsonString(initialResponse.text));
        return QuestionResponseSchema.parse(parsed);
      }
    } catch (toolError) {
      console.warn("[Stage 4: Tool Calling] Tool calling step encountered an issue, falling back to direct generation:", toolError);
    }
  }

  // Standard generation (e.g. for Question 1 without tools)
  const response = await client.models.generateContent({
    model: "gemini-3.6-flash",
    contents: basePrompt,
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

  const cleaned = cleanJsonString(text);
  const parsed = JSON.parse(cleaned);
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

  const cleaned = cleanJsonString(text);
  const parsed = JSON.parse(cleaned);

  // Stage 5: Compute mathematical semantic concept coverage using embeddings & cosine similarity
  try {
    const { evaluateConceptCoverage } = await import("./embeddings");
    const conceptCoverage = await evaluateConceptCoverage(userAnswer, keyConceptsExpected || []);
    parsed.conceptCoverage = conceptCoverage;
  } catch (embedError) {
    console.warn("[Stage 5: Embeddings] Could not compute concept coverage:", embedError);
  }

  // Validating against Zod schema ensures type-safety and prevents runtime crashes
  return EvaluationResponseSchema.parse(parsed);
}
