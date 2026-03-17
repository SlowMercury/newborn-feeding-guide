import { useEffect, useState } from "react";
import { getModules, getOrderedLessons } from "../content/lessons";

interface CourseCompleteProps {
  onReset: () => void;
}

export default function CourseComplete({ onReset }: CourseCompleteProps) {
  const totalLessons = getOrderedLessons().length;
  const totalModules = getModules().length;
  const [particles, setParticles] = useState<
    { id: number; x: number; delay: number; emoji: string; size: number }[]
  >([]);

  useEffect(() => {
    const emojis = ["🎉", "⭐", "🍼", "💛", "✨", "🎊", "💚", "🌟"];
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      size: 14 + Math.random() * 14,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="lesson-content">
      {/* Falling particles */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute animate-fall"
            style={{
              left: `${p.x}%`,
              animationDelay: `${p.delay}s`,
              fontSize: `${p.size}px`,
            }}
          >
            {p.emoji}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="text-center py-8 sm:py-12">
        <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-green/10 mb-6 animate-bounce-gentle">
          <span className="text-4xl sm:text-5xl">🏆</span>
        </div>

        <h1 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-text mb-3 leading-tight">
          Поздравляем!
        </h1>
        <p className="text-lg sm:text-xl text-text/70 font-heading mb-2">
          Вы прошли все уроки!
        </p>
        <p className="text-sm sm:text-base text-mid-gray max-w-md mx-auto leading-relaxed mb-8">
          Все {totalLessons} уроков по {totalModules} разделам пройдены.
          Вы отлично подготовились! Не забывайте, что эти материалы
          всегда доступны для повторного прочтения.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-10">
          <div className="bg-green/5 border border-green/20 rounded-xl px-5 py-3.5">
            <div className="text-2xl sm:text-3xl font-heading font-bold text-green">{totalLessons}</div>
            <div className="text-xs font-heading text-mid-gray">Уроков пройдено</div>
          </div>
          <div className="bg-accent/5 border border-accent/20 rounded-xl px-5 py-3.5">
            <div className="text-2xl sm:text-3xl font-heading font-bold text-accent">100%</div>
            <div className="text-xs font-heading text-mid-gray">Прогресс</div>
          </div>
          <div className="bg-blue/5 border border-blue/20 rounded-xl px-5 py-3.5">
            <div className="text-2xl sm:text-3xl font-heading font-bold text-blue">{totalModules}</div>
            <div className="text-xs font-heading text-mid-gray">Разделов завершено</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-light-gray text-sm font-heading font-semibold text-mid-gray hover:text-text hover:border-accent/30 hover:bg-accent/5 transition-all cursor-pointer active:scale-[0.97]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Начать заново
          </button>
        </div>
      </div>
    </div>
  );
}
