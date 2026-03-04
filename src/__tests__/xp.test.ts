import {
  xpRequiredForLevel,
  calculateLevelUp,
  LEVEL_SKIN_REWARDS,
  XP_AMOUNTS,
} from "@/lib/xp";

describe("xpRequiredForLevel", () => {
  it("level 0 requer 10 XP", () => {
    expect(xpRequiredForLevel(0)).toBe(10);
  });

  it("level 1 requer 10 XP", () => {
    expect(xpRequiredForLevel(1)).toBe(10);
  });

  it("level 2 requer 15 XP", () => {
    expect(xpRequiredForLevel(2)).toBe(15);
  });

  it("level 3 requer 20 XP", () => {
    expect(xpRequiredForLevel(3)).toBe(20);
  });

  it("level 4 requer 25 XP", () => {
    expect(xpRequiredForLevel(4)).toBe(25);
  });

  it("level 5 requer 30 XP", () => {
    expect(xpRequiredForLevel(5)).toBe(30);
  });

  it("level 6+ requer 35 XP cada", () => {
    expect(xpRequiredForLevel(6)).toBe(35);
    expect(xpRequiredForLevel(10)).toBe(35);
    expect(xpRequiredForLevel(99)).toBe(35);
  });
});

describe("calculateLevelUp", () => {
  it("não sobe de level se XP insuficiente", () => {
    const result = calculateLevelUp(0, 5, 3);
    expect(result.leveledUp).toBe(false);
    expect(result.newLevel).toBe(0);
    expect(result.newXp).toBe(8);
  });

  it("sobe de level ao atingir o XP necessário exato", () => {
    const result = calculateLevelUp(0, 0, 10);
    expect(result.leveledUp).toBe(true);
    expect(result.newLevel).toBe(1);
    expect(result.newXp).toBe(0);
  });

  it("XP excedente não carrega ao subir de level", () => {
    const result = calculateLevelUp(0, 0, 15); // 5 de excedente
    expect(result.leveledUp).toBe(true);
    expect(result.newLevel).toBe(1);
    expect(result.newXp).toBe(0); // zera, não carrega
  });

  it("sobe de level a partir de XP acumulado", () => {
    const result = calculateLevelUp(1, 8, 5); // 8+5=13 >= 10
    expect(result.leveledUp).toBe(true);
    expect(result.newLevel).toBe(2);
    expect(result.newXp).toBe(0);
  });

  it("não sobe de level com soma exatamente abaixo do necessário", () => {
    const result = calculateLevelUp(2, 14, 0); // 14 < 15
    expect(result.leveledUp).toBe(false);
    expect(result.newLevel).toBe(2);
    expect(result.newXp).toBe(14);
  });

  it("retorna a skin correta ao subir para level que tem recompensa", () => {
    const result = calculateLevelUp(1, 0, 10); // sobe para level 2
    expect(result.leveledUp).toBe(true);
    expect(result.newLevel).toBe(2);
    expect(result.unlockedSkinId).toBe("lv2_skin");
  });

  it("não retorna skin ao subir para level sem recompensa", () => {
    const result = calculateLevelUp(0, 0, 10); // sobe para level 1 (sem skin)
    expect(result.leveledUp).toBe(true);
    expect(result.newLevel).toBe(1);
    expect(result.unlockedSkinId).toBeUndefined();
  });
});

describe("LEVEL_SKIN_REWARDS", () => {
  it("level 0 desbloqueia Classic Light (inverted)", () => {
    expect(LEVEL_SKIN_REWARDS[0]).toBe("inverted");
  });

  it("level 2 desbloqueia Midnight Blue (lv2_skin)", () => {
    expect(LEVEL_SKIN_REWARDS[2]).toBe("lv2_skin");
  });

  it("level 4 desbloqueia Forest Matrix (lv4_skin)", () => {
    expect(LEVEL_SKIN_REWARDS[4]).toBe("lv4_skin");
  });

  it("level 5 desbloqueia Aurora (lv5_skin)", () => {
    expect(LEVEL_SKIN_REWARDS[5]).toBe("lv5_skin");
  });
});

describe("XP_AMOUNTS", () => {
  it("calc_operation concede 1 XP", () => {
    expect(XP_AMOUNTS.calc_operation).toBe(1);
  });

  it("session_bonus concede 5 XP", () => {
    expect(XP_AMOUNTS.session_bonus).toBe(5);
  });

  it("daily_login concede 10 XP", () => {
    expect(XP_AMOUNTS.daily_login).toBe(10);
  });

  it("welcome_bonus concede 20 XP", () => {
    expect(XP_AMOUNTS.welcome_bonus).toBe(20);
  });
});
