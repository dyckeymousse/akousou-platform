"use client";

import { useState } from "react";

import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {

  const router =
    useRouter();

  const [email, setEmail] =
    useState("");

  const [newPassword, setNewPassword] =
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

  const [popup, setPopup] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const handleResetPassword =
    () => {

      const storedUser =
        localStorage.getItem(
          "akousou_user_data"
        );

      if (!storedUser) {

        setSuccess(false);

        setMessage(
          "Aucun utilisateur trouvé."
        );

        setPopup(true);

        return;
      }

      const parsedUser =
        JSON.parse(storedUser);

      if (
        parsedUser.email !==
        email
      ) {

        setSuccess(false);

        setMessage(
          "Adresse email introuvable."
        );

        setPopup(true);

        return;
      }

      if (
        newPassword.length < 6
      ) {

        setSuccess(false);

        setMessage(
          "Le mot de passe doit contenir au moins 6 caractères."
        );

        setPopup(true);

        return;
      }

      if (
        newPassword !==
        confirmPassword
      ) {

        setSuccess(false);

        setMessage(
          "Les mots de passe ne correspondent pas."
        );

        setPopup(true);

        return;
      }

      // UPDATE PASSWORD
      parsedUser.password =
        newPassword;

      localStorage.setItem(
        "akousou_user_data",
        JSON.stringify(
          parsedUser
        )
      );

      setSuccess(true);

      setMessage(
        "Votre mot de passe a été modifié avec succès."
      );

      setPopup(true);
    };

  return (
    <main className="min-h-screen bg-[#020202] text-white flex items-center justify-center px-5 py-10 relative overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute top-[-220px] left-[-220px] w-[550px] h-[550px] bg-[#39FF14]/20 blur-3xl rounded-full" />

      <div className="absolute bottom-[-220px] right-[-220px] w-[550px] h-[550px] bg-[#00FF88]/20 blur-3xl rounded-full" />

      {/* CARD */}
      <section className="w-full max-w-md border border-[#39FF14]/20 bg-black/60 backdrop-blur-2xl rounded-[40px] p-10 relative z-10 shadow-[0_0_40px_rgba(57,255,20,0.15)] overflow-hidden">

        {/* GLOW */}
        <div className="absolute top-[-120px] right-[-120px] w-[240px] h-[240px] bg-[#39FF14]/10 blur-3xl rounded-full" />

        {/* ICON */}
        <div className="relative z-10 flex justify-center">

          <div className="w-24 h-24 rounded-[30px] bg-[#39FF14]/10 border border-[#39FF14]/20 flex items-center justify-center text-[#39FF14] shadow-[0_0_30px_rgba(57,255,20,0.25)]">

            <ShieldCheck size={50} />

          </div>

        </div>

        {/* TITLE */}
        <div className="mt-8 text-center relative z-10">

          <h1 className="text-4xl font-extrabold text-[#39FF14] drop-shadow-[0_0_12px_#39FF14]">
            Mot de passe oublié
          </h1>

          <p className="mt-4 text-zinc-400 leading-relaxed">
            Réinitialisez votre mot de passe sécurisé.
          </p>

        </div>

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

          </div>

          {/* NEW PASSWORD */}
          <div>

            <label className="text-zinc-400">
              Nouveau mot de passe
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
                placeholder="Nouveau mot de passe"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(
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

          {/* CONFIRM PASSWORD */}
          <div>

            <label className="text-zinc-400">
              Confirmer mot de passe
            </label>

            <div className="mt-3 flex items-center border border-[#39FF14]/20 bg-[#050505] rounded-2xl overflow-hidden">

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

          {/* BUTTON */}
          <button
            onClick={
              handleResetPassword
            }
            className="mt-4 w-full bg-[#39FF14] hover:bg-[#52ff33] text-black font-extrabold py-5 rounded-[25px] transition-all duration-300 hover:scale-[1.02] shadow-[0_0_35px_rgba(57,255,20,0.35)]"
          >
            Réinitialiser
          </button>

          {/* LOGIN */}
          <a
            href="/login"
            className="border border-[#39FF14]/30 hover:border-[#39FF14] hover:bg-[#39FF14]/10 text-[#39FF14] text-center font-bold py-5 rounded-[25px] transition-all duration-300"
          >
            Retour connexion
          </a>

        </div>

      </section>

      {/* POPUP */}
      {popup && (

        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center px-5">

          <div className={`w-full max-w-lg rounded-[35px] border p-10 shadow-[0_0_50px_rgba(57,255,20,0.2)] text-center ${
            success
              ? "border-[#39FF14]/30 bg-[#050505]"
              : "border-red-500/30 bg-[#050505]"
          }`}>

            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
              success
                ? "bg-[#39FF14]/10 border border-[#39FF14]/20 text-[#39FF14]"
                : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}>

              {success ? (
                <CheckCircle2 size={50} />
              ) : (
                <AlertTriangle size={50} />
              )}

            </div>

            <h2 className={`mt-8 text-4xl font-extrabold ${
              success
                ? "text-[#39FF14]"
                : "text-red-400"
            }`}>

              {success
                ? "Succès"
                : "Erreur"}

            </h2>

            <p className="mt-5 text-zinc-400 leading-relaxed text-lg">
              {message}
            </p>

            <button
              onClick={() => {

                setPopup(false);

                if (success) {

                  router.push(
                    "/login"
                  );
                }
              }}
              className={`mt-10 w-full py-5 rounded-[25px] font-extrabold transition-all duration-300 ${
                success
                  ? "bg-[#39FF14] hover:bg-[#52ff33] text-black"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            >
              {success
                ? "Connexion"
                : "Retour"}

            </button>

          </div>

        </div>
      )}

    </main>
  );
}