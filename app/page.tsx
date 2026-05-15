export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold mb-4">
        Akousou Shop & GLS
      </h1>

      <p className="text-zinc-400 text-lg">
        Bienvenue sur la plateforme officielle
      </p>

      <button className="mt-8 px-6 py-3 bg-white text-black rounded-xl font-semibold hover:scale-105 transition">
        Commencer
      </button>
    </main>
  );
}