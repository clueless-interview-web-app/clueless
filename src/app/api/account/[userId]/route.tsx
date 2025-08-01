import PRISMA_ERROR_CODES from '@/constants/prisma-error-codes';
import { prismaLib } from '@/lib/prisma';
import {
  ForbiddenError,
  get200Response,
  get400Response,
  UnknownServerError,
} from '@/utils/api/api-responses';
import { Prisma } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const resolvedParams = await params;

  const userId = Number(resolvedParams.userId);

  if (isNaN(userId)) {
    return get400Response('Invalid user ID');
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
    const deletedAccount = await prismaLib.user.delete({
      where: { id: userId },
    });

    return get200Response(deletedAccount);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === PRISMA_ERROR_CODES.RECORD_NOT_FOUND // User not found
    ) {
      return get400Response('User with that userId not found');
    }
    return UnknownServerError;
  }
}
