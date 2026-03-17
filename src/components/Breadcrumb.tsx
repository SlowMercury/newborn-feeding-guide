import type { Lesson } from "../content/lessons";

interface BreadcrumbProps {
  lesson: Lesson;
}

export default function Breadcrumb({ lesson }: BreadcrumbProps) {
  return (
    <nav
      className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-mid-gray mb-5 sm:mb-6 font-body overflow-hidden"
      aria-label="Breadcrumb"
    >
      <span className="font-heading font-medium whitespace-nowrap text-mid-gray/80 hidden sm:inline">
        {lesson.module}
      </span>
      {/* Show abbreviated module name on small screens */}
      <span className="font-heading font-medium whitespace-nowrap text-mid-gray/80 sm:hidden truncate max-w-[100px]">
        {lesson.module}
      </span>
      <svg
        className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-mid-gray/60 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
      <span className="text-text font-medium truncate">{lesson.title}</span>
    </nav>
  );
}
