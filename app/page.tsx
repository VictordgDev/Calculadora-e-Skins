import Link from "next/link";
import { auth } from "@/auth";
import { SKINS } from "@/lib/skins";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-display text-xl font-bold tracking-tight">
            Calc<span className="text-orange-400">Skins</span>
          </span>
          <div className="flex items-center gap-4">
            <Link href="/ranking" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Ranking
            </Link>
            {session?.user ? (
              <Link
                href="/app"
                className="bg-orange-500 hover:bg-orange-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Abrir App
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="bg-orange-500 hover:bg-orange-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Começar
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
              <span className="text-orange-400 text-sm font-medium">Gamificação real. Calculadora real.</span>
            </div>
            <h1 className="font-display text-5xl lg:text-6xl font-bold leading-tight mb-6">
              A calculadora que{" "}
              <span className="text-orange-400">evolui</span>{" "}
              com você
            </h1>
            <p className="text-zinc-400 text-lg leading-relaxed mb-8">
              Calcule, ganhe XP, suba de nível e desbloqueie skins exclusivas.
              Transformamos a ferramenta mais comum do mundo em algo que você
              vai querer abrir todo dia.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/register"
                className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25"
              >
                Começar por R$ 5/mês →
              </Link>
              <Link
                href="/ranking"
                className="border border-white/10 hover:border-white/30 text-zinc-300 font-medium px-6 py-3 rounded-xl transition-colors"
              >
                Ver Ranking
              </Link>
            </div>
            <p className="mt-4 text-zinc-600 text-sm">
              Acesso vitalício por apenas R$ 100 uma vez
            </p>
          </div>

          {/* Animated skin preview */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-64 h-80">
              {/* Skin 1: Classic Dark */}
              <div className="skin-demo-1 absolute inset-0 rounded-2xl bg-zinc-900 p-4 shadow-2xl">
                <div className="bg-zinc-800 rounded-lg p-3 text-right font-mono text-white text-2xl mb-3">1,337</div>
                <div className="grid grid-cols-4 gap-2">
                  {["C","±","%","÷","7","8","9","×","4","5","6","-","1","2","3","+","0",".",",","="].map((k, i) => (
                    <div key={i} className={`rounded-lg p-2 text-center text-sm font-mono ${k === "=" ? "bg-orange-500 text-white col-span-1" : i < 3 ? "bg-zinc-600 text-white" : "bg-zinc-700 text-white"}`}>{k}</div>
                  ))}
                </div>
                <div className="absolute bottom-3 left-0 right-0 text-center text-xs text-zinc-600 font-display">Classic Dark</div>
              </div>

              {/* Skin 2: Cyberpunk */}
              <div className="skin-demo-2 absolute inset-0 rounded-2xl bg-[#0d0d1a] p-4 shadow-2xl border border-[#00ff9f]/20">
                <div className="bg-[#0a0a15] rounded-lg p-3 text-right font-mono text-[#00ff9f] text-2xl mb-3 border border-[#00ff9f]/30">1,337</div>
                <div className="grid grid-cols-4 gap-2">
                  {["C","±","%","÷","7","8","9","×","4","5","6","-","1","2","3","+","0",".",",","="].map((k, i) => (
                    <div key={i} className={`rounded-lg p-2 text-center text-sm font-mono border ${k === "=" ? "bg-[#ff00ff] text-white border-transparent" : "bg-[#1a1a2e] text-[#00b4d8] border-[#00b4d8]/20"}`}>{k}</div>
                  ))}
                </div>
                <div className="absolute bottom-3 left-0 right-0 text-center text-xs text-[#00ff9f]/50 font-display">Neon Cyberpunk</div>
              </div>

              {/* Skin 3: Gold */}
              <div className="skin-demo-3 absolute inset-0 rounded-2xl bg-[#1a1200] p-4 shadow-2xl border border-[#b8860b]/30">
                <div className="bg-[#0d0900] rounded-lg p-3 text-right font-mono text-[#ffd700] text-2xl mb-3 border border-[#b8860b]">1,337</div>
                <div className="grid grid-cols-4 gap-2">
                  {["C","±","%","÷","7","8","9","×","4","5","6","-","1","2","3","+","0",".",",","="].map((k, i) => (
                    <div key={i} className={`rounded-lg p-2 text-center text-sm font-mono border border-[#b8860b]/40 ${k === "=" ? "bg-gradient-to-b from-[#ffd700] to-[#b8860b] text-black border-transparent" : "bg-[#2a1f00] text-[#ffd700]"}`}>{k}</div>
                  ))}
                </div>
                <div className="absolute bottom-3 left-0 right-0 text-center text-xs text-[#b8860b]/70 font-display">Gold Luxury</div>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl -z-10 blur-3xl opacity-30 bg-gradient-to-br from-orange-500 via-purple-500 to-cyan-500 animate-glow-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold mb-3">Por que CalcSkins?</h2>
            <p className="text-zinc-400">Porque calcular também pode ser divertido.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "⚡", title: "Ganhe XP calculando", desc: "Cada operação vale 1 XP. Complete 10 calculos e suba para o Lv 0 desbloqueando sua primeira skin grátis." },
              { icon: "🎨", title: "Coleção de skins", desc: "Skins gratuitas por XP e skins premium na loja. 8 temas únicos para personalizar sua calculadora." },
              { icon: "🏆", title: "Ranking global", desc: "Compare seu XP com outros usuários. Rankings por semana, mês, ano e all time." },
            ].map((f, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 hover:border-orange-500/30 transition-colors">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-display font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 border-t border-white/5" id="precos">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold mb-3">Planos simples</h2>
            <p className="text-zinc-400">Sem surpresas. Cancele quando quiser.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Mensal", price: "R$ 5", period: "/mês", badge: null, planType: "monthly", desc: "Acesso completo com renovação mensal automática." },
              { name: "Anual", price: "R$ 50", period: "/ano", badge: "Mais popular", planType: "yearly", desc: "R$ 4,16/mês. Economize 17% em relação ao mensal." },
              { name: "Vitalício", price: "R$ 100", period: " único", badge: "Melhor custo", planType: "lifetime", desc: "Pague uma vez, use para sempre. Zero recorrência." },
            ].map((plan, i) => (
              <div key={i} className={`relative rounded-2xl p-6 border transition-colors ${plan.badge ? "bg-orange-500/5 border-orange-500/40" : "bg-white/[0.02] border-white/8"}`}>
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {plan.badge}
                  </div>
                )}
                <h3 className="font-display font-bold text-lg mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-zinc-400 text-sm">{plan.period}</span>
                </div>
                <p className="text-zinc-400 text-sm mb-6">{plan.desc}</p>
                <Link
                  href={`/register?plan=${plan.planType}`}
                  className={`block text-center py-2.5 rounded-xl text-sm font-semibold transition-colors ${plan.badge ? "bg-orange-500 hover:bg-orange-400 text-white" : "bg-white/8 hover:bg-white/12 text-white"}`}
                >
                  Começar agora
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-center text-zinc-600 text-sm">
        <p>© 2025 CalcSkins. Feito com ☕ no Brasil.</p>
      </footer>
    </main>
  );
}
