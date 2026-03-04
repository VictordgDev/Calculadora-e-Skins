export const PLAN_PRICES: Record<string, number> = {
  monthly: 500,   // R$ 5,00
  yearly: 5000,   // R$ 50,00
  lifetime: 10000, // R$ 100,00
};

export interface OrderNsuData {
  type: "access" | "skin";
  planType?: string;
  skinId?: string;
  userId: string;
  timestamp: string;
}

/**
 * Gera um orderNsu único para identificar a compra no webhook.
 */
export function generateOrderNsu(data: Omit<OrderNsuData, "timestamp">): string {
  const timestamp = Date.now().toString();
  if (data.type === "access") {
    return `access_${data.planType}_${data.userId}_${timestamp}`;
  }
  return `skin_${data.skinId}_${data.userId}_${timestamp}`;
}

/**
 * Decodifica um orderNsu de volta para os dados da compra.
 */
export function parseOrderNsu(orderNsu: string): OrderNsuData | null {
  const parts = orderNsu.split("_");

  if (parts[0] === "access" && parts.length >= 4) {
    return {
      type: "access",
      planType: parts[1],
      userId: parts[2],
      timestamp: parts[3],
    };
  }

  if (parts[0] === "skin" && parts.length >= 4) {
    return {
      type: "skin",
      skinId: parts[1],
      userId: parts[2],
      timestamp: parts[3],
    };
  }

  return null;
}

/**
 * Calcula a data de expiração do plano a partir do momento atual.
 * Retorna null para plano lifetime.
 */
export function calculatePlanExpiry(planType: string): Date | null {
  if (planType === "lifetime") return null;

  const now = new Date();
  if (planType === "monthly") {
    now.setMonth(now.getMonth() + 1);
  } else if (planType === "yearly") {
    now.setFullYear(now.getFullYear() + 1);
  }
  return now;
}
