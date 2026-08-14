# AI Interview Coach — Project Instructions

## 1. Project Overview

We are building an AI-powered technical interview preparation platform.

The application simulates a technical interview where the user selects a technical topic and difficulty level, receives an AI-generated interview question, submits an answer, and receives a structured evaluation from an LLM.

The goal is not to build a generic chatbot.

The goal is to build a serious technical interview practice platform that evaluates candidates similarly to a real software engineering interviewer.

---

# 2. Core User Flow

The main flow is:

User
→ Select interview topic
→ Select difficulty
→ Start interview
→ AI generates interview question
→ User answers
→ AI evaluates answer
→ Show score and detailed feedback
→ Show missing concepts
→ Show improved answer
→ Continue to next question
→ Finish interview
→ Show final interview results

Example:

User selects:

Topic:
JavaScript

Difficulty:
Senior

AI asks:

"Explain how the JavaScript event loop works and describe the difference between microtasks and macrotasks."

User answers:

"The event loop allows JavaScript to handle asynchronous operations..."

The AI evaluates:

Score: 7.5/10

Knowledge: 8/10
Technical Accuracy: 8/10
Clarity: 7/10
Completeness: 7/10

Strengths:
- Correctly explained the call stack.
- Understands asynchronous execution.

Missing concepts:
- Microtasks
- Macrotasks
- Event loop scheduling

Feedback:
"..."

Better answer:
"..."

---

# 3. Main Goal

The application should teach the user while interviewing them.

The AI should not simply say:

"Correct."

or:

"Wrong."

It should explain:

1. What the candidate understood.
2. What was technically correct.
3. What was technically incorrect.
4. What concepts were missing.
5. How the answer could be improved.
6. What a strong interview answer would look like.

The application should help users become better software engineers and better interview candidates.

---

# 4. Target Users

The target user is NOT a complete beginner.

The application is primarily for developers who already know programming fundamentals and want to:

- revise technical concepts
- practice interview questions
- identify knowledge gaps
- improve technical explanations
- prepare for junior/mid/senior interviews
- practice system design
- improve communication during technical interviews

The content should therefore focus on real engineering concepts rather than extremely basic programming questions.

---

# 5. Technology Stack

Use the following stack unless there is a strong technical reason not to.

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

## Backend

Use Next.js App Router Route Handlers.

Example:

`src/app/api/.../route.ts`

## AI

- Google Gemini API
- `@google/genai`

## Validation

- Zod

## Database

MongoDB will be added later.

Do NOT add database complexity before the basic AI interview flow works.

## Authentication

Authentication will be added later.

Do NOT implement authentication during the initial MVP unless explicitly requested.

---

# 6. Current Project Status

The Next.js project has already been created.

The initial architecture has already been generated.

The project should follow this structure:

```text
src/
│
├── app/
│   ├── page.tsx
│   │
│   ├── interview/
│   │   └── page.tsx
│   │
│   └── api/
│       └── interview/
│           ├── question/
│           │   └── route.ts
│           │
│           └── evaluate/
│               └── route.ts
│
├── components/
│   └── interview/
│       ├── InterviewSetup.tsx
│       ├── InterviewQuestion.tsx
│       ├── AnswerEditor.tsx
│       ├── EvaluationResult.tsx
│       └── InterviewProgress.tsx
│
├── lib/
│   ├── ai/
│   │   ├── gemini.ts
│   │   ├── prompts.ts
│   │   └── schemas.ts
│   │
│   └── db/
│
└── types/
    └── interview.ts