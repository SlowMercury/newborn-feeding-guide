import { getOrderedLessons } from "../content/lessons";

interface ProgressBarProps {
  completedLessons: Set<string>;
}

export default function ProgressBar({ completedLessons }: ProgressBarProps) {
  const total = getOrderedLessons().length;
  const completed = completedLessons.size;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-light-gray">
      <div className="flex items-center justify-between mb-2">
        <span className="font-heading text-[10px] sm:text-xs font-semibold text-mid-gray uppercase tracking-wide">
          Прогресс
        </span>
        <span className="font-heading text-[10px] sm:text-xs font-semibold text-text">
          {completed} из {total} ({percent}%)
        </span>
      </div>
      <div className="w-full h-2 bg-light-gray rounded-full overflow-hidden">
        <div
          className="h-full bg-green rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${percent}% завершено`}
        />
      </div>
    </div>
  );
}
