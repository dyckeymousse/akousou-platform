"use client";

import { useState, useEffect } from "react";

import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  ShieldCheck,
  Eye,
  EyeOff,
  LogOut,
  Lock,
} from "lucide-react";

import { supabase } from "../../supabase";

export default function SettingsPage() {

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [showLogoutPopup, setShowLogoutPopup] =
    useState(false);

  const [showSuccessPopup, setShowSuccessPopup] =
    useState(false);

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [fullname, setFullname] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [userId, setUserId] =
    useState("");

  useEffect(() => {

    const loadUser =
      async () => {

        const {
          data: authData,
        } = await supabase.auth.getUser();

        const authUser =
          authData.user;

        if (!authUser) {

          window.location.href =
            "/login";

          return;
        }

        const {
          data: user,
        } = await supabase
          .from("users")
          .select("*")
          .eq(
            "auth_id",
            authUser.id
          )
          .single();

        if (!user) return;

        setFullname(
          user.fullname || ""
        );

        setEmail(
          user.email || ""
        );

        setPhone(
          user.phone || ""
        );

        setUserId(
          authUser.id
        );
      };

    loadUser();

  }, []);

  return (
    <main className="min-h-screen bg-[#020202] text-white relative overflow-hidden px-5 py-10">

      {/* BACKGROUND */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-[#39FF14]/20 blur-3xl rounded-full" />

      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-[#00FF88]/20 blur-3xl rounded-full" />

      {/* CONTENT */}
      <section className="max-w-5xl mx-auto relative z-10">

        {/* HEADER */}
        <div className="flex items-center justify-between flex-wrap gap-4">

          <div>

            <p className="text-zinc-400">
              Paramètres du compte
            </p>

            <h1 className="text-4xl md:text-5xl font-extrabold text-[#39FF14] drop-shadow-[0_0_12px_#39FF14] mt-2">
              Settings
            </h1>

          </div>

          {/* RETURN */}
          <a
            href="/dashboard"
            className="border border-[#39FF14] hover:bg-[#39FF14]/10 transition px-5 py-3 rounded-2xl flex items-center gap-3 text-[#39FF14]"
          >

            <ArrowLeft size={18} />

            Retour

          </a>

        </div>

        {/* PROFILE CARD */}
        <div className="mt-12 border border-[#39FF14]/20 bg-black/60 backdrop-blur-2xl rounded-[35px] p-8 shadow-[0_0_25px_rgba(57,255,20,0.12)]">

          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-2xl bg-[#39FF14]/10 border border-[#39FF14]/20 flex items-center justify-center text-[#39FF14]">

              <User size={32} />

            </div>

            <div>

              <h2 className="text-3xl font-bold text-[#39FF14]">
                Profil utilisateur
              </h2>

              <p className="text-zinc-500 mt-1">
                Informations du compte
              </p>

            </div>

          </div>

          {/* FORM */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">

            {/* NOM */}
            <div>

              <label className="text-zinc-400">
                Nom complet
              </label>

              <div className="mt-3 flex items-center gap-3 border border-[#39FF14]/20 bg-[#050505] rounded-2xl px-5 py-4">

                <User
                  size={20}
                  className="text-[#39FF14]"
                />

                <input
                  type="text"
                  value={fullname}
                  readOnly
                  className="bg-transparent outline-none w-full"
                />

              </div>

            </div>

            {/* EMAIL */}
            <div>

              <label className="text-zinc-400">
                Email
              </label>

              <div className="mt-3 flex items-center gap-3 border border-[#39FF14]/20 bg-[#050505] rounded-2xl px-5 py-4">

                <Mail
                  size={20}
                  className="text-[#39FF14]"
                />

                <input
                  type="email"
                  value={email}
                  readOnly
                  className="bg-transparent outline-none w-full"
                />

              </div>

            </div>

            {/* PHONE */}
            <div>

              <label className="text-zinc-400">
                Téléphone
              </label>

              <div className="mt-3 flex items-center gap-3 border border-[#39FF14]/20 bg-[#050505] rounded-2xl px-5 py-4">

                <Phone
                  size={20}
                  className="text-[#39FF14]"
                />

                <input
                  type="text"
                  value={phone}
                  readOnly
                  className="bg-transparent outline-none w-full"
                />

              </div>

            </div>

            {/* USER ID */}
            <div>

              <label className="text-zinc-400">
                ID utilisateur
              </label>

              <div className="mt-3 flex items-center gap-3 border border-[#39FF14]/20 bg-[#050505] rounded-2xl px-5 py-4">

                <ShieldCheck
                  size={20}
                  className="text-[#39FF14]"
                />

                <input
                  type="text"
                  value={userId}
                  disabled
                  className="bg-transparent outline-none w-full text-zinc-500"
                />

              </div>

            </div>

          </div>

        </div>

        {/* SECURITY */}
        <div className="mt-10 border border-[#39FF14]/20 bg-black/60 backdrop-blur-2xl rounded-[35px] p-8 shadow-[0_0_25px_rgba(57,255,20,0.12)]">

          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-2xl bg-[#39FF14]/10 border border-[#39FF14]/20 flex items-center justify-center text-[#39FF14]">

              <Lock size={30} />

            </div>

            <div>

              <h2 className="text-3xl font-bold text-[#39FF14]">
                Sécurité
              </h2>

              <p className="text-zinc-500 mt-1">
                Modifier votre mot de passe
              </p>

            </div>

          </div>

          {/* PASSWORDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">

            {/* PASSWORD */}
            <div>

              <label className="text-zinc-400">
                Nouveau mot de passe
              </label>

              <div className="mt-3 flex items-center gap-3 border border-[#39FF14]/20 bg-[#050505] rounded-2xl px-5 py-4">

                <Lock
                  size={20}
                  className="text-[#39FF14]"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  placeholder="********"
                  className="bg-transparent outline-none w-full"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="text-[#39FF14]"
                >

                  {showPassword ? (
                    <EyeOff
                      size={20}
                    />
                  ) : (
                    <Eye
                      size={20}
                    />
                  )}

                </button>

              </div>

            </div>

            {/* CONFIRM PASSWORD */}
            <div>

              <label className="text-zinc-400">
                Confirmer mot de passe
              </label>

              <div className="mt-3 flex items-center gap-3 border border-[#39FF14]/20 bg-[#050505] rounded-2xl px-5 py-4">

                <Lock
                  size={20}
                  className="text-[#39FF14]"
                />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  placeholder="********"
                  className="bg-transparent outline-none w-full"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="text-[#39FF14]"
                >

                  {showConfirmPassword ? (
                    <EyeOff
                      size={20}
                    />
                  ) : (
                    <Eye
                      size={20}
                    />
                  )}

                </button>

              </div>

            </div>

          </div>

          {/* SAVE */}
          <button
            onClick={() =>
              setShowSuccessPopup(true)
            }
            className="mt-10 w-full bg-[#39FF14] hover:bg-[#52ff33] text-black py-5 rounded-2xl font-extrabold transition-all duration-300 hover:scale-[1.02]"
          >
            Sauvegarder les modifications
          </button>

        </div>

        {/* ACCOUNT */}
        <div className="mt-10 border border-[#39FF14]/20 bg-black/60 backdrop-blur-2xl rounded-[35px] p-8 shadow-[0_0_25px_rgba(57,255,20,0.12)]">

          <div className="flex items-center justify-between flex-wrap gap-5">

            <div>

              <h2 className="text-3xl font-bold text-[#39FF14]">
                Session
              </h2>

              <p className="text-zinc-500 mt-2">
                Compte vérifié et sécurisé
              </p>

            </div>

            <button
              onClick={() =>
                setShowLogoutPopup(true)
              }
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-bold transition-all duration-300 hover:scale-[1.02]"
            >

              <LogOut size={20} />

              Logout

            </button>

          </div>

        </div>

      </section>

      {/* SUCCESS POPUP */}
      {showSuccessPopup && (

        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 px-5">

          <div className="w-full max-w-lg border border-[#39FF14]/30 bg-[#050505] rounded-[35px] p-10 text-center shadow-[0_0_50px_rgba(57,255,20,0.2)]">

            <div className="w-24 h-24 mx-auto rounded-full bg-[#39FF14]/10 border border-[#39FF14]/20 flex items-center justify-center text-[#39FF14]">

              <ShieldCheck size={45} />

            </div>

            <h2 className="mt-8 text-4xl font-extrabold text-[#39FF14]">
              Modifications enregistrées
            </h2>

            <p className="mt-5 text-zinc-400 leading-relaxed">
              Vos informations ont été mises à jour avec succès.
            </p>

            <button
              onClick={() =>
                setShowSuccessPopup(false)
              }
              className="mt-10 w-full bg-[#39FF14] hover:bg-[#52ff33] text-black py-5 rounded-2xl font-extrabold transition-all duration-300"
            >
              Terminer
            </button>

          </div>

        </div>
      )}

      {/* LOGOUT POPUP */}
      {showLogoutPopup && (

        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 px-5">

          <div className="w-full max-w-lg border border-red-500/30 bg-[#050505] rounded-[35px] p-10 text-center shadow-[0_0_50px_rgba(255,0,0,0.15)]">

            <div className="w-24 h-24 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">

              <LogOut size={45} />

            </div>

            <h2 className="mt-8 text-4xl font-extrabold text-red-400">
              Déconnexion
            </h2>

            <p className="mt-5 text-zinc-400 leading-relaxed">
              Voulez-vous vraiment vous déconnecter ?
            </p>

            <div className="grid grid-cols-2 gap-4 mt-10">

              <button
                onClick={() =>
                  setShowLogoutPopup(false)
                }
                className="border border-zinc-700 hover:border-zinc-500 py-4 rounded-2xl font-bold transition"
              >
                Annuler
              </button>

              <button
                onClick={async () => {

                  await supabase.auth.signOut();

                  window.location.href =
                    "/login";
                }}
                className="bg-red-500 hover:bg-red-600 py-4 rounded-2xl font-bold transition text-white"
              >
                Déconnexion
              </button>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}