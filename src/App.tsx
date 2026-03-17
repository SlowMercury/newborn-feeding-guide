import { useState, useCallback, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar";
import Breadcrumb from "./components/Breadcrumb";
import LessonContent from "./components/LessonContent";
import LessonNav from "./components/LessonNav";
import MarkComplete from "./components/MarkComplete";
import CourseComplete from "./components/CourseComplete";
import ToastContainer, { type ToastData } from "./components/Toast";
import {
  getLessonById,
  getOrderedLessons,
  getAdjacentLessons,
} from "./content/lessons";

const STORAGE_KEY = "newborn-guide-completed";
const LESSON_KEY = "newborn-guide-active-lesson";

function loadCompleted(): Set<string> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return new Set(JSON.parse(stored));
  } catch {}
  return new Set();
}

function saveCompleted(set: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

function loadActiveLesson(): string {
  try {
    const stored = localStorage.getItem(LESSON_KEY);
    if (stored) return stored;
  } catch {}
  return getOrderedLessons()[0]?.id ?? "";
}

let toastIdCounter = 0;

export default function App() {
  const [activeLessonId, setActiveLessonId] = useState(loadActiveLesson);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(loadCompleted);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [showCourseComplete, setShowCourseComplete] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const touchStartX = useRef<number | null>(null);

  const allLessons = getOrderedLessons();
  const totalLessons = allLessons.length;
  const lesson = getLessonById(activeLessonId) ?? allLessons[0];
  const { prev, next } = getAdjacentLessons(lesson.id);

  // Check if all lessons are complete
  useEffect(() => {
    if (completedLessons.size === totalLessons && totalLessons > 0) {
      // Small delay so the last toast appears first
      const timer = setTimeout(() => setShowCourseComplete(true), 800);
      return () => clearTimeout(timer);
    } else {
      setShowCourseComplete(false);
    }
  }, [completedLessons.size, totalLessons]);

  const addToast = useCallback((message: string, type: ToastData["type"] = "success") => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const navigate = useCallback((id: string) => {
    setActiveLessonId(id);
    setShowCourseComplete(false);
    localStorage.setItem(LESSON_KEY, id);
    const isMobile = window.innerWidth < 768;
    window.scrollTo({ top: 0, behavior: isMobile ? "instant" : "smooth" });
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setCompletedLessons((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        addToast("Отметка снята", "info");
      } else {
        next.add(id);
        const newCount = next.size;
        if (newCount === totalLessons) {
          addToast("Все уроки пройдены! 🏆", "celebration");
        } else {
          const remaining = totalLessons - newCount;
          addToast(
            `Урок пройден! Осталось ${remaining} ${remaining === 1 ? "урок" : remaining < 5 ? "урока" : "уроков"}`,
            "success"
          );
        }
      }
      saveCompleted(next);
      return next;
    });
  }, [addToast, totalLessons]);

  const resetProgress = useCallback(() => {
    setCompletedLessons(new Set());
    localStorage.removeItem(STORAGE_KEY);
    setShowCourseComplete(false);
    addToast("Прогресс сброшен", "info");
  }, [addToast]);

  // Close sidebar on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add("sidebar-open");
    } else {
      document.body.classList.remove("sidebar-open");
    }
    return () => document.body.classList.remove("sidebar-open");
  }, [sidebarOpen]);

  // Swipe right from left edge to open sidebar on mobile
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch.clientX < 30 && !sidebarOpen) {
        touchStartX.current = touch.clientX;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartX.current !== null) {
        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - touchStartX.current;
        if (deltaX > 60) {
          setSidebarOpen(true);
        }
        touchStartX.current = null;
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [sidebarOpen]);

  // Keyboard shortcut: Ctrl+K to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        // Open sidebar on mobile and focus search
        if (window.innerWidth < 768) {
          setSidebarOpen(true);
        }
        setTimeout(() => {
          const searchInput = document.querySelector<HTMLInputElement>('[aria-label="Поиск по урокам"]');
          searchInput?.focus();
        }, 100);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="min-h-screen bg-bg">
      {/* Sidebar */}
      <Sidebar
        activeLessonId={lesson.id}
        completedLessons={completedLessons}
        onNavigate={navigate}
        onResetProgress={resetProgress}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Mobile header */}
      <header className="fixed top-0 left-0 right-0 z-30 md:hidden bg-bg/95 backdrop-blur-md border-b border-light-gray safe-top no-print">
        <div className="flex items-center gap-3 px-4 py-2.5">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-11 h-11 rounded-xl bg-bg-sidebar border border-light-gray flex items-center justify-center cursor-pointer hover:bg-light-gray active:scale-95 transition-all"
            aria-label="Открыть меню"
          >
            <svg className="w-5 h-5 text-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="text-lg">🍼</span>
            <div className="min-w-0">
              <span className="font-heading font-bold text-sm text-text block truncate">
                Гид по кормлению
              </span>
              <span className="font-heading text-[10px] text-mid-gray block truncate">
                {lesson.title}
              </span>
            </div>
          </div>
          {/* Progress indicator in header */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-full border-2 border-light-gray flex items-center justify-center relative">
              <svg className="w-8 h-8 absolute -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18" cy="18" r="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="text-light-gray"
                />
                <circle
                  cx="18" cy="18" r="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeDasharray={`${(completedLessons.size / totalLessons) * 88} 88`}
                  strokeLinecap="round"
                  className="text-green transition-all duration-500"
                />
              </svg>
              <span className="text-[9px] font-heading font-bold text-text relative z-10">
                {completedLessons.size}/{totalLessons}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main ref={mainRef} className="md:ml-[300px] min-h-screen">
        <div className="max-w-[760px] mx-auto px-4 sm:px-6 md:px-10 pt-[72px] md:pt-12 pb-12 md:pb-16 safe-bottom">
          {showCourseComplete ? (
            <CourseComplete onReset={resetProgress} />
          ) : (
            <>
              <Breadcrumb lesson={lesson} />
              <LessonContent lesson={lesson} />

              <div className="mt-8 md:mt-10 flex flex-col items-center gap-3">
                <MarkComplete
                  lessonId={lesson.id}
                  isComplete={completedLessons.has(lesson.id)}
                  onToggle={toggleComplete}
                />
                {/* Auto-advance hint */}
                {completedLessons.has(lesson.id) && next && (
                  <button
                    onClick={() => navigate(next.id)}
                    className="flex items-center gap-1.5 text-xs font-heading font-medium text-accent hover:text-accent-hover transition-colors cursor-pointer animate-fade-in"
                  >
                    Перейти к следующему уроку
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>

              <LessonNav prev={prev} next={next} onNavigate={navigate} />
            </>
          )}
        </div>
      </main>

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
