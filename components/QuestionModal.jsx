// components/QuestionModal.jsx
"use client";

import { sounds } from "@/utils/sound";
import {
  Check,
  Clock,
  Eye,
  EyeOff,
  Flame,
  Gift,
  Maximize2,
  Minus,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function QuestionModal({
  question,
  categoryName,
  teams,
  onAwardScore,
  onClose,
}) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [customCost, setCustomCost] = useState(question?.cost || 0);
  const [isEditingCost, setIsEditingCost] = useState(false);
  const [fullscreenImageSrc, setFullscreenImageSrc] = useState(null);

  // Состояние таймера
  const DEFAULT_TIME = 20;
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Звук при открытии
  useEffect(() => {
    if (question?.special) {
      sounds.playSpecial();
    } else {
      sounds.playSelect();
    }
  }, [question]);

  // Логика таймера
  useEffect(() => {
    if (!isTimerRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimerRunning(false);
          sounds.playTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerRunning]);

  const handleCorrect = useCallback(
    (teamId) => {
      sounds.playCorrect();
      onAwardScore(teamId, customCost);
    },
    [customCost, onAwardScore],
  );

  const handleWrong = useCallback(
    (teamId) => {
      sounds.playWrong();
      onAwardScore(teamId, -customCost);
    },
    [customCost, onAwardScore],
  );

  if (!question) return null;

  const progressPercent = (timeLeft / DEFAULT_TIME) * 100;

  // Если открыт ответ и у вопроса есть answerImage — показываем его, иначе исходный src
  const currentDisplayedImage =
    showAnswer && question.answerImage ? question.answerImage : question.src;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-slate-950/95 backdrop-blur-xl p-6 md:p-8 animate-in fade-in duration-200">
      {/* Верхняя шапка */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-xl md:text-2xl font-black text-blue-400 uppercase tracking-wide">
            {categoryName}
          </span>
          <div className="flex items-center gap-2">
            {isEditingCost ? (
              <input
                type="number"
                value={customCost}
                onChange={(e) => setCustomCost(Number(e.target.value))}
                onBlur={() => setIsEditingCost(false)}
                autoFocus
                className="w-28 bg-slate-900 border border-amber-400 text-amber-300 text-2xl font-black text-center rounded-lg px-2 py-0.5 outline-none"
              />
            ) : (
              <span
                onClick={() => setIsEditingCost(true)}
                title="Кликните для изменения ставки"
                className="bg-amber-500/20 border border-amber-400/50 text-amber-300 text-2xl font-black px-4 py-1 rounded-xl cursor-pointer hover:border-amber-300 transition"
              >
                {customCost} очков
              </span>
            )}
          </div>

          {question.special === "cat" && (
            <span className="flex items-center gap-1.5 bg-purple-600/30 border border-purple-400 text-purple-200 px-3 py-1 rounded-xl font-bold animate-pulse">
              <Gift size={18} /> Кот в мешке
            </span>
          )}
          {question.special === "auction" && (
            <span className="flex items-center gap-1.5 bg-rose-600/30 border border-rose-400 text-rose-200 px-3 py-1 rounded-xl font-bold animate-pulse">
              <Flame size={18} /> Вопрос-Аукцион
            </span>
          )}
        </div>

        {/* Таймер + Закрытие */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-2xl">
            <Clock
              size={18}
              className={
                timeLeft <= 5 && isTimerRunning
                  ? "text-rose-400 animate-spin"
                  : "text-slate-400"
              }
            />
            <span
              className={`text-xl font-black tabular-nums ${
                timeLeft <= 5 ? "text-rose-400" : "text-white"
              }`}
            >
              {timeLeft}с
            </span>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 transition"
              title="Старт/Пауза"
            >
              {isTimerRunning ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button
              onClick={() => {
                setIsTimerRunning(false);
                setTimeLeft(DEFAULT_TIME);
              }}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"
              title="Сброс таймера"
            >
              <RotateCcw size={16} />
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-2xl transition border border-slate-700 active:scale-95"
            title="Закрыть вопрос"
          >
            <X size={26} />
          </button>
        </div>
      </div>

      {/* Полоса таймера */}
      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-2">
        <div
          className={`h-full transition-all duration-1000 ${
            timeLeft <= 5 ? "bg-rose-500" : "bg-blue-500"
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Контентная зона */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto w-full my-4 text-center overflow-y-auto px-4">
        {/* Картинка вопроса или картинка ответа */}
        {(question.type === "image" || (showAnswer && question.answerImage)) &&
          currentDisplayedImage && (
            <div className="relative group mb-4 max-h-[44vh] rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl bg-black/40">
              <img
                src={currentDisplayedImage}
                alt="Иллюстрация"
                className="max-h-[44vh] w-auto object-contain mx-auto cursor-pointer transition duration-300 group-hover:scale-[1.01]"
                onClick={() => setFullscreenImageSrc(currentDisplayedImage)}
              />
              {/* Кнопка поверх картинки для раскрытия на весь экран */}
              <button
                onClick={() => setFullscreenImageSrc(currentDisplayedImage)}
                className="absolute top-3 right-3 p-2.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition shadow-lg border border-slate-600/60"
                title="Открыть картинку на весь экран"
              >
                <Maximize2 size={20} />
              </button>
              {showAnswer && question.answerImage && (
                <span className="absolute bottom-3 left-3 bg-emerald-600/90 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-lg backdrop-blur-sm shadow">
                  Картинка-Ответ
                </span>
              )}
            </div>
          )}

        {/* Аудио */}
        {question.type === "audio" && question.src && (
          <div className="mb-4 flex flex-col items-center gap-3 p-5 bg-slate-900 border border-slate-700 rounded-3xl shadow-xl w-full max-w-md">
            <div className="flex items-center gap-3 text-amber-400 font-bold text-lg">
              <Volume2 size={24} className="animate-bounce" /> Аудиозапись
            </div>
            <audio controls src={question.src} className="w-full" />
          </div>
        )}

        {/* Текст вопроса */}
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white leading-none drop-shadow-md">
          {question.question}
        </h2>

        {/* Текстовый ответ */}
        {showAnswer && question.answer && (
          <div className="mt-5 p-4 bg-emerald-950/60 border-2 border-emerald-500/80 rounded-2xl max-w-3xl w-full animate-in zoom-in-95 duration-200">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-1">
              Правильный ответ:
            </span>
            <p className="text-2xl md:text-3xl font-black text-emerald-200">
              {question.answer}
            </p>
          </div>
        )}
      </div>

      {/* Нижняя панель */}
      <div className="border-t border-slate-800 pt-4 flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl mx-auto w-full">
        <button
          onClick={() => setShowAnswer(!showAnswer)}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-lg transition shadow-lg active:scale-95 ${
            showAnswer
              ? "bg-slate-800 text-slate-300 border border-slate-700"
              : "bg-blue-600 hover:bg-blue-500 text-white"
          }`}
        >
          {showAnswer ? <EyeOff size={22} /> : <Eye size={22} />}
          {showAnswer ? "Скрыть ответ" : "Показать ответ"}
        </button>

        <div className="grid grid-cols-3 gap-4 w-full md:w-auto">
          {teams.map((team) => (
            <div
              key={team.id}
              className="flex flex-col items-center bg-slate-900/90 border border-slate-700 rounded-2xl p-2.5 px-4 shadow-md"
            >
              <span className="text-sm font-bold text-slate-300 truncate max-w-[120px] mb-1.5">
                {team.name}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleWrong(team.id)}
                  className="flex items-center justify-center p-2 rounded-xl bg-rose-950/60 hover:bg-rose-600 border border-rose-700 text-rose-300 hover:text-white transition active:scale-95"
                  title={`Отнять ${customCost} у ${team.name}`}
                >
                  <Minus size={18} />
                </button>
                <button
                  onClick={() => handleCorrect(team.id)}
                  className="flex items-center justify-center p-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-600 border border-emerald-700 text-emerald-300 hover:text-white transition active:scale-95"
                  title={`Прибавить ${customCost} команде ${team.name}`}
                >
                  <Check size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Полноэкранный просмотрщик картинки (LightBox) */}
      {fullscreenImageSrc && (
        <div
          onClick={() => setFullscreenImageSrc(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 md:p-8 animate-in fade-in zoom-in-95 duration-200 cursor-zoom-out"
        >
          {/* Крестик закрытия картинки */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFullscreenImageSrc(null);
            }}
            className="absolute top-6  right-6 p-4 bg-slate-800/90 hover:bg-slate-700 text-white rounded-full transition border border-slate-600 shadow-2xl cursor-pointer"
            title="Закрыть изображение"
          >
            <X size={32} />
          </button>

          <img
            src={fullscreenImageSrc}
            alt="Полноэкранное изображение"
            className="max-h-[92vh] max-w-[92vw] object-contain rounded-xl shadow-2xl select-none zoom-120"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
