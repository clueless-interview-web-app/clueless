import { DifficultyEnum } from '@/constants/difficulties';
import { Company, InterviewType, Topic } from '@prisma/client';
import { Message } from './message';
import { Nullable } from './util';

export interface Interview {
  code: string;
  codeLanguage: string;
  completed: boolean;
  createdAt: string;
  id: string;
  messages: Array<Message>;
  questionNumber: number;
  updatedAt: string;
  userId: number;
  question: { difficulty: 1 | 2 | 3; title: string };
  feedback?: {
    feedbackNumber: number;
  };
  type: InterviewType;
}

// For generating recommendations
export interface InterviewWithFeedback {
  updatedAt: Date;
  questionNumber: number;
  question: {
    topics: Topic[];
    difficulty: DifficultyEnum;
    companies: Company[];
  };
  feedback: Nullable<{
    id: string;
    interviewId: string;
    feedback: string;
    feedbackNumber: number;
  }>;
}
