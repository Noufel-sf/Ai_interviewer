# AI Interview Coach — Learning Mode Instructions

## My Goal

I am building this project because I want to learn AI engineering step by step.

I am already a full-stack developer, so I do NOT need basic explanations of:

- React
- Next.js
- TypeScript
- REST APIs
- CRUD
- basic backend architecture

My goal is to understand how modern AI applications are actually built.

I want this project to take me from:

LLM APIs
→ Prompt Engineering
→ Structured Outputs
→ Function Calling
→ Embeddings
→ Vector Databases
→ RAG

I want to understand each concept by implementing it in the project.

Do NOT jump directly to advanced AI concepts.

---

# The Project

I am building an AI Interview Coach.

The application simulates a technical interviewer.

The user selects:

- Topic
- Difficulty

Example:

Topic:
JavaScript

Difficulty:
Senior

The AI generates an interview question.

The user answers the question.

The AI evaluates the answer and returns:

- Overall score
- Knowledge score
- Technical accuracy
- Clarity
- Completeness
- Strengths
- Missing concepts
- Feedback
- Better answer

Then the user can continue to the next question.

Eventually the application should support complete interview sessions and personalized interviews.

---

# My Learning Path

The application should evolve through several AI engineering stages.

Do not implement everything at once.

I want to learn each stage before moving to the next one.

---

# Stage 1 — LLM APIs

First I want to understand how to communicate with an LLM.

We are using:

Google Gemini API
@google/genai

I want to understand:

- What an LLM API is
- How requests are constructed
- How prompts are sent
- How model responses are returned
- Model configuration
- Temperature
- Token limits
- System instructions
- User prompts
- API errors
- Rate limits
- API costs

In this stage the application should simply be able to:

User
↓
Next.js API route
↓
Gemini
↓
Response
↓
Frontend

Do not introduce RAG, embeddings, vector databases, or agents yet.

---

# Stage 2 — Prompt Engineering

After understanding basic LLM API calls, teach me how to design good prompts.

The Interview Coach needs prompts for:

1. Question generation
2. Answer evaluation
3. Better answer generation

Teach me concepts such as:

- System instructions
- Context
- Constraints
- Few-shot examples
- Output requirements
- Role prompting
- Evaluation criteria
- Prompt consistency
- Prompt injection considerations

For example:

Instead of simply:

"Generate a JavaScript interview question."

we should build a structured prompt containing:

- topic
- difficulty
- candidate level
- interview context
- question requirements
- restrictions

I want to understand WHY the prompt is structured that way.

---

# Stage 3 — Structured Outputs

Next I want to learn how to make the LLM return predictable structured data.

Instead of receiving:

"The candidate did well..."

I want something like:

{
  "score": 7.5,
  "knowledge": 8,
  "technicalAccuracy": 8,
  "clarity": 7,
  "completeness": 7,
  "strengths": [],
  "missingConcepts": [],
  "feedback": "...",
  "betterAnswer": "..."
}

Use:

- Gemini structured output
- JSON schema
- Zod

The important concept I want to understand is:

LLM
↓
Structured response
↓
Validation
↓
Application logic

Explain why we should NOT blindly trust LLM output.

Teach me:

- JSON schema
- structured generation
- schema validation
- invalid AI output
- type safety
- handling malformed responses

---

# Stage 4 — Function Calling / Tool Calling

After structured outputs work, introduce function calling.

I want to understand the difference between:

LLM generating text

and:

LLM deciding that it needs to call a tool.

For example, eventually the interviewer could have tools such as:

- getPreviousInterview()
- getCandidateWeakTopics()
- getQuestionHistory()
- saveEvaluation()
- searchKnowledgeBase()

Example flow:

User
↓
LLM
↓
"I need the candidate's previous performance"
↓
Tool call
↓
Application executes function
↓
Tool result
↓
LLM
↓
Final response

Teach me:

- What function calling is
- Why it exists
- Tool definitions
- Arguments
- Tool execution
- Returning tool results
- Multi-step tool calls
- Security considerations

Do not build a complex agent yet.

Start with one simple tool.

---

# Stage 5 — Embeddings

Once I understand LLMs and tool calling, introduce embeddings.

I want to understand what an embedding actually is.

Teach me:

Text
↓
Embedding model
↓
Vector

Explain:

- Why text can be represented as vectors
- Semantic similarity
- Dimensions
- Similarity search
- Cosine similarity
- Why embeddings are useful for AI applications

Use a small practical example.

For example:

"JavaScript event loop"

should be semantically closer to:

"microtasks and macrotasks"

than:

"CSS flexbox."

Then implement embeddings in the project.

---

# Stage 6 — Vector Database

After understanding embeddings, introduce a vector database.

I want to understand:

Normal database:

SQL/MongoDB
↓
Find records using exact fields

Vector database:

Embedding
↓
Similarity search
↓
Semantically relevant documents

Teach me:

- What a vector database is
- Why MongoDB/PostgreSQL alone may not be enough for semantic search
- Vectors
- Metadata
- Similarity search
- Top-K results
- Filtering
- Indexing
- Distance metrics

We can eventually use a vector database such as:

- Pinecone
- Qdrant
- Weaviate
- pgvector

Choose a practical option for this project and explain why.

Do not blindly install multiple vector databases.

Use ONE.

--- 

# Stage 7 — RAG

This is the major milestone.

After I understand:

LLM APIs
+
Prompt Engineering
+
Structured Outputs
+
Function Calling
+
Embeddings
+
Vector Databases

teach me RAG.

The Interview Coach should eventually use a technical knowledge base.

Possible sources:

- JavaScript documentation
- TypeScript documentation
- React documentation
- Next.js documentation
- System Design concepts
- Backend concepts
- Database concepts
- AI concepts

The RAG pipeline should look like:

Documents
↓
Chunking
↓
Embeddings
↓
Vector Database
↓
User question
↓
Query embedding
↓
Similarity search
↓
Relevant chunks
↓
Prompt with retrieved context
↓
Gemini
↓
Answer

I want to understand every step.

---

# RAG Features I Eventually Want

The AI interviewer should be able to use the knowledge base when:

Generating questions.

Evaluating answers.

Explaining missing concepts.

Generating better answers.

For example:

Candidate answers:

"Microtasks run after the current JavaScript code finishes."

The system retrieves relevant documentation about:

- Event loop
- Call stack
- Microtasks
- Macrotasks

Then Gemini evaluates the candidate's answer using that retrieved context.

This should make evaluations more grounded.

---

# Important Learning Rule

DO NOT hide the AI concepts behind abstractions.

For example, don't just create:

```ts
generateInterviewQuestion()