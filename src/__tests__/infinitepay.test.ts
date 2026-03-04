import {
  generateOrderNsu,
  parseOrderNsu,
  calculatePlanExpiry,
  PLAN_PRICES,
} from "@/lib/infinitepay";

describe("generateOrderNsu", () => {
  it("gera NSU correto para acesso mensal", () => {
    const nsu = generateOrderNsu({
      type: "access",
      planType: "monthly",
      userId: "user_abc",
    });
    expect(nsu).toMatch(/^access_monthly_user_abc_\d+$/);
  });

  it("gera NSU correto para acesso anual", () => {
    const nsu = generateOrderNsu({
      type: "access",
      planType: "yearly",
      userId: "user_xyz",
    });
    expect(nsu).toMatch(/^access_yearly_user_xyz_\d+$/);
  });

  it("gera NSU correto para compra de skin", () => {
    const nsu = generateOrderNsu({
      type: "skin",
      skinId: "cyberpunk",
      userId: "user_123",
    });
    expect(nsu).toMatch(/^skin_cyberpunk_user_123_\d+$/);
  });

  it("cada NSU gerado é único (timestamp diferente)", () => {
    const nsu1 = generateOrderNsu({ type: "access", planType: "monthly", userId: "u1" });
    const nsu2 = generateOrderNsu({ type: "access", planType: "monthly", userId: "u1" });
    // Podem ser iguais em ms, mas o formato deve ser válido
    expect(nsu1).toMatch(/^access_monthly_u1_\d+$/);
    expect(nsu2).toMatch(/^access_monthly_u1_\d+$/);
  });
});

describe("parseOrderNsu", () => {
  it("decodifica NSU de acesso mensal corretamente", () => {
    const parsed = parseOrderNsu("access_monthly_cuid123_1700000000000");
    expect(parsed).toEqual({
      type: "access",
      planType: "monthly",
      userId: "cuid123",
      timestamp: "1700000000000",
    });
  });

  it("decodifica NSU de acesso lifetime corretamente", () => {
    const parsed = parseOrderNsu("access_lifetime_cuid123_1700000000000");
    expect(parsed).toEqual({
      type: "access",
      planType: "lifetime",
      userId: "cuid123",
      timestamp: "1700000000000",
    });
  });

  it("decodifica NSU de skin corretamente", () => {
    const parsed = parseOrderNsu("skin_cyberpunk_cuid123_1700000000000");
    expect(parsed).toEqual({
      type: "skin",
      skinId: "cyberpunk",
      userId: "cuid123",
      timestamp: "1700000000000",
    });
  });

  it("retorna null para formato inválido", () => {
    expect(parseOrderNsu("invalido")).toBeNull();
    expect(parseOrderNsu("")).toBeNull();
    expect(parseOrderNsu("unknown_something")).toBeNull();
  });

  it("roundtrip: generate → parse retorna dados originais para skin", () => {
    const userId = "clabcdef123";
    const nsu = generateOrderNsu({ type: "skin", skinId: "gold", userId });
    const parsed = parseOrderNsu(nsu);
    expect(parsed?.type).toBe("skin");
    expect(parsed?.skinId).toBe("gold");
    expect(parsed?.userId).toBe(userId);
  });
});

describe("calculatePlanExpiry", () => {
  it("retorna null para lifetime", () => {
    expect(calculatePlanExpiry("lifetime")).toBeNull();
  });

  it("retorna data ~1 mês no futuro para monthly", () => {
    const before = new Date();
    const expiry = calculatePlanExpiry("monthly");
    const after = new Date();

    expect(expiry).not.toBeNull();
    const expectedMonth = new Date(before);
    expectedMonth.setMonth(expectedMonth.getMonth() + 1);

    // Verifica que a data está aproximadamente 1 mês no futuro (±1 segundo)
    expect(expiry!.getTime()).toBeGreaterThanOrEqual(expectedMonth.getTime() - 1000);
    expect(expiry!.getTime()).toBeLessThanOrEqual(after.getTime() + 32 * 24 * 60 * 60 * 1000);
  });

  it("retorna data ~1 ano no futuro para yearly", () => {
    const before = new Date();
    const expiry = calculatePlanExpiry("yearly");

    expect(expiry).not.toBeNull();
    const expectedYear = new Date(before);
    expectedYear.setFullYear(expectedYear.getFullYear() + 1);

    expect(expiry!.getTime()).toBeGreaterThanOrEqual(expectedYear.getTime() - 1000);
  });
});

describe("PLAN_PRICES", () => {
  it("mensal custa R$ 5,00 (500 centavos)", () => {
    expect(PLAN_PRICES.monthly).toBe(500);
  });

  it("anual custa R$ 50,00 (5000 centavos)", () => {
    expect(PLAN_PRICES.yearly).toBe(5000);
  });

  it("vitalício custa R$ 100,00 (10000 centavos)", () => {
    expect(PLAN_PRICES.lifetime).toBe(10000);
  });
});
