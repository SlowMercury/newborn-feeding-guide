interface MarkCompleteProps {
  lessonId: string;
  isComplete: boolean;
  onToggle: (id: string) => void;
}

export default function MarkComplete({ lessonId, isComplete, onToggle }: MarkCompleteProps) {
  return (
    <button
      onClick={() => onToggle(lessonId)}
      className={`
        group flex items-center justify-center gap-3 
        w-full sm:w-auto
        px-6 py-3.5 sm:py-3 rounded-xl font-heading font-semibold text-sm
        transition-all duration-200 cursor-pointer
        active:scale-[0.97]
        ${
          isComplete
            ? "bg-green-light text-green border-2 border-green/30 hover:bg-green/10"
            : "bg-accent text-white border-2 border-accent hover:bg-accent-hover shadow-sm hover:shadow-md"
        }
      `}
    >
      {isComplete ? (
        <>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Урок пройден
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="9" />
          </svg>
          Отметить как пройденный
        </>
      )}
    </button>
  );
}
