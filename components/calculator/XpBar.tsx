"use client";

import { xpRequiredForLevel } from "@/lib/skins";

interface XpBarProps {
  xp: number;
  level: number;
  compact?: boolean;
}

export function XpBar({ xp, level, compact = false }: XpBarProps) {
  const required = xpRequiredForLevel(level);
  const percentage = Math.min((xp / required) * 100, 100);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono font-bold text-orange-400">Lv {level}</span>
        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-500 rounded-full transition-all duration-700"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-xs text-zinc-500 font-mono">{xp}/{required}</span>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold font-display text-white">Nível {level}</span>
        <span className="text-xs text-zinc-400 font-mono">{xp} / {required} XP</span>
      </div>
      <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-zinc-500">
        {required - xp} XP para o próximo nível
      </p>
    </div>
  );
}
