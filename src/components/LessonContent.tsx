import type { Lesson, LessonBlock } from "../content/lessons";

interface LessonContentProps {
  lesson: Lesson;
}

function renderBlock(block: LessonBlock, index: number) {
  switch (block.type) {
    case "heading": {
      const sizes: Record<number, string> = {
        2: "text-xl sm:text-2xl mt-8 sm:mt-10 mb-3 sm:mb-4",
        3: "text-lg sm:text-xl mt-6 sm:mt-8 mb-2.5 sm:mb-3",
        4: "text-base sm:text-lg mt-5 sm:mt-6 mb-2",
      };
      const cls = `font-heading font-semibold text-text ${sizes[block.level]}`;
      if (block.level === 2) return <h2 key={index} className={cls}>{block.text}</h2>;
      if (block.level === 3) return <h3 key={index} className={cls}>{block.text}</h3>;
      return <h4 key={index} className={cls}>{block.text}</h4>;
    }

    case "paragraph":
      return (
        <p key={index} className="text-[15px] sm:text-base leading-relaxed text-text/90 mb-4">
          {block.text}
        </p>
      );

    case "list":
      if (block.ordered) {
        return (
          <ol key={index} className="list-decimal list-outside ml-5 sm:ml-6 mb-5 space-y-2">
            {block.items.map((item, i) => (
              <li key={i} className="text-[15px] sm:text-base leading-relaxed text-text/90 pl-1">
                {item}
              </li>
            ))}
          </ol>
        );
      }
      return (
        <ul key={index} className="mb-5 space-y-2 sm:space-y-2.5">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="flex gap-2.5 sm:gap-3 text-[15px] sm:text-base leading-relaxed text-text/90"
            >
              <span className="mt-[9px] sm:mt-2 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );

    case "table":
      return (
        <div key={index} className="table-wrapper">
          <table className="lesson-table">
            <thead>
              <tr>
                {block.headers.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "callout": {
      const styles: Record<string, { border: string; bg: string; icon: string; iconBg: string }> = {
        info: {
          border: "border-blue/30",
          bg: "bg-blue/5",
          icon: "💡",
          iconBg: "bg-blue/10",
        },
        warning: {
          border: "border-accent/30",
          bg: "bg-accent/5",
          icon: "⚠️",
          iconBg: "bg-accent/10",
        },
        tip: {
          border: "border-green/30",
          bg: "bg-green/5",
          icon: "✅",
          iconBg: "bg-green/10",
        },
      };
      const s = styles[block.variant];
      return (
        <div
          key={index}
          className={`rounded-lg sm:rounded-xl border-l-4 ${s.border} ${s.bg} p-4 sm:p-5 mb-5`}
        >
          <div className="flex items-start gap-2.5 sm:gap-3">
            <span
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${s.iconBg} flex items-center justify-center text-sm flex-shrink-0`}
            >
              {s.icon}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-heading font-semibold text-sm text-text mb-1">
                {block.title}
              </p>
              <p className="text-[13px] sm:text-sm leading-relaxed text-text/80">
                {block.text}
              </p>
            </div>
          </div>
        </div>
      );
    }

    case "quote":
      return (
        <blockquote
          key={index}
          className="border-l-4 border-mid-gray/40 pl-4 sm:pl-5 italic text-text/70 my-5 text-[15px] sm:text-base"
        >
          {block.text}
        </blockquote>
      );

    default:
      return null;
  }
}

export default function LessonContent({ lesson }: LessonContentProps) {
  return (
    <div className="lesson-content">
      <h1 className="font-heading font-bold text-2xl sm:text-3xl md:text-[2rem] text-text mb-2 leading-tight">
        {lesson.title}
      </h1>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-heading font-semibold">
          Урок {lesson.order}
        </span>
        <span className="text-xs text-mid-gray font-heading truncate">
          {lesson.module}
        </span>
      </div>
      <div>{lesson.content.map((block, i) => renderBlock(block, i))}</div>
    </div>
  );
}
