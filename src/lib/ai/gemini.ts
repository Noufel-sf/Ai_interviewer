import { GoogleGenAI } from "@google/genai";
import { DifficultyLevel, TopicId } from "@/types/interview";
import { QuestionResponseType, EvaluationResponseType, QuestionResponseSchema, EvaluationResponseSchema } from "./schemas";
import { INTERVIEWER_SYSTEM_PROMPT, getQuestionGenerationPrompt, getEvaluationPrompt } from "./prompts";

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey === "your-gemini-api-key-here") {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// Fallback high-quality mock question generator when GEMINI_API_KEY is missing
function generateMockQuestion(topic: TopicId, difficulty: DifficultyLevel): QuestionResponseType {
  const mockBank: Record<string, QuestionResponseType[]> = {
    javascript: [
      {
        id: `q_js_${Date.now()}`,
        topic: "javascript",
        difficulty,
        questionText: "Explain how the JavaScript Event Loop works in V8/Node.js. What is the execution priority difference between Microtasks (e.g. Promises, process.nextTick) and Macrotasks (e.g. setTimeout, setImmediate)?",
        contextHint: "Think about the call stack, call queue, microtask queue, and event loop phases.",
        keyConceptsExpected: [
          "Call Stack & Single-threaded execution",
          "Microtask queue vs Macrotask/Task queue priority",
          "Promise resolution vs setTimeout callback timing",
          "Node.js process.nextTick priority"
        ]
      },
      {
        id: `q_js_2_${Date.now()}`,
        topic: "javascript",
        difficulty,
        questionText: "What are JavaScript Closures and how do they impact memory management? How can closures accidentally lead to memory leaks in long-running SPA applications?",
        contextHint: "Consider lexical scope environment, garbage collection root references, and event listeners.",
        keyConceptsExpected: [
          "Lexical scope environment retention",
          "Garbage Collection mark-and-sweep algorithm",
          "Unintended DOM node or large object retention in scope",
          "Cleanup patterns (removing event listeners, setting references to null)"
        ]
      }
    ],
    typescript: [
      {
        id: `q_ts_${Date.now()}`,
        topic: "typescript",
        difficulty,
        questionText: "Explain the difference between TypeScript's `unknown`, `any`, and `never` types. How do conditional types and Type Guards utilize `never` for exhaustive type checking?",
        contextHint: "Focus on type safety, assignability rules, and switch/discriminated union exhaustiveness.",
        keyConceptsExpected: [
          "Type safety of `unknown` requiring narrowing vs unsafe `any`",
          "Empty set representation of `never`",
          "Discriminated unions with exhaustive checking in switch statements",
          "Custom Type Predicates (`is` operator)"
        ]
      }
    ],
    react: [
      {
        id: `q_react_${Date.now()}`,
        topic: "react",
        difficulty,
        questionText: "How does React 19 Concurrent Rendering and Fiber architecture optimize UI updates? Explain how `useTransition` and `useDeferredValue` differ from traditional `useEffect` debouncing.",
        contextHint: "Think about time-slicing, non-blocking UI interrupts, and priority lanes.",
        keyConceptsExpected: [
          "Fiber tree reconciliation & time-slicing",
          "Urgent vs Non-urgent state updates",
          "Interruptible rendering work in Concurrent Mode",
          "Difference between deferred values and debouncing"
        ]
      }
    ],
    "system-design": [
      {
        id: `q_sys_${Date.now()}`,
        topic: "system-design",
        difficulty,
        questionText: "Design a distributed Rate Limiter service capable of handling 100,000 requests/second. Compare Token Bucket, Leaky Bucket, and Sliding Window Log algorithms. How would you handle distributed state across multiple API nodes?",
        contextHint: "Consider latency, atomic operations in Redis, race conditions, and graceful degradation.",
        keyConceptsExpected: [
          "Algorithm comparison (Token Bucket vs Sliding Window Counter)",
          "Redis centralized state with Lua scripts for atomic incrementing",
          "Local memory caching with synchronization for ultra-low latency",
          "Handling Redis node failures and race conditions"
        ]
      }
    ]
  };

  const pool = mockBank[topic] || mockBank["javascript"];
  const selected = pool[Math.floor(Math.random() * pool.length)];
  return {
    ...selected,
    id: `q_${topic}_${Date.now()}`
  };
}

// Fallback high-quality mock evaluation when GEMINI_API_KEY is missing
function generateMockEvaluation(userAnswer: string): EvaluationResponseType {
  const isShort = userAnswer.trim().length < 50;
  const isDetailed = userAnswer.trim().length > 250;

  if (isShort) {
    return {
      overallScore: 4.5,
      criteriaBreakdown: {
        knowledge: 5.0,
        technicalAccuracy: 5.0,
        clarity: 4.0,
        completeness: 4.0
      },
      strengths: [
        "Identified the basic high-level terminology of the topic."
      ],
      missingConcepts: [
        "Did not explain the internal underlying mechanics.",
        "Missing practical trade-offs and edge cases.",
        "Lacks architectural code examples or execution order details."
      ],
      incorrectPoints: [
        "Answer was too brief to demonstrate full engineering competency for this target level."
      ],
      detailedFeedback: "Your answer touches on the basic surface definition, but in a senior technical interview, interviewers expect you to break down the underlying mechanics step-by-step. For instance, explaining the exact sequence of events, memory behavior, or runtime execution order provides strong signal to the hiring team.",
      betterAnswer: "A complete answer would explicitly define the core concept, trace an execution path, highlight edge cases or performance bottlenecks, and explain how to mitigate common pitfalls in production.",
      keyTakeaways: [
        "Elaborate on internal execution steps and mechanics.",
        "Include concrete engineering examples or code snippets.",
        "Address edge cases and performance trade-offs."
      ]
    };
  }

  return {
    overallScore: isDetailed ? 8.2 : 7.0,
    criteriaBreakdown: {
      knowledge: isDetailed ? 8.5 : 7.5,
      technicalAccuracy: isDetailed ? 8.5 : 7.0,
      clarity: isDetailed ? 8.0 : 7.0,
      completeness: isDetailed ? 8.0 : 6.5
    },
    strengths: [
      "Good structure and logical flow of explanation.",
      "Accurately covered primary concepts and standard definitions.",
      "Demonstrated practical understanding of engineering implications."
    ],
    missingConcepts: [
      "Could have elaborated more on edge-case failure modes.",
      "Mentions high-level mechanics but omits specific memory or runtime priority details."
    ],
    incorrectPoints: [],
    detailedFeedback: "Solid technical explanation! You communicated the main ideas clearly and demonstrated a firm grasp of the fundamental concepts. To push your rating from Senior to Lead/Staff level, articulate specific low-level trade-offs, metrics, or corner cases that demonstrate deep battle-tested experience.",
    betterAnswer: "An exemplary candidate answer opens with a concise 1-sentence executive summary, followed by a breakdown of the core mechanics, explicit trade-off matrix, and a brief code/architecture example illustrating real-world mitigation.",
    keyTakeaways: [
      "Always state key technical trade-offs explicitly.",
      "Structure your response with clear headings or bulleted steps.",
      "Mention real-world production metrics or edge cases."
    ]
  };
}

export async function generateInterviewQuestion(
  topic: TopicId,
  difficulty: DifficultyLevel,
  previousQuestions: string[] = []
): Promise<QuestionResponseType> {
  const client = getGeminiClient();

  if (!client) {
    console.log("[Gemini AI] No GEMINI_API_KEY found, using mock question generator.");
    return generateMockQuestion(topic, difficulty);
  }

  try {
    const prompt = getQuestionGenerationPrompt(topic, difficulty, previousQuestions);
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: INTERVIEWER_SYSTEM_PROMPT + "\n\n" + prompt }] }
      ],
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text || "";
    const parsed = JSON.parse(text);
    return QuestionResponseSchema.parse(parsed);
  } catch (error) {
    console.error("[Gemini AI] Question generation error:", error);
    return generateMockQuestion(topic, difficulty);
  }
}

export async function evaluateUserAnswer(
  topic: TopicId,
  difficulty: DifficultyLevel,
  questionText: string,
  keyConceptsExpected: string[],
  userAnswer: string
): Promise<EvaluationResponseType> {
  const client = getGeminiClient();

  if (!client) {
    console.log("[Gemini AI] No GEMINI_API_KEY found, using mock evaluation engine.");
    return generateMockEvaluation(userAnswer);
  }

  try {
    const prompt = getEvaluationPrompt(topic, difficulty, questionText, keyConceptsExpected, userAnswer);
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: INTERVIEWER_SYSTEM_PROMPT + "\n\n" + prompt }] }
      ],
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text || "";
    const parsed = JSON.parse(text);
    return EvaluationResponseSchema.parse(parsed);
  } catch (error) {
    console.error("[Gemini AI] Evaluation generation error:", error);
    return generateMockEvaluation(userAnswer);
  }
}
