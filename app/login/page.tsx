"use client";

import { useState } from "react";

import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { supabase } from "../../supabase";

export default function LoginPage() {

  const router =
    useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] =
    useState("");

   const handleLogin =
  async () => {

    setError("");

    try {

      // LOGIN
      const {
        data: authData,
        error: authError,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (
        authError ||
        !authData.user
      ) {

        setError(
          "Informations invalides."
        );

        return;
      }

      // GET USER
      const {
        data: user,
        error: userError,
      } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (
        userError ||
        !user
      ) {

        setError(
          "Utilisateur introuvable."
        );

        return;
      }

      // BLOCKED
      if (
        user.blocked
      ) {

        setError(
          "Compte bloqué."
        );

        await supabase.auth.signOut();

        return;
      }

      // ADMIN
      if (
        user.is_admin
      ) {

        router.push(
          "/admin"
        );

        return;
      }

      // NORMAL USER
      router.push(
        "/dashboard"
      );

    } catch {

      setError(
        "Une erreur est survenue."
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#020202] text-white relative overflow-hidden flex items-center justify-center px-5 py-10">

      {/* BACKGROUND */}
      <div className="absolute top-[-250px] left-[-250px] w-[600px] h-[600px] bg-[#39FF14]/20 blur-3xl rounded-full" />

      <div className="absolute bottom-[-250px] right-[-250px] w-[600px] h-[600px] bg-[#00FF88]/20 blur-3xl rounded-full" />

      {/* CARD */}
      <section className="w-full max-w-md relative z-10 border border-[#39FF14]/20 bg-black/60 backdrop-blur-2xl rounded-[40px] p-10 shadow-[0_0_40px_rgba(57,255,20,0.15)] overflow-hidden">

        {/* GLOW */}
        <div className="absolute top-[-100px] right-[-100px] w-[220px] h-[220px] bg-[#39FF14]/10 blur-3xl rounded-full" />

        {/* ICON */}
        <div className="relative z-10 flex justify-center">

          <div className="w-24 h-24 rounded-[30px] border border-[#39FF14]/20 bg-[#39FF14]/10 flex items-center justify-center text-[#39FF14] shadow-[0_0_30px_rgba(57,255,20,0.25)]">

            <ShieldCheck size={52} />

          </div>

        </div>

        {/* TITLE */}
        <div className="mt-8 text-center relative z-10">

          <p className="text-zinc-400">
            Protection active
          </p>

          <h1 className="mt-3 text-5xl font-extrabold text-[#39FF14] drop-shadow-[0_0_15px_#39FF14]">
            Akousou GLS
          </h1>

          <p className="mt-4 text-zinc-500">
            Connectez-vous à votre espace sécurisé.
          </p>

        </div>

        {/* ERROR */}
        {error && (

          <div className="mt-8 border border-red-500/30 bg-red-500/10 text-red-400 rounded-2xl px-5 py-4 text-center font-semibold relative z-10">

            {error}

          </div>
        )}

        {/* FORM */}
        <div className="mt-10 flex flex-col gap-6 relative z-10">

          {/* EMAIL */}
          <div>

            <label className="text-zinc-400">
              Adresse email
            </label>

            <div className="mt-3 flex items-center border border-[#39FF14]/20 bg-[#050505] rounded-2xl overflow-hidden">

              <div className="px-5 text-[#39FF14]">

                <Mail size={20} />

              </div>

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                className="w-full bg-transparent px-5 py-5 outline-none"
              />

            </div>

          </div>

          {/* PASSWORD */}
          <div>

            <label className="text-zinc-400">
              Mot de passe
            </label>

            <div className="mt-3 flex items-center border border-[#39FF14]/20 bg-[#050505] rounded-2xl overflow-hidden">

              <div className="px-5 text-[#39FF14]">

                <Lock size={20} />

              </div>

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Mot de passe"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                className="w-full bg-transparent px-5 py-5 outline-none"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="px-5 text-[#39FF14]"
              >

                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}

              </button>

            </div>

          </div>

          {/* FORGOT PASSWORD */}
          <div className="flex justify-end">

            <a
              href="/forgot-password"
              className="text-[#39FF14] hover:text-[#52ff33] text-sm font-semibold transition-all"
            >

              Mot de passe oublié ?

            </a>

          </div>

          {/* LOGIN BUTTON */}
          <button
            onClick={handleLogin}
            className="mt-2 w-full bg-[#39FF14] hover:bg-[#52ff33] text-black font-extrabold py-5 rounded-[25px] transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-[0_0_35px_rgba(57,255,20,0.35)]"
          >
            Connexion sécurisée
          </button>

          {/* CREATE ACCOUNT */}
          <a
            href="/auth"
            className="w-full border border-[#39FF14]/30 hover:border-[#39FF14] hover:bg-[#39FF14]/10 text-[#39FF14] text-center font-bold py-5 rounded-[25px] transition-all duration-300"
          >
            Créer un compte
          </a>

        </div>

      </section>

    </main>
  );
}