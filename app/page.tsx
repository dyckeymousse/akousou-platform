"use client";

import { useState } from "react";

import {
  ShieldCheck,
  Lock,
  Mail,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import { useRouter } from "next/navigation";

export default function LoginPage() {

  const router =
    useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [showForgot, setShowForgot] =
    useState(false);

  const [showSuccess, setShowSuccess] =
    useState(false);

  const handleLogin =
    () => {

      setError("");

      if (
        !email ||
        !password
      ) {

        setError(
          "Veuillez remplir tous les champs."
        );

        return;
      }

      /* ADMIN LOGIN */
      if (
        email ===
          "dealer47dealer@gmail.com" &&
        password ===
          "AkousouAdmin2026"
      ) {

        localStorage.setItem(
          "akousou_admin",
          "true"
        );

        router.push(
          "/admin"
        );

        return;
      }

      /* USER LOGIN */
      localStorage.setItem(
        "akousou_user",
        "true"
      );

      router.push(
        "/dashboard"
      );
    };

  const handleForgotPassword =
    () => {

      if (!email) {

        setError(
          "Veuillez entrer votre adresse email."
        );

        return;
      }

      setShowForgot(false);

      setShowSuccess(true);
    };

  return (
    <main className="min-h-screen bg-[#020202] text-white flex items-center justify-center px-5 relative overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-[#39FF14]/20 blur-3xl rounded-full" />

      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-[#00FF88]/20 blur-3xl rounded-full" />

      {/* LOGIN CARD */}
      <div className="w-full max-w-xl border border-[#39FF14]/20 bg-black/60 backdrop-blur-2xl rounded-[40px] p-8 md:p-10 shadow-[0_0_40px_rgba(57,255,20,0.15)] relative overflow-hidden">

        {/* INNER GLOW */}
        <div className="absolute top-[-100px] right-[-100px] w-[250px] h-[250px] bg-[#39FF14]/10 blur-3xl rounded-full" />

        <div className="relative z-10">

          {/* ICON */}
          <div className="w-24 h-24 rounded-3xl bg-[#39FF14]/10 border border-[#39FF14]/20 flex items-center justify-center text-[#39FF14] mx-auto shadow-[0_0_30px_rgba(57,255,20,0.2)]">

            <ShieldCheck size={50} />

          </div>

          {/* TITLE */}
          <div className="text-center mt-8">

            <p className="text-zinc-500">
              Protection active
            </p>

            <h1 className="text-4xl md:text-5xl font-extrabold text-[#39FF14] drop-shadow-[0_0_12px_#39FF14] mt-3">
              Akousou GLS
            </h1>

            <p className="mt-4 text-zinc-400 leading-relaxed">
              Connectez-vous à votre espace sécurisé.
            </p>

          </div>

          {/* ERROR */}
          {error && (

            <div className="mt-8 flex items-center gap-3 border border-red-500/30 bg-red-500/10 text-red-400 rounded-2xl px-5 py-4">

              <AlertTriangle size={22} />

              <span className="font-semibold">
                {error}
              </span>

            </div>
          )}

          {/* EMAIL */}
          <div className="mt-10">

            <label className="text-zinc-400">
              Adresse email
            </label>

            <div className="mt-3 flex items-center border border-[#39FF14]/20 bg-[#050505] rounded-2xl overflow-hidden">

              <div className="px-5 text-[#39FF14]">
                <Mail size={22} />
              </div>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                placeholder="Votre adresse email"
                className="w-full bg-transparent px-5 py-5 outline-none"
              />

            </div>

          </div>

          {/* PASSWORD */}
          <div className="mt-6">

            <label className="text-zinc-400">
              Mot de passe
            </label>

            <div className="mt-3 flex items-center border border-[#39FF14]/20 bg-[#050505] rounded-2xl overflow-hidden">

              <div className="px-5 text-[#39FF14]">
                <Lock size={22} />
              </div>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                placeholder="••••••••"
                className="w-full bg-transparent px-5 py-5 outline-none"
              />

            </div>

          </div>

          {/* FORGOT PASSWORD */}
          <div className="mt-5 text-right">

            <button
              onClick={() =>
                setShowForgot(true)
              }
              className="text-[#39FF14] hover:underline font-semibold"
            >
              Mot de passe oublié ?
            </button>

          </div>

          {/* LOGIN BUTTON */}
          <button
            onClick={handleLogin}
            className="mt-10 w-full bg-[#39FF14] hover:bg-[#52ff33] text-black font-extrabold py-5 rounded-[25px] transition-all duration-300 hover:scale-[1.01] shadow-[0_0_30px_rgba(57,255,20,0.25)]"
          >
            Connexion sécurisée
          </button>

        </div>

      </div>

      {/* FORGOT PASSWORD POPUP */}
      {showForgot && (

        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-5">

          <div className="w-full max-w-lg border border-[#39FF14]/20 bg-[#050505] rounded-[40px] p-10 shadow-[0_0_50px_rgba(57,255,20,0.2)] relative overflow-hidden">

            {/* GLOW */}
            <div className="absolute top-[-120px] right-[-120px] w-[250px] h-[250px] bg-[#39FF14]/10 blur-3xl rounded-full" />

            <div className="relative z-10">

              <h2 className="text-4xl font-extrabold text-[#39FF14]">
                Récupération
              </h2>

              <p className="mt-4 text-zinc-400 leading-relaxed">
                Entrez votre adresse email pour recevoir un lien de récupération.
              </p>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                placeholder="Votre adresse email"
                className="mt-8 w-full bg-[#020202] border border-[#39FF14]/20 rounded-2xl px-5 py-5 outline-none focus:border-[#39FF14]"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">

                <button
                  onClick={
                    handleForgotPassword
                  }
                  className="bg-[#39FF14] hover:bg-[#52ff33] text-black font-extrabold py-5 rounded-[25px] transition-all duration-300"
                >
                  Envoyer
                </button>

                <button
                  onClick={() =>
                    setShowForgot(
                      false
                    )
                  }
                  className="border border-[#39FF14] text-[#39FF14] hover:bg-[#39FF14]/10 font-bold py-5 rounded-[25px] transition-all duration-300"
                >
                  Fermer
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* SUCCESS POPUP */}
      {showSuccess && (

        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-5">

          <div className="w-full max-w-lg border border-[#39FF14]/20 bg-[#050505] rounded-[40px] p-10 shadow-[0_0_50px_rgba(57,255,20,0.2)] text-center relative overflow-hidden">

            {/* GLOW */}
            <div className="absolute top-[-120px] right-[-120px] w-[250px] h-[250px] bg-[#39FF14]/10 blur-3xl rounded-full" />

            <div className="relative z-10">

              <div className="w-24 h-24 rounded-full bg-[#39FF14]/10 border border-[#39FF14]/20 flex items-center justify-center text-[#39FF14] mx-auto">

                <CheckCircle2 size={52} />

              </div>

              <h2 className="mt-8 text-4xl font-extrabold text-[#39FF14]">
                Email envoyé
              </h2>

              <p className="mt-5 text-zinc-400 text-lg leading-relaxed">
                Un lien de récupération a été envoyé à votre adresse email.
              </p>

              <button
                onClick={() =>
                  setShowSuccess(
                    false
                  )
                }
                className="mt-10 w-full bg-[#39FF14] hover:bg-[#52ff33] text-black font-extrabold py-5 rounded-[25px] transition-all duration-300"
              >
                Terminer
              </button>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}