"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const PLANS = [
  { id: "monthly", label: "Mensal", price: "R$ 5", period: "/mês", badge: null },
  { id: "yearly", label: "Anual", price: "R$ 50", period: "/ano", badge: "Mais popular" },
  { id: "lifetime", label: "Vitalício", price: "R$ 100", period: " único", badge: "Melhor custo" },
];

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const initialPlan = searchParams.get("plan") ?? "monthly";

  const [selectedPlan, setSelectedPlan] = useState(initialPlan);
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<{
    pixQrCode: string;
    pixQrCodeUrl: string;
    orderId: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "basic_access", planType: selectedPlan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPixData(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao gerar pagamento");
    } finally {
      setLoading(false);
    }
  }

  async function copyPix() {
    if (!pixData?.pixQrCode) return;
    await navigator.clipboard.writeText(pixData.pixQrCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-2xl font-bold text-white">
            Calc<span className="text-orange-400">Skins</span>
          </Link>
          <p className="text-zinc-400 mt-2 text-sm">Finalize seu acesso</p>
        </div>

        {!pixData ? (
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 space-y-6">
            {/* Plan selector */}
            <div>
              <p className="text-sm text-zinc-400 mb-3 font-medium">Escolha o plano</p>
              <div className="space-y-2">
                {PLANS.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${selectedPlan === plan.id ? "border-orange-500 bg-orange-500/10" : "border-white/8 hover:border-white/20"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedPlan === plan.id ? "border-orange-500" : "border-zinc-500"}`}>
                        {selectedPlan === plan.id && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                      </div>
                      <span className="text-white font-medium text-sm">{plan.label}</span>
                      {plan.badge && (
                        <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">{plan.badge}</span>
                      )}
                    </div>
                    <span className="text-white font-bold text-sm">{plan.price}<span className="text-zinc-400 font-normal">{plan.period}</span></span>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors"
            >
              {loading ? "Gerando PIX..." : "Pagar com PIX →"}
            </button>

            <p className="text-center text-zinc-600 text-xs">
              Pagamento 100% seguro via Pagar.me
            </p>
          </div>
        ) : (
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 text-center space-y-5">
            <div>
              <div className="text-3xl mb-2">📱</div>
              <h2 className="font-display font-bold text-xl text-white">PIX gerado!</h2>
              <p className="text-zinc-400 text-sm mt-1">Escaneie o QR Code ou copie o código abaixo</p>
            </div>

            {pixData.pixQrCodeUrl && (
              <img
                src={pixData.pixQrCodeUrl}
                alt="QR Code PIX"
                className="mx-auto w-48 h-48 rounded-xl bg-white p-2"
              />
            )}

            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-xs text-zinc-500 font-mono break-all leading-relaxed">
                {pixData.pixQrCode?.slice(0, 80)}...
              </p>
            </div>

            <button
              onClick={copyPix}
              className="w-full border border-orange-500/40 hover:bg-orange-500/10 text-orange-400 font-medium py-3 rounded-xl transition-colors text-sm"
            >
              {copied ? "✓ Código copiado!" : "Copiar código PIX"}
            </button>

            <p className="text-zinc-600 text-xs">
              Após o pagamento, seu acesso será liberado automaticamente em segundos.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
