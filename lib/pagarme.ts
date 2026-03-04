const PAGARME_BASE_URL = "https://api.pagar.me/core/v5";

function getHeaders() {
  const key = process.env.PAGARME_SECRET_KEY!;
  const encoded = Buffer.from(`${key}:`).toString("base64");
  return {
    Authorization: `Basic ${encoded}`,
    "Content-Type": "application/json",
  };
}

export type PlanType = "monthly" | "yearly" | "lifetime";

export interface CreateOrderParams {
  customerId: string;
  customerName: string;
  customerEmail: string;
  planType: PlanType;
  metadata?: Record<string, string>;
}

const PLAN_AMOUNTS: Record<PlanType, number> = {
  monthly: 500,    // R$ 5,00
  yearly: 5000,    // R$ 50,00
  lifetime: 10000, // R$ 100,00
};

/**
 * Creates a Pagar.me order for basic access (PIX or credit card).
 * For monthly/yearly, use createSubscription instead.
 */
export async function createOrder(params: CreateOrderParams) {
  const amount = PLAN_AMOUNTS[params.planType];

  const body = {
    customer: {
      name: params.customerName,
      email: params.customerEmail,
      type: "individual",
    },
    items: [
      {
        amount,
        description: `CalcSkins — Acesso ${planLabel(params.planType)}`,
        quantity: 1,
        code: `access_${params.planType}`,
      },
    ],
    payments: [
      {
        payment_method: "pix",
        pix: { expires_in: 3600 }, // 1 hour
      },
    ],
    metadata: {
      userId: params.customerId,
      planType: params.planType,
      type: "basic_access",
      ...params.metadata,
    },
  };

  const res = await fetch(`${PAGARME_BASE_URL}/orders`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(`Pagar.me order error: ${JSON.stringify(error)}`);
  }

  return res.json();
}

/**
 * Creates a Pagar.me order for a premium skin purchase.
 */
export async function createSkinOrder(params: {
  customerId: string;
  customerName: string;
  customerEmail: string;
  skinId: string;
  skinName: string;
  amount: number; // in cents
}) {
  const body = {
    customer: {
      name: params.customerName,
      email: params.customerEmail,
      type: "individual",
    },
    items: [
      {
        amount: params.amount,
        description: `CalcSkins — Skin "${params.skinName}"`,
        quantity: 1,
        code: `skin_${params.skinId}`,
      },
    ],
    payments: [
      {
        payment_method: "pix",
        pix: { expires_in: 3600 },
      },
    ],
    metadata: {
      userId: params.customerId,
      skinId: params.skinId,
      type: "skin",
    },
  };

  const res = await fetch(`${PAGARME_BASE_URL}/orders`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(`Pagar.me skin order error: ${JSON.stringify(error)}`);
  }

  return res.json();
}

/**
 * Validates a Pagar.me webhook signature.
 */
export function validateWebhookSignature(
  payload: string,
  signature: string
): boolean {
  const crypto = require("crypto");
  const secret = process.env.PAGARME_WEBHOOK_SECRET!;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return expected === signature;
}

function planLabel(planType: PlanType): string {
  const labels: Record<PlanType, string> = {
    monthly: "Mensal",
    yearly: "Anual",
    lifetime: "Vitalício",
  };
  return labels[planType];
}
