export type SkinId =
  | "default"
  | "inverted"
  | "cyberpunk"
  | "retro"
  | "gold"
  | "lv2_skin"
  | "lv4_skin"
  | "lv5_skin";

export interface Skin {
  id: SkinId;
  name: string;
  description: string;
  type: "free_default" | "free_xp" | "premium";
  unlockLevel?: number; // for free_xp skins
  price?: number;       // in BRL cents, for premium skins
  preview: {
    bg: string;
    display: string;
    buttons: string;
    accent: string;
  };
}

export const SKINS: Record<SkinId, Skin> = {
  default: {
    id: "default",
    name: "Classic Dark",
    description: "A calculadora original. Preta, precisa, sem firula.",
    type: "free_default",
    preview: {
      bg: "bg-zinc-900",
      display: "bg-zinc-800 text-white",
      buttons: "bg-zinc-700 hover:bg-zinc-600 text-white",
      accent: "bg-orange-500 hover:bg-orange-400 text-white",
    },
  },
  inverted: {
    id: "inverted",
    name: "Classic Light",
    description: "O inverso perfeito. Branca com teclas pretas.",
    type: "free_xp",
    unlockLevel: 0,
    preview: {
      bg: "bg-zinc-100",
      display: "bg-white text-zinc-900 border border-zinc-200",
      buttons: "bg-zinc-200 hover:bg-zinc-300 text-zinc-900",
      accent: "bg-zinc-900 hover:bg-zinc-800 text-white",
    },
  },
  cyberpunk: {
    id: "cyberpunk",
    name: "Neon Cyberpunk",
    description: "Neón, glitch e vibes de 2077.",
    type: "premium",
    price: 990, // R$ 9,90
    preview: {
      bg: "bg-[#0d0d1a]",
      display: "bg-[#0a0a15] text-[#00ff9f] border border-[#00ff9f]/30",
      buttons: "bg-[#1a1a2e] hover:bg-[#16213e] text-[#00b4d8] border border-[#00b4d8]/20",
      accent: "bg-[#ff00ff] hover:bg-[#cc00cc] text-white",
    },
  },
  retro: {
    id: "retro",
    name: "Retro Windows 95",
    description: "Nostalgia pura. Clica no botão OK.",
    type: "premium",
    price: 790, // R$ 7,90
    preview: {
      bg: "bg-[#c0c0c0]",
      display: "bg-white text-black border-2 border-t-white border-l-white border-b-zinc-700 border-r-zinc-700",
      buttons: "bg-[#c0c0c0] hover:bg-[#d4d0c8] text-black border-2 border-t-white border-l-white border-b-zinc-600 border-r-zinc-600",
      accent: "bg-[#000080] hover:bg-[#0000aa] text-white",
    },
  },
  gold: {
    id: "gold",
    name: "Gold Luxury",
    description: "Porque você merece calcular com estilo.",
    type: "premium",
    price: 1490, // R$ 14,90
    preview: {
      bg: "bg-[#1a1200]",
      display: "bg-[#0d0900] text-[#ffd700] border border-[#b8860b]",
      buttons: "bg-[#2a1f00] hover:bg-[#3d2e00] text-[#ffd700] border border-[#b8860b]/40",
      accent: "bg-gradient-to-b from-[#ffd700] to-[#b8860b] hover:from-[#ffe033] hover:to-[#d4a017] text-black",
    },
  },
  lv2_skin: {
    id: "lv2_skin",
    name: "Midnight Blue",
    description: "Azul profundo para quem calcula de madrugada.",
    type: "free_xp",
    unlockLevel: 2,
    preview: {
      bg: "bg-[#0a1628]",
      display: "bg-[#0d1f3c] text-[#93c5fd] border border-[#1e40af]/30",
      buttons: "bg-[#1e3a5f] hover:bg-[#2d5282] text-[#bfdbfe]",
      accent: "bg-[#3b82f6] hover:bg-[#2563eb] text-white",
    },
  },
  lv4_skin: {
    id: "lv4_skin",
    name: "Forest Matrix",
    description: "Verde terminal. A natureza encontra o código.",
    type: "free_xp",
    unlockLevel: 4,
    preview: {
      bg: "bg-[#0a1a0a]",
      display: "bg-[#061006] text-[#00ff41] border border-[#00ff41]/20",
      buttons: "bg-[#0d1f0d] hover:bg-[#122112] text-[#00cc33]",
      accent: "bg-[#00aa22] hover:bg-[#008818] text-black",
    },
  },
  lv5_skin: {
    id: "lv5_skin",
    name: "Aurora",
    description: "Gradientes de aurora boreal na sua calculadora.",
    type: "free_xp",
    unlockLevel: 5,
    preview: {
      bg: "bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]",
      display: "bg-[#ffffff10] text-white border border-white/20 backdrop-blur-sm",
      buttons: "bg-[#ffffff08] hover:bg-[#ffffff18] text-white border border-white/10",
      accent: "bg-gradient-to-r from-[#a78bfa] to-[#818cf8] hover:from-[#7c3aed] hover:to-[#6366f1] text-white",
    },
  },
};

// XP required to reach each level from the previous one
export const XP_PER_LEVEL: Record<number, number> = {
  0: 10,  // 10 calculations to reach Lv 0
  1: 10,
  2: 15,
  3: 20,
  4: 25,
  5: 30,
  6: 35,
};

export function xpRequiredForLevel(level: number): number {
  return XP_PER_LEVEL[level] ?? 35;
}

export function getSkinRewardForLevel(level: number): SkinId | null {
  const rewards: Record<number, SkinId> = {
    0: "inverted",
    2: "lv2_skin",
    4: "lv4_skin",
    5: "lv5_skin",
  };
  return rewards[level] ?? null;
}
