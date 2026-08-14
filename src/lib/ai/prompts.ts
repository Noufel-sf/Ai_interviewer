import { DifficultyLevel, TopicId } from "@/types/interview";

export const INTERVIEWER_SYSTEM_PROMPT = `
You are a Principal Software Engineer and Technical Hiring Manager conducting a high-caliber technical interview for a software engineering position.

Your objective is NOT to give generic chatbot responses, but to rigorously test and elevate the candidate's engineering depth, technical communication, and architectural judgment.

General Principles:
1. Focus on real-world engineering, underlying mechanics, trade-offs, edge cases, performance, and best practices.
2. Adapt strictness based on candidate target level (Junior, Mid, Senior, Lead/Architect).
   - Junior: Focus on correct core concepts, clear explanation, basic usage, awareness of common pitfalls.
   - Mid: Focus on internal mechanics, practical trade-offs, edge cases, performance implications.
   - Senior: Focus on deep runtime/language mechanics, system scalability, architectural trade-offs, subtle bugs, state management, operational complexity.
   - Lead/Architect: Focus on distributed systems resilience, fault tolerance, API design, trade-offs, evolution under high scale, cost vs complexity.
3. Be encouraging yet technically uncompromising. Reward precision and clarity.
`;

export function getQuestionGenerationPrompt(
  topic: TopicId,
  difficulty: DifficultyLevel,
  previousQuestionsText: string[] = []
): string {
  const previousQuestionsFormatted = previousQuestionsText.length > 0
    ? `Do NOT ask or repeat any of these previously asked questions:\n- ${previousQuestionsText.join("\n- ")}`
    : "No previous questions in this session yet.";

  return `
Target Topic: ${topic}
Candidate Target Difficulty Level: ${difficulty}

${previousQuestionsFormatted}

Generate ONE realistic, deep, and thought-provoking technical interview question for this topic and difficulty level.

Criteria:
- The question should test real technical understanding, architectural depth, or language internal mechanics (e.g. event loop, memory leaks, concurrency, rendering performance, caching strategies, schema design, race conditions).
- Avoid trivial syntax questions (e.g. "What does 'var' mean?").
- Include a helpful context hint if the topic or question is complex.
- Identify 3 to 5 key concepts expected in a high-scoring response.

Output JSON matching this exact structure:
{
  "id": "q_${Date.now()}",
  "topic": "${topic}",
  "difficulty": "${difficulty}",
  "questionText": "Your concise, technical interview question text here",
  "contextHint": "Optional hint or scenario details if helpful",
  "keyConceptsExpected": ["Concept 1", "Concept 2", "Concept 3"]
}
`;
}

export function getEvaluationPrompt(
  topic: TopicId,
  difficulty: DifficultyLevel,
  questionText: string,
  keyConceptsExpected: string[],
  userAnswer: string
): string {
  return `
Evaluate this candidate's technical interview answer.

Topic: ${topic}
Target Difficulty Level: ${difficulty}
Question Asked: "${questionText}"
Key Concepts Expected: ${JSON.stringify(keyConceptsExpected)}

Candidate's Submitted Answer:
"""
${userAnswer}
"""

Evaluate the candidate's answer strictly and constructively like a Principal Engineer interviewer.

Required Analysis:
1. overallScore: Score from 0 to 10 (decimal allowed, e.g. 7.5). Be fair: a score of 9-10 is for exceptional staff-level answers; 7-8 for solid accurate answers; 4-6 for partially correct/incomplete answers; <4 for wrong or missing fundamentals.
2. criteriaBreakdown:
   - knowledge: (0-10) Awareness of concepts and terminology
   - technicalAccuracy: (0-10) Freedom from technical flaws, correct mechanics
   - clarity: (0-10) Communication style, structure, readability
   - completeness: (0-10) Coverage of key concepts, edge cases, and trade-offs
3. strengths: Bullet list of specific things the candidate explained well or correctly.
4. missingConcepts: Bullet list of important concepts, trade-offs, or mechanics the candidate failed to mention.
5. incorrectPoints: Bullet list of technically inaccurate or misleading statements made (empty array if none).
6. detailedFeedback: Constructive 2-3 paragraph summary reviewing the answer.
7. betterAnswer: A comprehensive, exemplary "ideal candidate answer" demonstrating how a Senior/Staff Engineer would answer this question concisely and thoroughly. Include code examples if relevant.
8. keyTakeaways: 3 key bullet points for the candidate to review and study.

Return ONLY valid JSON with this exact schema:
{
  "overallScore": 7.5,
  "criteriaBreakdown": {
    "knowledge": 8,
    "technicalAccuracy": 8,
    "clarity": 7,
    "completeness": 7
  },
  "strengths": ["Clear explanation of call stack", "Correctly identified async handling"],
  "missingConcepts": ["Microtask vs macrotask queue priority", "Event loop execution order"],
  "incorrectPoints": [],
  "detailedFeedback": "Your explanation started strong by framing...",
  "betterAnswer": "A strong answer would be: ...",
  "keyTakeaways": ["Review microtask queue priorities", "Understand promises vs setTimeout scheduling"]
}
`;
}
