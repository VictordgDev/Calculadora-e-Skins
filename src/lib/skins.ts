export interface Skin {
  id: string;
  name: string;
  type: "free" | "premium";
  unlockType: "default" | "xp" | "purchase";
  unlockLevel?: number;
  price?: number; // em centavos
}

export const SKINS: Skin[] = [
  {
    id: "default",
    name: "Classic Dark",
    type: "free",
    unlockType: "default",
  },
  {
    id: "inverted",
    name: "Classic Light",
    type: "free",
    unlockType: "xp",
    unlockLevel: 0,
  },
  {
    id: "lv2_skin",
    name: "Midnight Blue",
    type: "free",
    unlockType: "xp",
    unlockLevel: 2,
  },
  {
    id: "lv4_skin",
    name: "Forest Matrix",
    type: "free",
    unlockType: "xp",
    unlockLevel: 4,
  },
  {
    id: "lv5_skin",
    name: "Aurora",
    type: "free",
    unlockType: "xp",
    unlockLevel: 5,
  },
  {
    id: "cyberpunk",
    name: "Neon Cyberpunk",
    type: "premium",
    unlockType: "purchase",
    price: 990, // R$ 9,90
  },
  {
    id: "retro",
    name: "Retro Windows 95",
    type: "premium",
    unlockType: "purchase",
    price: 790, // R$ 7,90
  },
  {
    id: "gold",
    name: "Gold Luxury",
    type: "premium",
    unlockType: "purchase",
    price: 1490, // R$ 14,90
  },
];

export const SKIN_MAP = Object.fromEntries(SKINS.map((s) => [s.id, s]));

export function getSkinById(id: string): Skin | undefined {
  return SKIN_MAP[id];
}
