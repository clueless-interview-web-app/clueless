import { Skeleton } from '../ui/skeleton';

export default function QuestionsLoading({ takeSize }: { takeSize: number }) {
  return (
    <div className="flex flex-col w-full space-y-2">
      {Array.from({ length: takeSize }).map((_, idx) => (
        <div
          key={idx}
          className="flex flex-row items-center w-full px-4 py-2 border rounded shadow space-x-6"
        >
          <Skeleton className="h-12 w-5 rounded" />
          <Skeleton className="h-12 w-48 rounded" />
          <Skeleton className="h-6 w-12 rounded ml-2" />
          <Skeleton className="h-8 w-8 rounded-4xl ml-5" />
          <Skeleton className="h-8 w-20 rounded ml-5" />
          <Skeleton className="h-8 w-20 rounded ml-5" />

          <div className="flex flex-wrap gap-2 ml-auto">
            <Skeleton className="h-8 w-16 rounded-full" />
            <Skeleton className="h-8 w-16 rounded-full" />
            <Skeleton className="h-8 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
