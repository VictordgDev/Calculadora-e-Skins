import { signIn } from "@/auth";
import Link from "next/link";

export default function RegisterPage({
  searchParams,
}: {
  searchParams: { plan?: string };
}) {
  const plan = searchParams.plan ?? "monthly";

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-2xl font-bold text-white">
            Calc<span className="text-orange-400">Skins</span>
          </Link>
          <p className="text-zinc-400 mt-2 text-sm">Crie sua conta e comece a calcular</p>
        </div>

        {plan && (
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-3 mb-6 text-sm text-orange-300 text-center">
            Você selecionou o plano <strong>{planLabel(plan)}</strong>.
            Após o cadastro você será direcionado ao pagamento.
          </div>
        )}

        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
          <form
            action={async () => {
              "use server";
              await signIn("google", {
                redirectTo: `/checkout?plan=${plan}`,
              });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 bg-white text-zinc-900 font-semibold py-3 rounded-xl hover:bg-zinc-100 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z" />
                <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z" />
                <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z" />
                <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.3z" />
              </svg>
              Cadastrar com Google
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/8" />
            </div>
            <div className="relative text-center">
              <span className="bg-[#111111] px-3 text-zinc-500 text-xs">ou via email</span>
            </div>
          </div>

          <form
            action={async (formData: FormData) => {
              "use server";
              const email = formData.get("email") as string;
              await signIn("resend", {
                email,
                redirectTo: `/checkout?plan=${plan}`,
              });
            }}
            className="space-y-3"
          >
            <input
              name="email"
              type="email"
              placeholder="seu@email.com"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-colors"
            />
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-400 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              Enviar link de acesso
            </button>
          </form>
        </div>

        <p className="text-center text-zinc-500 text-sm mt-6">
          Já tem conta?{" "}
          <Link href="/login" className="text-orange-400 hover:text-orange-300">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}

function planLabel(plan: string) {
  const labels: Record<string, string> = {
    monthly: "Mensal — R$ 5/mês",
    yearly: "Anual — R$ 50/ano",
    lifetime: "Vitalício — R$ 100",
  };
  return labels[plan] ?? plan;
}
