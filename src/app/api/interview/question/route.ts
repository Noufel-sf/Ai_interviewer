import { NextRequest, NextResponse } from "next/server";
import { generateInterviewQuestion } from "@/lib/ai/gemini";
import { TopicId, DifficultyLevel, QuestionAttempt } from "@/types/interview";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, difficulty, previousQuestions, attempts } = body as {
      topic: TopicId;
      difficulty: DifficultyLevel;
      previousQuestions?: string[];
      attempts?: QuestionAttempt[];
    };

    if (!topic || !difficulty) {
      return NextResponse.json(
        { error: "Topic and difficulty level are required." },
        { status: 400 }
      );
    }

    const question = await generateInterviewQuestion(
      topic,
      difficulty,
      previousQuestions || [],
      attempts || []
    );

    return NextResponse.json({ question });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to generate interview question";
    console.error("API /api/interview/question error:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
