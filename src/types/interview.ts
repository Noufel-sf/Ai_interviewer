export type TopicId =
  | "javascript"
  | "typescript"
  | "react"
  | "nodejs"
  | "nextjs"
  | "python"
  | "system-design"
  | "dsa"
  | "databases"
  | "web-performance"
  | "security"
  | "devops";

export interface TopicOption {
  id: TopicId;
  name: string;
  category: "Frontend" | "Backend" | "Architecture" | "Fundamentals" | "DevOps";
  description: string;
  iconName: string;
}

export type DifficultyLevel = "junior" | "mid" | "senior" | "lead";

export interface DifficultyOption {
  id: DifficultyLevel;
  label: string;
  description: string;
  badgeColor: string;
}

export interface InterviewSetup {
  topic: TopicId;
  difficulty: DifficultyLevel;
  questionCount: number;
}

export interface Question {
  id: string;
  topic: TopicId;
  difficulty: DifficultyLevel;
  questionText: string;
  contextHint?: string;
  keyConceptsExpected: string[];
  toolUsed?: string;
}

export interface CriteriaBreakdown {
  knowledge: number; // 0 - 10
  technicalAccuracy: number; // 0 - 10
  clarity: number; // 0 - 10
  completeness: number; // 0 - 10
}

export interface AnswerEvaluation {
  overallScore: number; // 0 - 10
  criteriaBreakdown: CriteriaBreakdown;
  strengths: string[];
  missingConcepts: string[];
  incorrectPoints: string[];
  detailedFeedback: string;
  betterAnswer: string;
  keyTakeaways: string[];
}

export interface QuestionAttempt {
  questionNumber: number;
  question: Question;
  userAnswer: string;
  evaluation: AnswerEvaluation;
  timeSpentSeconds: number;
}

export type InterviewStatus = "setup" | "question" | "evaluating" | "result" | "summary";

export interface InterviewSession {
  id: string;
  setup: InterviewSetup;
  attempts: QuestionAttempt[];
  currentQuestion: Question | null;
  currentQuestionNumber: number;
  status: InterviewStatus;
  startTime: number;
  endTime?: number;
}
