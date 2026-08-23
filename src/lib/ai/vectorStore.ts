import { cosineSimilarity, getEmbedding } from "./embeddings";

export interface VectorRecord<TMetadata = Record<string, unknown>> {
  id: string;
  content: string;
  vector: number[];
  metadata: TMetadata;
}

export interface VectorQueryOptions<TMetadata = Record<string, unknown>> {
  topK?: number;
  minScore?: number; // Minimum cosine similarity threshold (e.g. 0.4)
  filter?: Partial<TMetadata> | ((metadata: TMetadata) => boolean);
}

export interface QueryResult<TMetadata = Record<string, unknown>> {
  id: string;
  content: string;
  metadata: TMetadata;
  score: number; // Cosine similarity: 1.0 (identical) to -1.0 (opposite)
}

/**
 * Stage 6: Persistent In-Memory / Hybrid Vector Database
 * Manages high-dimensional embeddings, metadata indexing, and top-K similarity search.
 */
export class VectorStore<TMetadata extends Record<string, unknown> = Record<string, unknown>> {
  private records: Map<string, VectorRecord<TMetadata>> = new Map();

  /**
   * Upsert a single vector document into the database.
   */
  public upsert(record: VectorRecord<TMetadata>): void {
    this.records.set(record.id, record);
  }

  /**
   * Upsert multiple vector documents in batch.
   */
  public upsertBatch(records: VectorRecord<TMetadata>[]): void {
    for (const record of records) {
      this.records.set(record.id, record);
    }
  }

  /**
   * Check if a document exists by ID.
   */
  public has(id: string): boolean {
    return this.records.has(id);
  }

  /**
   * Get total number of indexed vector records.
   */
  public count(): number {
    return this.records.size;
  }

  /**
   * Retrieve all records in the store.
   */
  public getAll(): VectorRecord<TMetadata>[] {
    return Array.from(this.records.values());
  }

  /**
   * Perform Top-K Approximate Nearest Neighbor (ANN) search using a raw vector.
   */
  public queryByVector(
    queryVector: number[],
    options: VectorQueryOptions<TMetadata> = {}
  ): QueryResult<TMetadata>[] {
    const { topK = 3, minScore = 0.3, filter } = options;
    const candidates: QueryResult<TMetadata>[] = [];

    for (const record of this.records.values()) {
      // 1. Apply metadata filtering if specified
      if (filter) {
        if (typeof filter === "function") {
          if (!filter(record.metadata)) continue;
        } else {
          let matches = true;
          for (const key of Object.keys(filter)) {
            if (record.metadata[key] !== filter[key]) {
              matches = false;
              break;
            }
          }
          if (!matches) continue;
        }
      }

      // 2. Compute Cosine Similarity between query vector and candidate vector
      const score = cosineSimilarity(queryVector, record.vector);

      if (score >= minScore) {
        candidates.push({
          id: record.id,
          content: record.content,
          metadata: record.metadata,
          score: Math.round(score * 1000) / 1000,
        });
      }
    }

    // 3. Sort by cosine similarity descending and return Top-K
    candidates.sort((a, b) => b.score - a.score);
    return candidates.slice(0, topK);
  }

  /**
   * Perform semantic search directly from a query string.
   * Embeds the query text and searches top-K nearest documents.
   */
  public async queryByText(
    queryText: string,
    options: VectorQueryOptions<TMetadata> = {}
  ): Promise<QueryResult<TMetadata>[]> {
    if (!queryText.trim()) return [];
    const queryVector = await getEmbedding(queryText);
    return this.queryByVector(queryVector, options);
  }

  /**
   * Clears all records from the store.
   */
  public clear(): void {
    this.records.clear();
  }
}

// Global singleton instance for the technical interview knowledge base
export const globalKnowledgeVectorStore = new VectorStore<{
  title: string;
  topic: string;
  difficulty: string;
  category: string;
  tags: string[];
}>();
