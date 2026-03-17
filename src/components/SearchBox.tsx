import { useState, useRef, useEffect, useCallback } from "react";
import { searchLessons, type SearchResult } from "../content/lessons";

interface SearchBoxProps {
  onNavigate: (id: string) => void;
  onClose?: () => void;
}

export default function SearchBox({ onNavigate, onClose }: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        const found = searchLessons(query);
        setResults(found);
        setIsOpen(true);
        setActiveIndex(-1);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = useCallback(
    (result: SearchResult) => {
      onNavigate(result.lesson.id);
      setQuery("");
      setResults([]);
      setIsOpen(false);
      onClose?.();
    },
    [onNavigate, onClose]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < results.length) {
          handleSelect(results[activeIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  // Scroll active result into view
  useEffect(() => {
    if (activeIndex >= 0) {
      const el = containerRef.current?.querySelector(`[data-result-index="${activeIndex}"]`);
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  function highlightSnippet(snippet: string, matchStart: number, matchEnd: number) {
    if (matchStart < 0 || matchEnd > snippet.length) {
      return <span>{snippet}</span>;
    }
    return (
      <>
        <span>{snippet.slice(0, matchStart)}</span>
        <mark className="bg-accent/20 text-accent font-semibold rounded-sm px-0.5">
          {snippet.slice(matchStart, matchEnd)}
        </mark>
        <span>{snippet.slice(matchEnd)}</span>
      </>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Search input */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mid-gray pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Поиск по урокам…"
          className="w-full pl-9 pr-8 py-2.5 rounded-lg bg-bg border border-light-gray text-sm text-text placeholder:text-mid-gray/60 font-heading focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
          aria-label="Поиск по урокам"
          aria-expanded={isOpen}
          aria-controls="search-results"
          role="combobox"
          aria-autocomplete="list"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full hover:bg-light-gray flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Очистить поиск"
          >
            <svg className="w-3.5 h-3.5 text-mid-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {isOpen && (
        <div
          id="search-results"
          role="listbox"
          className="absolute top-full left-0 right-0 mt-1.5 bg-bg rounded-xl border border-light-gray shadow-lg max-h-[320px] overflow-y-auto z-50"
        >
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <div className="text-2xl mb-2">🔍</div>
              <p className="text-sm text-mid-gray font-heading">
                Ничего не найдено по запросу «{query}»
              </p>
              <p className="text-xs text-mid-gray/60 font-heading mt-1">
                Попробуйте другие ключевые слова
              </p>
            </div>
          ) : (
            <div className="py-1.5">
              <div className="px-3 py-1.5">
                <span className="text-[10px] font-heading font-semibold text-mid-gray uppercase tracking-wide">
                  Найдено: {results.length} {results.length === 1 ? "результат" : results.length < 5 ? "результата" : "результатов"}
                </span>
              </div>
              {results.map((result, index) => (
                <button
                  key={result.lesson.id}
                  data-result-index={index}
                  role="option"
                  aria-selected={index === activeIndex}
                  onClick={() => handleSelect(result)}
                  className={`w-full text-left px-3 py-2.5 cursor-pointer transition-colors ${
                    index === activeIndex
                      ? "bg-accent/8"
                      : "hover:bg-light-gray/50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-heading font-semibold text-accent truncate">
                      {result.lesson.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-mid-gray/70 font-heading mb-1 truncate">
                    {result.lesson.module}
                  </p>
                  <p className="text-xs text-text/70 leading-relaxed line-clamp-2">
                    {highlightSnippet(result.snippet, result.matchStart, result.matchEnd)}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
