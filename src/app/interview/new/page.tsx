import InterviewLoading from '@/components/interview/interview-loading';
import InterviewQuestionPage from '@/components/interview/interview-question-page';
import {
  handleQuestionsAPIError,
  QuestionsAPI,
} from '@/utils/api/questions-api';
import { Question } from '@prisma/client';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default async function NewInterviewPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const numberOfQuestions = 3586;
  const interviewId = uuidv4();

  const randomQuestionId = Math.floor(Math.random() * numberOfQuestions) + 1;

  const resolvedSearchParams = await searchParams;
  const questionNumberParam = resolvedSearchParams['questionNumber'];
  const questionNumber = Array.isArray(questionNumberParam)
    ? questionNumberParam[0]
    : questionNumberParam;

  const questionId = questionNumber ?? randomQuestionId;

  let question: Question;
  try {
    question = await QuestionsAPI.getQuestionById(Number(questionId));
    if (question == null) {
      redirect('/interview');
    }
  } catch (error) {
    handleQuestionsAPIError(error as Error, 'While getting specific question');
    redirect('/interview');
  }

  return (
    <Suspense fallback={<InterviewLoading />}>
      <InterviewQuestionPage question={question} interviewId={interviewId} />
    </Suspense>
  );
}
