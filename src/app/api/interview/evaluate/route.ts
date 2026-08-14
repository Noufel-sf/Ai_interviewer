import { NextRequest, NextResponse } from "next/server";
import { evaluateUserAnswer } from "@/lib/ai/gemini";
import { TopicId, DifficultyLevel } from "@/types/interview";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, difficulty, questionText, keyConceptsExpected, userAnswer } = body as {
      topic: TopicId;
      difficulty: DifficultyLevel;
      questionText: string;
      keyConceptsExpected: string[];
      userAnswer: string;
    };

    if (!topic || !difficulty || !questionText || !userAnswer) {
      return NextResponse.json(
        { error: "Missing required fields (topic, difficulty, questionText, userAnswer)." },
        { status: 400 }
      );
    }

    const evaluation = await evaluateUserAnswer(
      topic,
      difficulty,
      questionText,
      keyConceptsExpected || [],
      userAnswer
    );

    return NextResponse.json({ evaluation });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to evaluate answer";
    console.error("API /api/interview/evaluate error:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
