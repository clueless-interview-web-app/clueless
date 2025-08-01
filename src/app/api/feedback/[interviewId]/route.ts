import { prismaLib } from '@/lib/prisma';
import {
  get200Response,
  get400Response,
  get404Response,
  UnknownServerError,
} from '@/utils/api/api-responses';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ interviewId: string }> }
) {
  const resolvedParams = await params;
  const interviewId = resolvedParams.interviewId;

  if (!interviewId) {
    return get400Response('Invalid interview ID');
  }

  try {
    const feedback = await prismaLib.feedback.findUnique({
      where: { interviewId },
    });

    if (!feedback) {
      return get404Response('Feedback not found');
    }
    return get200Response(feedback);
  } catch {
    return UnknownServerError;
  }
}
