// components/Scoreboard.jsx
"use client";

import { Check, Edit2, Minus, Plus } from "lucide-react";
import { useState } from "react";

export default function Scoreboard({ teams, onUpdateScore, onUpdateTeamName }) {
  const [editingId, setEditingId] = useState(null);
  const [tempName, setTempName] = useState("");

  const handleStartEdit = (team) => {
    setEditingId(team.id);
    setTempName(team.name);
  };

  const handleSaveEdit = (teamId) => {
    if (tempName.trim()) {
      onUpdateTeamName(teamId, tempName.trim());
    }
    setEditingId(null);
  };

  // Определяем максимальный балл для подсветки лидера
  const maxScore = Math.max(...teams.map((t) => t.score));

  return (
    <div className="grid grid-cols-3 gap-6 w-full max-w-7xl mx-auto p-4">
      {teams.map((team) => {
        const isLeader = team.score === maxScore && team.score > 0;
        const isNegative = team.score < 0;

        return (
          <div
            key={team.id}
            className={`relative flex flex-col items-center justify-between p-5 rounded-2xl border-2 transition-all duration-300 shadow-xl backdrop-blur-md ${
              isLeader
                ? "bg-amber-500/15 border-amber-400 shadow-amber-500/20"
                : "bg-slate-800/80 border-slate-700 hover:border-slate-500"
            }`}
          >
            {/* Название команды */}
            <div className="flex items-center justify-center gap-2 w-full mb-2">
              {editingId === team.id ? (
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleSaveEdit(team.id)
                    }
                    autoFocus
                    className="w-full bg-slate-900 border border-amber-400 text-white font-bold text-center text-xl rounded-lg px-2 py-1 outline-none"
                  />
                  <button
                    onClick={() => handleSaveEdit(team.id)}
                    className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition"
                  >
                    <Check size={18} />
                  </button>
                </div>
              ) : (
                <div
                  className="flex items-center justify-center gap-2 group cursor-pointer"
                  onClick={() => handleStartEdit(team)}
                >
                  <h3 className="text-xl md:text-2xl font-black tracking-wider text-slate-100 uppercase truncate">
                    {team.name}
                  </h3>
                  <Edit2
                    size={16}
                    className="text-slate-400 opacity-0 group-hover:opacity-100 transition"
                  />
                </div>
              )}
            </div>

            {/* Текущий счёт */}
            <div
              className={`text-4xl md:text-5xl font-black my-2 tabular-nums transition-colors ${
                isNegative
                  ? "text-rose-400"
                  : isLeader
                    ? "text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]"
                    : "text-white"
              }`}
            >
              {team.score}
            </div>

            {/* Ручная корректировка счёта (+/- 100) */}
            <div className="flex items-center gap-3 mt-3">
              <button
                onClick={() => onUpdateScore(team.id, -100)}
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-700/80 hover:bg-rose-600/80 text-rose-300 hover:text-white transition active:scale-95 border border-slate-600"
                title="Отнять 100 очков"
              >
                <Minus size={18} />
              </button>
              <button
                onClick={() => onUpdateScore(team.id, 100)}
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-700/80 hover:bg-emerald-600/80 text-emerald-300 hover:text-white transition active:scale-95 border border-slate-600"
                title="Добавить 100 очков"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
