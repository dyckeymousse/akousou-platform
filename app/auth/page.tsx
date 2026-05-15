export default function AuthPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-10">

        <h1 className="text-4xl font-bold text-center">
          Bienvenue
        </h1>

        <p className="text-zinc-400 text-center mt-4">
          Connectez-vous ou créez un compte pour continuer.
        </p>

        <div className="mt-10 flex flex-col gap-4">

          <button className="bg-white text-black py-4 rounded-2xl font-bold hover:scale-105 transition">
            Créer un compte
          </button>

          <button className="border border-zinc-700 py-4 rounded-2xl font-bold hover:bg-zinc-800 transition">
            Se connecter
          </button>

        </div>

      </div>

    </main>
  );
}