import { ActivityForHeatmap } from '@/types/activity';
import { ActivityAPI, handleActivityAPIError } from '@/utils/api/activity-api';
import { Activity } from '@prisma/client';
import { secondsInHour } from 'date-fns/constants';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function useActivityHeatmap() {
  const [activity, setActivity] = useState<ActivityForHeatmap[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      if (session?.user?.id !== undefined) {
        try {
          const activityData = await ActivityAPI.getActivity(session.user.id);

          const mappedActivity = getActivityForHeatmap(activityData ?? []);
          setActivity(mappedActivity);
        } catch (error) {
          handleActivityAPIError(error as Error);
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, [session?.user.id]);

  return { activity, isLoading };
}

function getActivityForHeatmap(activityData: Activity[]) {
  return activityData?.map((item: Activity) => {
    const questionsValue = item.questions ?? 0;
    const secondsValue = item.seconds ?? 0;
    const value = questionsValue + Math.floor(secondsValue / secondsInHour / 2); // half an hour is 1 point + 1 point for each question

    const dateObj = new Date(item.date);
    dateObj.setDate(dateObj.getDate());
    const date = dateObj;

    return {
      date,
      value,
    };
  });
}
