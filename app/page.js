// app/page.jsx
"use client";

import GameBoard from "@/components/GameBoard";
import QuestionModal from "@/components/QuestionModal";
import Scoreboard from "@/components/Scoreboard";
import { gameData } from "@/data/questions";
import confetti from "canvas-confetti";
import {
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  RotateCcw,
  Trophy,
} from "lucide-react";
import { useEffect, useState } from "react";

const INITIAL_TEAMS = [
  { id: 1, name: "Команда 1", score: 0 },
  { id: 2, name: "Команда 2", score: 0 },
  { id: 3, name: "Команда 3", score: 0 },
];

export default function Home() {
  const [teams, setTeams] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("svoya_igra_state");
        if (saved) return JSON.parse(saved).teams || INITIAL_TEAMS;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_TEAMS;
  });

  const [playedQuestions, setPlayedQuestions] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("svoya_igra_state");
        if (saved) return JSON.parse(saved).playedQuestions || [];
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [currentRoundIndex, setCurrentRoundIndex] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("svoya_igra_state");
        if (saved) return JSON.parse(saved).currentRoundIndex || 0;
      } catch (e) {
        console.error(e);
      }
    }
    return 0;
  });

  const [activeQuestion, setActiveQuestion] = useState(null);
  const [activeCategoryName, setActiveCategoryName] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Синхронизация состояния с localStorage
  useEffect(() => {
    localStorage.setItem(
      "svoya_igra_state",
      JSON.stringify({ teams, playedQuestions, currentRoundIndex }),
    );
  }, [teams, playedQuestions, currentRoundIndex]);

  // Запуск конфетти при финале
  useEffect(() => {
    if (isGameOver) {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
      });
    }
  }, [isGameOver]);

  // Переключение Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Ошибка перехода в полноэкранный режим:", err);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const currentRound = gameData.rounds[currentRoundIndex];

  // Подсчет сыгранных вопросов в текущем раунде
  const currentRoundQuestionIds =
    currentRound?.categories.flatMap((cat) => cat.questions.map((q) => q.id)) ||
    [];
  const currentRoundPlayedCount = currentRoundQuestionIds.filter((id) =>
    playedQuestions.includes(id),
  ).length;
  const currentRoundTotalCount = currentRoundQuestionIds.length;

  const handleUpdateScore = (teamId, delta) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, score: t.score + delta } : t)),
    );
  };

  const handleUpdateTeamName = (teamId, newName) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, name: newName } : t)),
    );
  };

  const handleSelectQuestion = (question, categoryName) => {
    setActiveQuestion(question);
    setActiveCategoryName(categoryName);
  };

  const handleAwardScore = (teamId, amount) => {
    handleUpdateScore(teamId, amount);
  };

  const handleCloseQuestion = () => {
    if (activeQuestion) {
      setPlayedQuestions((prev) => [...prev, activeQuestion.id]);
      setActiveQuestion(null);
      setActiveCategoryName("");
    }
  };

  const handleResetGame = () => {
    if (confirm("Вы уверены, что хотите сбросить всю игру и счёт?")) {
      setTeams(INITIAL_TEAMS);
      setPlayedQuestions([]);
      setCurrentRoundIndex(0);
      setIsGameOver(false);
      localStorage.removeItem("svoya_igra_state");
    }
  };

  const winner = [...teams].sort((a, b) => b.score - a.score)[0];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-slate-100 flex flex-col justify-between py-3 px-2 select-none">
      {/* Верхняя панель управления */}
      <header className="max-w-7xl w-full mx-auto flex items-center justify-between px-4 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-amber-500 uppercase tracking-widest">
            Своя Игра
          </span>
          <span className="bg-blue-900/60 border border-blue-600/50 text-blue-200 text-sm font-bold px-3 py-1 rounded-full">
            {currentRound?.name || "Финал"}
          </span>
          {!isGameOver && (
            <span className="text-xs font-bold text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
              Вопросы: {currentRoundPlayedCount} / {currentRoundTotalCount}
            </span>
          )}
        </div>

        {/* Навигация, Fullscreen и сброс */}
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setCurrentRoundIndex((prev) => Math.max(0, prev - 1))
            }
            disabled={currentRoundIndex === 0 || isGameOver}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 transition border border-slate-700 active:scale-95"
            title="Предыдущий раунд"
          >
            <ChevronLeft size={20} />
          </button>

          {currentRoundIndex < gameData.rounds.length - 1 ? (
            <button
              onClick={() => setCurrentRoundIndex((prev) => prev + 1)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-sm transition shadow-lg active:scale-95"
            >
              Следующий раунд <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={() => setIsGameOver(!isGameOver)}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-xl transition shadow-lg active:scale-95"
            >
              <Trophy size={18} />{" "}
              {isGameOver ? "Вернуться к табло" : "Итоги игры"}
            </button>
          )}

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition border border-slate-700 active:scale-95 ml-2"
            title="На весь экран"
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>

          <button
            onClick={handleResetGame}
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 transition border border-slate-700 active:scale-95"
            title="Сбросить игру"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </header>

      {/* Центральное поле */}
      <section className="flex-1 flex flex-col justify-center items-center my-auto">
        {isGameOver ? (
          <div className="flex flex-col items-center text-center p-8 bg-slate-900/80 border-2 border-amber-400/60 rounded-3xl backdrop-blur-xl shadow-2xl max-w-2xl w-full mx-4 animate-in zoom-in-95">
            <Trophy size={80} className="text-amber-400 mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold text-slate-300 uppercase tracking-wider mb-2">
              Победитель игры
            </h2>
            <h1 className="text-5xl md:text-6xl font-black text-amber-300 mb-4 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]">
              {winner?.name || "Команда"}
            </h1>
            <p className="text-3xl font-extrabold text-white mb-6">
              Итоговый счёт:{" "}
              <span className="text-emerald-400">{winner?.score || 0}</span>{" "}
              очков
            </p>

            <div className="grid grid-cols-3 gap-4 w-full border-t border-slate-800 pt-6">
              {teams.map((t) => (
                <div key={t.id} className="flex flex-col items-center">
                  <span className="text-slate-400 font-bold text-sm truncate max-w-[120px]">
                    {t.name}
                  </span>
                  <span className="text-2xl font-black text-white">
                    {t.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <GameBoard
            roundData={currentRound}
            playedQuestions={playedQuestions}
            onSelectQuestion={handleSelectQuestion}
          />
        )}
      </section>

      {/* Панель с командами */}
      <footer className="w-full">
        <Scoreboard
          teams={teams}
          onUpdateScore={handleUpdateScore}
          onUpdateTeamName={handleUpdateTeamName}
        />
      </footer>

      {/* Модалка активного вопроса */}
      {activeQuestion && (
        <QuestionModal
          question={activeQuestion}
          categoryName={activeCategoryName}
          teams={teams}
          onAwardScore={handleAwardScore}
          onClose={handleCloseQuestion}
        />
      )}
    </main>
  );
}
