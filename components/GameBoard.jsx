// components/GameBoard.jsx
"use client";

export default function GameBoard({
  roundData,
  playedQuestions,
  onSelectQuestion,
}) {
  if (!roundData) return null;

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-3 p-4 select-none">
      {roundData.categories.map((category) => (
        <div
          key={category.id}
          className="grid grid-cols-6 gap-3 items-stretch h-20 md:h-24"
        >
          {/* Название темы (занимает 1-ю колонку) */}
          <div className="bg-gradient-to-r from-blue-950 to-blue-900 border-2 border-blue-600/60 rounded-xl flex items-center justify-center p-3 text-center shadow-lg">
            <span className="font-extrabold text-sm md:text-lg lg:text-xl text-blue-100 uppercase tracking-wide line-clamp-3">
              {category.name}
            </span>
          </div>

          {/* 5 ячеек с вопросами */}
          {category.questions.map((q) => {
            const isPlayed = playedQuestions.includes(q.id);

            return (
              <button
                key={q.id}
                disabled={isPlayed}
                onClick={() => onSelectQuestion(q, category.name)}
                className={`relative flex items-center justify-center rounded-xl border-2 font-black text-2xl md:text-4xl lg:text-5xl transition-all duration-200 shadow-md ${
                  isPlayed
                    ? "bg-slate-900/60 border-slate-800 text-transparent cursor-not-allowed opacity-30 shadow-none"
                    : "bg-blue-900/90 border-blue-500/80 text-amber-300 hover:bg-blue-800 hover:border-amber-400 hover:scale-[1.02] active:scale-95 hover:shadow-[0_0_20px_rgba(251,191,36,0.35)]"
                }`}
              >
                {!isPlayed && (
                  <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {q.cost}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
