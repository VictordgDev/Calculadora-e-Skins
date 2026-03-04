import { SKINS, getSkinById, SKIN_MAP } from "@/lib/skins";

describe("SKINS catalog", () => {
  it("contém 8 skins no total", () => {
    expect(SKINS).toHaveLength(8);
  });

  it("todas as skins têm id, name e type definidos", () => {
    SKINS.forEach((skin) => {
      expect(skin.id).toBeTruthy();
      expect(skin.name).toBeTruthy();
      expect(["free", "premium"]).toContain(skin.type);
    });
  });

  it("skin default é Classic Dark e é grátis", () => {
    const skin = SKINS.find((s) => s.id === "default");
    expect(skin).toBeDefined();
    expect(skin!.type).toBe("free");
    expect(skin!.unlockType).toBe("default");
  });

  it("skins premium têm preço definido", () => {
    const premiumSkins = SKINS.filter((s) => s.type === "premium");
    expect(premiumSkins).toHaveLength(3);
    premiumSkins.forEach((skin) => {
      expect(skin.price).toBeGreaterThan(0);
    });
  });

  it("skins de XP têm unlockLevel definido", () => {
    const xpSkins = SKINS.filter((s) => s.unlockType === "xp");
    expect(xpSkins.length).toBeGreaterThan(0);
    xpSkins.forEach((skin) => {
      expect(skin.unlockLevel).toBeDefined();
    });
  });

  it("preços das skins premium estão corretos", () => {
    expect(getSkinById("cyberpunk")?.price).toBe(990);
    expect(getSkinById("retro")?.price).toBe(790);
    expect(getSkinById("gold")?.price).toBe(1490);
  });

  it("IDs de skin são únicos", () => {
    const ids = SKINS.map((s) => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

describe("getSkinById", () => {
  it("retorna a skin correta pelo ID", () => {
    const skin = getSkinById("cyberpunk");
    expect(skin?.name).toBe("Neon Cyberpunk");
  });

  it("retorna undefined para ID inexistente", () => {
    expect(getSkinById("nao_existe")).toBeUndefined();
  });
});

describe("SKIN_MAP", () => {
  it("contém todas as skins indexadas por ID", () => {
    SKINS.forEach((skin) => {
      expect(SKIN_MAP[skin.id]).toBeDefined();
      expect(SKIN_MAP[skin.id].name).toBe(skin.name);
    });
  });
});
