"use client";

import { useState } from "react";

import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { supabase } from "../../supabase";

export default function AuthPage() {

  const router =
    useRouter();

  const [fullname, setFullname] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const handleRegister =
    async () => {

      setError("");

      if (
        !fullname ||
        !phone ||
        !email ||
        !password ||
        !confirmPassword
      ) {

        setError(
          "Veuillez remplir tous les champs."
        );

        return;
      }

      if (
        phone.length < 8
      ) {

        setError(
          "Le numéro est invalide."
        );

        return;
      }

      if (
        password.length < 6
      ) {

        setError(
          "Le mot de passe doit contenir au moins 6 caractères."
        );

        return;
      }

      if (
        password !==
        confirmPassword
      ) {

        setError(
          "Les mots de passe ne correspondent pas."
        );

        return;
      }

      try {

        const {
          data: existingUser,
        } = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .single();

        if (existingUser) {

          setError(
            "Cet email existe déjà."
          );

          return;
        }

        // SUPABASE AUTH
        const {
          data: authData,
          error: authError,
        } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) {

          setError(
            authError.message
          );

          return;
        }

        // SAVE USER
        const {
          error: insertError,
        } = await supabase
          .from("users")
          .insert([
            {
              fullname,
              phone,
              email,
              balance: 0,
              blocked: false,
              auth_id:
                authData.user?.id,
            },
          ]);

        if (insertError) {

          setError(
            "Erreur lors de la création du compte."
          );

          return;
        }

        router.push(
          "/login"
        );

      } catch {

        setError(
          "Une erreur est survenue."
        );
      }
    };

  return (
    <main className="min-h-screen bg-[#020202] text-white flex items-center justify-center px-6 py-10 relative overflow-hidden">

      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-[#39FF14]/20 blur-3xl rounded-full" />

      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-[#00FF88]/20 blur-3xl rounded-full" />

      <section className="w-full max-w-md border border-[#39FF14]/20 rounded-[40px] p-10 bg-black/60 backdrop-blur-2xl shadow-[0_0_40px_rgba(57,255,20,0.15)] relative z-10 overflow-hidden">

        <div className="absolute top-[-120px] right-[-120px] w-[250px] h-[250px] bg-[#39FF14]/10 blur-3xl rounded-full" />

        <div className="relative z-10 flex justify-center">

          <div className="w-24 h-24 rounded-[30px] border border-[#39FF14]/20 bg-[#39FF14]/10 flex items-center justify-center text-[#39FF14] shadow-[0_0_30px_rgba(57,255,20,0.25)]">

            <ShieldCheck size={52} />

          </div>

        </div>

        <div className="mt-8 text-center relative z-10">

          <h1 className="text-5xl font-extrabold text-[#39FF14] drop-shadow-[0_0_15px_#39FF14]">
            Akousou GLS
          </h1>

          <p className="text-zinc-400 mt-4">
            Créez votre espace sécurisé.
          </p>

        </div>

        {error && (

          <div className="mt-8 border border-red-500/30 bg-red-500/10 text-red-400 rounded-2xl px-5 py-4 text-center font-semibold relative z-10">

            {error}

          </div>
        )}

        <div className="mt-10 flex flex-col gap-5 relative z-10">

          <div className="flex items-center border border-[#39FF14]/20 bg-[#050505] rounded-2xl overflow-hidden">

            <div className="px-5 text-[#39FF14]">

              <User size={20} />

            </div>

            <input
              type="text"
              placeholder="Nom complet"
              value={fullname}
              onChange={(e) =>
                setFullname(
                  e.target.value
                )
              }
              className="w-full bg-transparent px-5 py-5 outline-none"
            />

          </div>

          <div className="flex items-center border border-[#39FF14]/20 bg-[#050505] rounded-2xl overflow-hidden">

            <div className="px-5 text-[#39FF14]">

              <Phone size={20} />

            </div>

            <input
              type="text"
              placeholder="Numéro téléphone"
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value
                )
              }
              className="w-full bg-transparent px-5 py-5 outline-none"
            />

          </div>

          <div className="flex items-center border border-[#39FF14]/20 bg-[#050505] rounded-2xl overflow-hidden">

            <div className="px-5 text-[#39FF14]">

              <Mail size={20} />

            </div>

            <input
              type="email"
              placeholder="Adresse email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="w-full bg-transparent px-5 py-5 outline-none"
            />

          </div>

          <div className="flex items-center border border-[#39FF14]/20 bg-[#050505] rounded-2xl overflow-hidden">

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

          <div className="flex items-center border border-[#39FF14]/20 bg-[#050505] rounded-2xl overflow-hidden">

            <div className="px-5 text-[#39FF14]">

              <Lock size={20} />

            </div>

            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              placeholder="Confirmer mot de passe"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              className="w-full bg-transparent px-5 py-5 outline-none"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              className="px-5 text-[#39FF14]"
            >

              {showConfirmPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}

            </button>

          </div>

        </div>

        <div className="mt-8 flex flex-col gap-4 relative z-10">

          <button
            onClick={
              handleRegister
            }
            className="bg-[#39FF14] text-black font-extrabold py-5 rounded-[25px] hover:scale-[1.02] transition-all duration-300 shadow-[0_0_30px_rgba(57,255,20,0.35)]"
          >
            Créer votre compte
          </button>

          <a
            href="/login"
            className="border border-[#39FF14]/30 text-[#39FF14] text-center font-bold py-5 rounded-[25px] hover:bg-[#39FF14]/10 transition-all duration-300"
          >
            Se connecter
          </a>

        </div>

        <p className="text-center text-zinc-500 text-sm mt-8 relative z-10">
          Plateforme digitale sécurisée.
        </p>

      </section>

    </main>
  );
}