import { useState, useRef, useEffect } from "react";
import { getModules, getOrderedLessons } from "../content/lessons";
import ProgressBar from "./ProgressBar";
import SearchBox from "./SearchBox";

interface SidebarProps {
  activeLessonId: string;
  completedLessons: Set<string>;
  onNavigate: (id: string) => void;
  onResetProgress: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  activeLessonId,
  completedLessons,
  onNavigate,
  onResetProgress,
  isOpen,
  onClose,
}: SidebarProps) {
  const modules = getModules();
  const totalLessons = getOrderedLessons().length;

  // Find which module the active lesson belongs to
  const activeModule = modules.find((m) =>
    m.lessons.some((l) => l.id === activeLessonId)
  );

  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(activeModule ? [activeModule.name] : [modules[0]?.name])
  );

  // Auto-expand the module of the active lesson when it changes
  useEffect(() => {
    const currentModule = modules.find((m) =>
      m.lessons.some((l) => l.id === activeLessonId)
    );
    if (currentModule) {
      setExpandedModules((prev) => {
        if (prev.has(currentModule.name)) return prev;
        const next = new Set(prev);
        next.add(currentModule.name);
        return next;
      });
    }
  }, [activeLessonId]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const touchStartX = useRef<number | null>(null);

  function toggleModule(name: string) {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }

  function handleLessonClick(id: string) {
    onNavigate(id);
    onClose();
  }

  function handleResetConfirm() {
    onResetProgress();
    setShowResetConfirm(false);
  }

  // Swipe left to close sidebar on mobile
  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartX.current !== null) {
        const deltaX = e.changedTouches[0].clientX - touchStartX.current;
        if (deltaX < -60) {
          onClose();
        }
        touchStartX.current = null;
      }
    };

    sidebar.addEventListener("touchstart", handleTouchStart, { passive: true });
    sidebar.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      sidebar.removeEventListener("touchstart", handleTouchStart);
      sidebar.removeEventListener("touchend", handleTouchEnd);
    };
  }, [onClose]);

  // Scroll active lesson into view when sidebar opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const activeEl = sidebarRef.current?.querySelector('[data-active="true"]');
        activeEl?.scrollIntoView({ block: "center", behavior: "smooth" });
      }, 300);
    }
  }, [isOpen]);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 h-full z-50 no-print
          w-[280px] sm:w-[300px] bg-bg-sidebar border-r border-light-gray
          flex flex-col
          transition-transform duration-300 ease-in-out
          md:translate-x-0 md:z-10
          ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
        `}
        aria-label="Навигация по курсу"
      >
        {/* Header */}
        <div className="px-4 sm:px-5 py-4 sm:py-5 border-b border-light-gray flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">🍼</span>
            </div>
            <div className="min-w-0">
              <h1 className="font-heading font-bold text-sm text-text leading-tight">
                Гид по кормлению
              </h1>
              <p className="font-heading text-[11px] text-mid-gray">
                новорождённого
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="md:hidden w-11 h-11 rounded-lg hover:bg-light-gray flex items-center justify-center transition-colors cursor-pointer active:scale-95"
            aria-label="Закрыть меню"
          >
            <svg className="w-5 h-5 text-mid-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-4 sm:px-5 pt-3 sm:pt-4 pb-1 flex-shrink-0">
          <SearchBox onNavigate={(id) => handleLessonClick(id)} onClose={onClose} />
        </div>

        {/* Progress */}
        <div className="flex-shrink-0">
          <ProgressBar completedLessons={completedLessons} />
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto sidebar-scroll py-2 sm:py-3" aria-label="Уроки">
          {modules.map((module) => {
            const isExpanded = expandedModules.has(module.name);
            const moduleCompleted = module.lessons.filter((l) =>
              completedLessons.has(l.id)
            ).length;
            const allDone = moduleCompleted === module.lessons.length;

            return (
              <div key={module.name} className="mb-1">
                {/* Module header */}
                <button
                  onClick={() => toggleModule(module.name)}
                  className="w-full flex items-center gap-2.5 px-4 sm:px-5 py-3 text-left hover:bg-light-gray/50 transition-colors cursor-pointer group active:bg-light-gray/70"
                  aria-expanded={isExpanded}
                >
                  <svg
                    className={`w-3.5 h-3.5 text-mid-gray transition-transform duration-200 flex-shrink-0 ${
                      isExpanded ? "rotate-90" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <span className="font-heading font-semibold text-xs text-text block truncate">
                      {module.name}
                    </span>
                    <span className="font-heading text-[10px] text-mid-gray">
                      {moduleCompleted}/{module.lessons.length} уроков
                    </span>
                  </div>
                  {allDone && (
                    <span className="w-5 h-5 rounded-full bg-green flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </button>

                {/* Lessons */}
                {isExpanded && (
                  <div className="pb-1">
                    {module.lessons.map((lesson) => {
                      const isActive = lesson.id === activeLessonId;
                      const isDone = completedLessons.has(lesson.id);

                      return (
                        <button
                          key={lesson.id}
                          data-active={isActive}
                          onClick={() => handleLessonClick(lesson.id)}
                          className={`
                            w-full flex items-center gap-3 pl-9 sm:pl-10 pr-4 sm:pr-5 py-2.5 sm:py-2 text-left
                            transition-all duration-150 cursor-pointer text-[13px]
                            active:scale-[0.98]
                            ${
                              isActive
                                ? "bg-accent/8 text-accent font-semibold border-r-3 border-accent"
                                : "text-text/70 hover:text-text hover:bg-light-gray/40"
                            }
                          `}
                          aria-current={isActive ? "page" : undefined}
                        >
                          {/* Status indicator */}
                          <span className="flex-shrink-0">
                            {isDone ? (
                              <span className="w-[18px] h-[18px] rounded-full bg-green flex items-center justify-center">
                                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </span>
                            ) : isActive ? (
                              <span className="w-[18px] h-[18px] rounded-full border-2 border-accent flex items-center justify-center">
                                <span className="w-2 h-2 rounded-full bg-accent" />
                              </span>
                            ) : (
                              <span className="w-[18px] h-[18px] rounded-full border-2 border-mid-gray/40" />
                            )}
                          </span>
                          <span className="truncate font-heading">{lesson.title}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer with reset */}
        <div className="px-4 sm:px-5 py-3 sm:py-4 border-t border-light-gray flex-shrink-0 safe-bottom">
          {completedLessons.size > 0 && (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 mb-2 rounded-lg text-[11px] font-heading font-medium text-mid-gray hover:text-accent hover:bg-accent/5 border border-transparent hover:border-accent/20 transition-all cursor-pointer active:scale-[0.98]"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Сбросить прогресс
            </button>
          )}
          <p className="text-[10px] text-mid-gray font-heading text-center">
            {completedLessons.size === totalLessons
              ? "🏆 Все уроки пройдены!"
              : `${modules.length} разделов • ${totalLessons} уроков`}
          </p>
        </div>
      </aside>

      {/* Reset confirmation dialog */}
      {showResetConfirm && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 dialog-overlay"
          onClick={() => setShowResetConfirm(false)}
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-bg rounded-2xl border border-light-gray shadow-2xl max-w-sm w-full p-6 dialog-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 mb-4">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="font-heading font-bold text-lg text-text mb-2">
                Сбросить прогресс?
              </h3>
              <p className="text-sm text-mid-gray leading-relaxed">
                Все отметки о пройденных уроках будут удалены.
                Это действие нельзя отменить.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-light-gray text-sm font-heading font-semibold text-text hover:bg-light-gray/50 transition-all cursor-pointer active:scale-[0.97]"
              >
                Отмена
              </button>
              <button
                onClick={handleResetConfirm}
                className="flex-1 px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-heading font-semibold hover:bg-accent-hover transition-all cursor-pointer active:scale-[0.97]"
              >
                Сбросить
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
