import { NextRequest, NextResponse } from "next/server";
import { searchTechnicalKnowledgeBase, seedTechnicalKnowledgeBase } from "@/lib/ai/knowledgeBase";
import { globalKnowledgeVectorStore } from "@/lib/ai/vectorStore";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || searchParams.get("query") || "JavaScript microtask queue event loop";
    const topic = searchParams.get("topic") || undefined;
    const topK = parseInt(searchParams.get("topK") || "3", 10);

    // 1. Ensure knowledge base is seeded and embedded in vector store
    const totalDocs = await seedTechnicalKnowledgeBase();

    // 2. Perform Top-K semantic vector search
    const results = await searchTechnicalKnowledgeBase(query, topic, topK);

    return NextResponse.json({
      success: true,
      stage: "Stage 6 — Vector Database Search",
      query,
      filterTopic: topic || "all",
      totalDocumentsInVectorStore: totalDocs,
      topKResultsCount: results.length,
      results: results.map((r, index) => ({
        rank: index + 1,
        documentId: r.id,
        title: r.metadata.title,
        topic: r.metadata.topic,
        similarityScore: `${(r.score * 100).toFixed(1)}% (cosine: ${r.score})`,
        matchedContentSnippet: r.content,
      })),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Vector search failed";
    console.error("Vector search API error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, topic, topK = 3 } = body as { query: string; topic?: string; topK?: number };

    if (!query) {
      return NextResponse.json({ error: "query is required" }, { status: 400 });
    }

    await seedTechnicalKnowledgeBase();
    const results = await searchTechnicalKnowledgeBase(query, topic, topK);

    return NextResponse.json({
      success: true,
      query,
      results,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Vector search failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
