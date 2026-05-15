export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">

      <h1 className="text-5xl font-bold text-center mb-4">
        Akousou Shop & GLS
      </h1>

      <p className="text-zinc-400 text-center max-w-xl mb-8 text-lg">
        Bienvenue sur la plateforme officielle de Akousou Shop & GLS.
        Recharge Wise, Binance, MonCash, PayPal, services digitaux,
        assistance et solutions modernes.
      </p>

      <div className="flex gap-4 flex-wrap justify-center">

        <button className="bg-white text-black px-6 py-3 rounded-2xl font-semibold hover:scale-105 transition">
          Commencer
        </button>

        <button className="border border-white px-6 py-3 rounded-2xl font-semibold hover:bg-white hover:text-black transition">
          Nos Services
        </button>

      </div>

    </main>
  );
}