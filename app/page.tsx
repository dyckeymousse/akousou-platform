export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-28">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          Akousou Shop & GLS
        </h1>

        <p className="mt-6 text-zinc-400 text-lg md:text-2xl max-w-2xl">
          Services numériques rapides, sécurisés et professionnels.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">

          <a
            href="/auth"
            className="bg-white text-black px-8 py-4 rounded-2xl font-bold hover:scale-105 transition"
          >
            Commencer
          </a>

          <button className="border border-zinc-700 px-8 py-4 rounded-2xl hover:bg-zinc-900 transition">
            Nos Services
          </button>

        </div>
      </section>

      {/* SERVICES */}
      <section className="px-6 pb-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">
          Nos Services
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
            <h3 className="text-2xl font-bold mb-3">
              Recharge Wise
            </h3>

            <p className="text-zinc-400">
              Recharge rapide et sécurisée pour vos comptes Wise.
            </p>
          </div>

          <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
            <h3 className="text-2xl font-bold mb-3">
              Binance
            </h3>

            <p className="text-zinc-400">
              Achat et vente de cryptomonnaies facilement.
            </p>
          </div>

          <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
            <h3 className="text-2xl font-bold mb-3">
              MonCash
            </h3>

            <p className="text-zinc-400">
              Transactions et recharges rapides avec MonCash.
            </p>
          </div>

          <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
            <h3 className="text-2xl font-bold mb-3">
              PayPal
            </h3>

            <p className="text-zinc-400">
              Assistance et paiements PayPal professionnels.
            </p>
          </div>

          <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
            <h3 className="text-2xl font-bold mb-3">
              GLS Services
            </h3>

            <p className="text-zinc-400">
              Support digital et services multiples fiables.
            </p>
          </div>

          <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
            <h3 className="text-2xl font-bold mb-3">
              Support Client
            </h3>

            <p className="text-zinc-400">
              Assistance rapide et professionnelle 7j/7.
            </p>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800 py-8 text-center text-zinc-500">
        © 2026 Akousou Shop & GLS — Tous droits réservés.
      </footer>

    </main>
  );
}