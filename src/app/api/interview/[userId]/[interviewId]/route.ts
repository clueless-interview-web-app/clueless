import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import PRISMA_ERROR_CODES from '@/constants/prisma-error-codes';
import { prismaLib } from '@/lib/prisma';
import {
  ForbiddenError,
  get200Response,
  get400Response,
  get404Response,
  UnknownServerError,
} from '@/utils/api/api-responses';
import { errorLog } from '@/utils/logger';
import { Prisma } from '@prisma/client';
import { getServerSession } from 'next-auth';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string; interviewId: string }> }
) {
  const resolvedParams = await params;
  const userId = Number(resolvedParams.userId);
  const interviewId = resolvedParams.interviewId;

  if (isNaN(userId)) {
    return get400Response('Invalid user ID');
  }
  if (!interviewId) {
    return get400Response('Invalid interview ID');
  }

  let session;
  try {
    session = await getServerSession(authOptions);
  } catch {
    return UnknownServerError;
  }
  
  if (session?.user.id !== userId) {
    return ForbiddenError;
  }

  try {
    const interview = await prismaLib.interview.findUnique({
      where: { id: interviewId, userId },
    });

    if (!interview) {
      return get404Response('Interview not found');
    }

    return get200Response(interview);
  } catch (error) {
    errorLog('Error in getting a specific interview request: ' + error);
    return UnknownServerError;
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ userId: string; interviewId: string }> }
) {
  const resolvedParams = await params;
  const userId = Number(resolvedParams.userId);
  const interviewId = resolvedParams.interviewId;
  if (isNaN(userId)) {
    return get400Response('Invalid user ID');
  }

  if (!interviewId) {
    return get400Response('Invalid interview ID');
  }

  let session;
  try {
    session = await getServerSession(authOptions);
  } catch {
    return UnknownServerError;
  }
  if (session?.user.id !== userId) {
    return ForbiddenError;
  }

  try {
    const deletedInterview = await prismaLib.interview.delete({
      where: { id: interviewId, userId },
    });
    return get200Response(deletedInterview);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === PRISMA_ERROR_CODES.RECORD_NOT_FOUND // Record to delete does not exist
    ) {
      return get404Response('Interview not found');
    } else {
      errorLog('Error deleting interview: ' + error);
      return UnknownServerError;
    }
  }
}
