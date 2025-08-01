import { READABLE_TOPICS } from '@/constants/topics';
import { Question } from '@prisma/client';
import { Badge } from '../ui/badge';

export default function TopicsBadges({
  topics,
}: {
  topics: Question['topics'];
}) {
  return (
    <div className="flex flex-wrap gap-2 ml-auto">
      {topics.map((topic: string) => (
        <Badge key={topic} className="px-2 py-1 rounded-full text-sm">
          {READABLE_TOPICS[topic]}
        </Badge>
      ))}
    </div>
  );
}
