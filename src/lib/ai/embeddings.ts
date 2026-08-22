import { GoogleGenAI } from "@google/genai";

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
 * Generates an embedding vector for a single piece of text using `gemini-embedding-001`.
 * Returns an array of floating point numbers (3072 dimensions).
 */
export async function getEmbedding(text: string): Promise<number[]> {
  const client = getGeminiClient();

  const response = await client.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
  });

  const embedding = response.embeddings?.[0]?.values;
  if (!embedding || embedding.length === 0) {
    throw new Error("Failed to generate embedding: empty embedding returned.");
  }

  return embedding;
}

/**
 * Generates embeddings for multiple texts in a single batch request using `gemini-embedding-001`.
 */
export async function getBatchEmbeddings(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];
  const client = getGeminiClient();

  const response = await client.models.embedContent({
    model: "gemini-embedding-001",
    contents: texts,
  });

  const embeddings = response.embeddings?.map((e) => e.values || []) || [];
  if (embeddings.length !== texts.length) {
    throw new Error("Mismatch in batch embeddings response count.");
  }

  return embeddings;
}

/**
 * Computes Cosine Similarity between two high-dimensional vectors.
 * Returns a value between -1.0 and 1.0 (typically 0.0 to 1.0 for embeddings).
 * 1.0 = identical semantic meaning
 * 0.0 = completely unrelated / orthogonal
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error(`Vector dimension mismatch: ${vecA.length} vs ${vecB.length}`);
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
  if (magnitude === 0) return 0;

  return dotProduct / magnitude;
}

export interface ConceptCoverageResult {
  concept: string;
  similarity: number;
  covered: boolean;
}

/**
 * Evaluates semantic coverage of expected key concepts in a candidate's answer using embeddings.
 * A threshold of >= 0.55 indicates the candidate touched upon the concept semantically.
 */
export async function evaluateConceptCoverage(
  userAnswer: string,
  expectedConcepts: string[],
  coverageThreshold: number = 0.55
): Promise<ConceptCoverageResult[]> {
  if (!expectedConcepts || expectedConcepts.length === 0 || !userAnswer.trim()) {
    return [];
  }

  // 1. Embed the user's answer and all expected concepts
  const allTexts = [userAnswer, ...expectedConcepts];
  const allEmbeddings = await getBatchEmbeddings(allTexts);

  const answerEmbedding = allEmbeddings[0];
  const conceptEmbeddings = allEmbeddings.slice(1);

  // 2. Compute similarity for each expected concept
  return expectedConcepts.map((concept, idx) => {
    const similarity = cosineSimilarity(answerEmbedding, conceptEmbeddings[idx]);
    const roundedSim = Math.round(similarity * 100) / 100;
    return {
      concept,
      similarity: roundedSim,
      covered: roundedSim >= coverageThreshold,
    };
  });
}
