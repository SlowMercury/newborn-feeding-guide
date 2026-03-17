import type { Lesson } from "../content/lessons";

interface LessonNavProps {
  prev: Lesson | null;
  next: Lesson | null;
  onNavigate: (id: string) => void;
}

export default function LessonNav({ prev, next, onNavigate }: LessonNavProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4 mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-light-gray">
      {prev ? (
        <button
          onClick={() => onNavigate(prev.id)}
          className="group flex-1 flex flex-col items-start p-4 rounded-xl border border-light-gray hover:border-accent/40 hover:bg-accent/5 active:scale-[0.98] transition-all duration-200 text-left cursor-pointer"
        >
          <span className="text-xs font-heading font-semibold text-mid-gray uppercase tracking-wide mb-1 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Назад
          </span>
          <span className="text-sm font-heading font-semibold text-text group-hover:text-accent transition-colors line-clamp-2">
            {prev.title}
          </span>
        </button>
      ) : (
        <div className="flex-1 hidden sm:block" />
      )}
      {next ? (
        <button
          onClick={() => onNavigate(next.id)}
          className="group flex-1 flex flex-col items-end p-4 rounded-xl border border-light-gray hover:border-accent/40 hover:bg-accent/5 active:scale-[0.98] transition-all duration-200 text-right cursor-pointer"
        >
          <span className="text-xs font-heading font-semibold text-mid-gray uppercase tracking-wide mb-1 flex items-center gap-1">
            Далее
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
          <span className="text-sm font-heading font-semibold text-text group-hover:text-accent transition-colors line-clamp-2">
            {next.title}
          </span>
        </button>
      ) : (
        <div className="flex-1 hidden sm:block" />
      )}
    </div>
  );
}
