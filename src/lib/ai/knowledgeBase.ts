import { getBatchEmbeddings } from "./embeddings";
import { globalKnowledgeVectorStore, QueryResult } from "./vectorStore";

export interface KnowledgeDocument {
  id: string;
  title: string;
  topic: string;
  difficulty: "junior" | "mid" | "senior" | "lead";
  category: string;
  tags: string[];
  content: string;
}

/**
 * Curated Technical Engineering Knowledge Base.
 * These documents serve as the foundational truth for grounding our AI Interviewer evaluations in Stage 6 & 7.
 */
export const TECHNICAL_KNOWLEDGE_DOCUMENTS: KnowledgeDocument[] = [
  // JavaScript Runtime & Concurrency
  {
    id: "js-event-loop-microtasks",
    title: "JavaScript Event Loop, Call Stack & Microtask Priority",
    topic: "javascript",
    difficulty: "senior",
    category: "runtime-internals",
    tags: ["event-loop", "microtasks", "macrotasks", "promises", "call-stack"],
    content: `The JavaScript runtime is single-threaded with a synchronous Call Stack.
Asynchronous execution is orchestrated by the Event Loop via two main queues:
1. Microtask Queue: Handles Promise callbacks (.then, .catch, .finally), async/await continuations, and queueMicrotask(). Microtasks take absolute priority: after the current synchronous execution completes and before rendering or executing the next macrotask, the microtask queue is drained completely, including microtasks scheduled while processing microtasks (which can cause starvation).
2. Macrotask (Task) Queue: Handles setTimeout, setInterval, setImmediate, and I/O callbacks. The event loop picks exactly one macrotask per tick, then drains the entire microtask queue before rendering.`,
  },
  {
    id: "js-memory-leaks-closures",
    title: "Closures, Lexical Scope & V8 Memory Management",
    topic: "javascript",
    difficulty: "senior",
    category: "memory-management",
    tags: ["closures", "memory-leaks", "garbage-collection", "v8", "weakmap"],
    content: `A closure is the combination of a function bundled together with references to its surrounding lexical environment.
In V8 engine, closures retain references to variables in the outer scope through the scope chain.
Common Memory Leak Patterns:
1. Accidental global variables (unscoped assignments).
2. Retained closure references: when an outer function returns an inner function that holds a reference to a large object, preventing garbage collection via Mark-and-Sweep.
3. Forgotten intervals/event listeners that retain callbacks referencing outer components.
4. Detached DOM nodes retained in JavaScript memory references. Use WeakMap or WeakSet for garbage-collectable associations.`,
  },

  // React Architecture & Reconciliation
  {
    id: "react-fiber-reconciliation",
    title: "React Fiber Architecture, Reconciliation & Keys",
    topic: "react",
    difficulty: "senior",
    category: "frontend-architecture",
    tags: ["fiber", "reconciliation", "virtual-dom", "keys", "rendering"],
    content: `React Fiber is a complete rewrite of React's reconciliation engine that enables incremental rendering and concurrency.
Key Mechanics:
1. Double-Buffering: Fiber maintains two trees in memory — 'current' (rendered on screen) and 'workInProgress' (being assembled asynchronously).
2. Reconciliation (Diffing): Compares elements by type and key. If an element type changes, React destroys the old subtree.
3. Importance of Keys: Keys provide stable identity across renders. Using array index as key breaks state association when elements are prepended, removed, or sorted, causing incorrect component state retention and wasteful DOM mutations.
4. Immutability: React relies on shallow reference equality (Object.is) in setState. Mutating arrays/objects in place retains the same pointer reference, causing React to skip reconciliation.`,
  },
  {
    id: "react-concurrency-server-components",
    title: "React 19 Server Components, Suspense & Streaming SSR",
    topic: "react",
    difficulty: "senior",
    category: "frontend-architecture",
    tags: ["rsc", "server-components", "suspense", "streaming", "hydration"],
    content: `React Server Components (RSC) execute exclusively on the server during the build or request time, outputting a serialized JSON-like component tree rather than shipping JavaScript bundles to the browser.
Key distinctions:
- Server Components have zero impact on client bundle size, can directly query databases and access filesystem secrets.
- Client Components ('use client') run on both server (for SSR HTML) and client (for interactivity, useState, useEffect).
- Streaming SSR with Suspense allows chunked HTTP streaming where critical UI renders immediately and slow async boundaries stream in progressively without blocking the initial paint.`,
  },

  // Node.js Backend & Scalability
  {
    id: "node-event-loop-libuv",
    title: "Node.js libuv Event Loop Phases & Backpressure",
    topic: "nodejs",
    difficulty: "senior",
    category: "backend-internals",
    tags: ["libuv", "event-loop", "streams", "backpressure", "process.nextTick"],
    content: `Node.js uses libuv to handle asynchronous non-blocking I/O via a multi-phase event loop:
1. Timers phase: executes callbacks scheduled by setTimeout and setInterval.
2. Pending callbacks: executes I/O callbacks deferred from previous iterations.
3. Poll phase: retrieves new I/O events and executes their callbacks.
4. Check phase: executes setImmediate callbacks.
5. Close callbacks: handles socket/handle destruction.
Crucial Distinction: process.nextTick() queue is processed immediately after the current operation finishes, before any phase of the event loop.
Streams & Backpressure: When writing to a writable stream faster than it can consume, write() returns false. The producer must pause and listen for the 'drain' event to prevent memory bloat.`,
  },

  // System Design & Distributed Systems
  {
    id: "sys-caching-strategies",
    title: "Distributed Caching Strategies, Invalidation & Thundering Herd",
    topic: "system-design",
    difficulty: "senior",
    category: "distributed-systems",
    tags: ["caching", "redis", "cache-aside", "thundering-herd", "write-through"],
    content: `Distributed caching (e.g. Redis, Memcached) reduces database latency and handles high read throughput.
Caching Patterns:
1. Cache-Aside (Lazy Loading): Application queries cache first; on miss, queries DB and populates cache. Potential stale reads until TTL expires.
2. Write-Through: Data is written to cache and DB simultaneously. Ensures consistency but adds write latency.
3. Write-Behind (Write-Back): Data is written to cache immediately, DB updated asynchronously. Fast writes but risk of data loss on cache crash.
Cache Problems & Mitigations:
- Cache Stampede / Thundering Herd: When a popular key expires, hundreds of concurrent requests hit the DB simultaneously. Solved with mutex locking, probabilistic early expiration (XFetch), or background refresh.
- Cache Penetration: Requests for non-existent keys bypass cache. Solved using Bloom filters or caching null results.`,
  },
  {
    id: "sys-rate-limiting-algorithms",
    title: "Rate Limiting Algorithms & Distributed Token Buckets",
    topic: "system-design",
    difficulty: "senior",
    category: "distributed-systems",
    tags: ["rate-limiting", "token-bucket", "sliding-window", "redis", "scalability"],
    content: `Rate limiting protects APIs from abuse, DoS attacks, and cascading failures.
Core Algorithms:
1. Token Bucket: Tokens added to a bucket at fixed rate up to capacity. Allows bursts up to bucket size. Highly memory-efficient.
2. Leaky Bucket: Requests enter a queue and process at constant outflow rate. Smooths out traffic bursts.
3. Fixed Window Counter: Simple counter per time window (e.g. 100 req/min). Suffers from edge bursts at window boundaries.
4. Sliding Window Log / Counter: Tracks timestamps or weighted sums of adjacent windows to provide accurate rate limiting across arbitrary time slices.
In distributed environments, use Redis with Lua scripts to guarantee atomic token decrement operations.`,
  },

  // Databases & Storage
  {
    id: "db-indexing-acid-transactions",
    title: "Database B-Tree Indexing, ACID Isolation & Sharding",
    topic: "databases",
    difficulty: "senior",
    category: "database-internals",
    tags: ["indexing", "b-tree", "acid", "isolation-levels", "sharding"],
    content: `Relational database performance relies heavily on indexing and transaction isolation.
Mechanics:
1. B-Tree vs Hash Index: B-Tree maintains balanced sorted tree structures with O(log N) lookups, range queries, and sorting. Hash indexes offer O(1) exact lookups but cannot support range queries.
2. Composite Indexes: Leftmost prefix rule applies — an index on (A, B, C) can satisfy queries on (A) or (A, B) but not (B, C) alone.
3. ACID Isolation Levels:
   - Read Uncommitted: Allows dirty reads.
   - Read Committed: Prevents dirty reads using row locks or snapshot reads.
   - Repeatable Read: Prevents non-repeatable reads using MVCC (Multi-Version Concurrency Control).
   - Serializable: Full isolation using strict two-phase locking or serialization graph checking.`,
  },
];

let isSeeded = false;

/**
 * Initializes the vector database by embedding and indexing all technical knowledge documents.
 * Automatically runs once upon startup or first query.
 */
export async function seedTechnicalKnowledgeBase(): Promise<number> {
  if (isSeeded && globalKnowledgeVectorStore.count() > 0) {
    return globalKnowledgeVectorStore.count();
  }

  console.log(`[Stage 6: Vector DB] Ingesting & embedding ${TECHNICAL_KNOWLEDGE_DOCUMENTS.length} knowledge documents...`);

  // Extract texts to embed
  const textsToEmbed = TECHNICAL_KNOWLEDGE_DOCUMENTS.map(
    (doc) => `${doc.title}\n\n${doc.content}`
  );

  // Generate embeddings in batch via gemini-embedding-001
  const embeddings = await getBatchEmbeddings(textsToEmbed);

  // Index into vector store
  TECHNICAL_KNOWLEDGE_DOCUMENTS.forEach((doc, idx) => {
    globalKnowledgeVectorStore.upsert({
      id: doc.id,
      content: doc.content,
      vector: embeddings[idx],
      metadata: {
        title: doc.title,
        topic: doc.topic,
        difficulty: doc.difficulty,
        category: doc.category,
        tags: doc.tags,
      },
    });
  });

  isSeeded = true;
  console.log(`[Stage 6: Vector DB] Successfully indexed ${globalKnowledgeVectorStore.count()} documents into VectorStore!`);
  return globalKnowledgeVectorStore.count();
}

/**
 * Performs a semantic Top-K vector search against the technical knowledge base.
 */
export async function searchTechnicalKnowledgeBase(
  query: string,
  topic?: string,
  topK: number = 2
): Promise<QueryResult<{ title: string; topic: string; difficulty: string; category: string; tags: string[] }>[]> {
  await seedTechnicalKnowledgeBase();

  return globalKnowledgeVectorStore.queryByText(query, {
    topK,
    minScore: 0.35,
    filter: topic ? { topic } : undefined,
  });
}
