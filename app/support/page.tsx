"use client";

import { useState } from "react";

import {
  ArrowLeft,
  MessageCircle,
  Phone,
  Mail,
  Send,
  CheckCircle2,
} from "lucide-react";

export default function SupportPage() {

  const [showPopup, setShowPopup] =
    useState(false);

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
              Assistance rapide
            </p>

            <h1 className="text-4xl md:text-5xl font-extrabold text-[#39FF14] drop-shadow-[0_0_12px_#39FF14] mt-2">
              Support Client
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

        {/* STATUS */}
        <div className="mt-10 border border-[#39FF14]/20 bg-black/60 backdrop-blur-2xl rounded-[35px] p-6 shadow-[0_0_20px_rgba(57,255,20,0.12)] flex items-center gap-4">

          <div className="w-4 h-4 rounded-full bg-[#39FF14] animate-pulse" />

          <div>

            <p className="font-bold text-[#39FF14] text-xl">
              Support disponible 24/7
            </p>

            <p className="text-zinc-500 mt-1">
              Notre équipe est prête à vous assister rapidement.
            </p>

          </div>

        </div>

        {/* CONTACT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

          {/* WHATSAPP */}
          <a
            href="https://wa.me/18298437267"
            target="_blank"
            className="border border-[#39FF14]/20 bg-black/60 backdrop-blur-2xl rounded-[35px] p-8 hover:border-[#39FF14] transition-all duration-300 hover:scale-[1.02] shadow-[0_0_20px_rgba(57,255,20,0.12)]"
          >

            <div className="w-16 h-16 rounded-2xl bg-[#39FF14]/10 border border-[#39FF14]/20 flex items-center justify-center text-[#39FF14]">

              <MessageCircle size={32} />

            </div>

            <h2 className="mt-6 text-3xl font-bold text-[#39FF14]">
              WhatsApp
            </h2>

            <p className="mt-4 text-zinc-400">
              +1 829-843-7267
            </p>

            <button className="mt-8 w-full bg-[#39FF14] hover:bg-[#52ff33] text-black py-4 rounded-2xl font-bold transition-all duration-300">
              Ouvrir WhatsApp
            </button>

          </a>

          {/* EMAIL */}
          <div className="border border-[#39FF14]/20 bg-black/60 backdrop-blur-2xl rounded-[35px] p-8 shadow-[0_0_20px_rgba(57,255,20,0.12)]">

            <div className="w-16 h-16 rounded-2xl bg-[#39FF14]/10 border border-[#39FF14]/20 flex items-center justify-center text-[#39FF14]">

              <Mail size={32} />

            </div>

            <h2 className="mt-6 text-3xl font-bold text-[#39FF14]">
              Email
            </h2>

            <p className="mt-4 text-zinc-400 break-all">
              akousoushop@gmail.com
            </p>

            <a
              href="mailto:akousoushop@gmail.com"
              className="mt-8 block text-center w-full bg-[#39FF14] hover:bg-[#52ff33] text-black py-4 rounded-2xl font-bold transition-all duration-300"
            >
              Envoyer Email
            </a>

          </div>

          {/* CALL */}
          <div className="border border-[#39FF14]/20 bg-black/60 backdrop-blur-2xl rounded-[35px] p-8 shadow-[0_0_20px_rgba(57,255,20,0.12)]">

            <div className="w-16 h-16 rounded-2xl bg-[#39FF14]/10 border border-[#39FF14]/20 flex items-center justify-center text-[#39FF14]">

              <Phone size={32} />

            </div>

            <h2 className="mt-6 text-3xl font-bold text-[#39FF14]">
              Assistance
            </h2>

            <p className="mt-4 text-zinc-400">
              829-554-0883
            </p>

            <a
              href="tel:8295540883"
              className="mt-8 block text-center w-full bg-[#39FF14] hover:bg-[#52ff33] text-black py-4 rounded-2xl font-bold transition-all duration-300"
            >
              Appeler maintenant
            </a>

          </div>

        </div>

        {/* FORM */}
        <div className="mt-12 border border-[#39FF14]/20 bg-black/60 backdrop-blur-2xl rounded-[40px] p-8 md:p-10 shadow-[0_0_30px_rgba(57,255,20,0.12)]">

          <h2 className="text-3xl font-bold text-[#39FF14]">
            Envoyer une demande
          </h2>

          {/* INPUTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">

            <input
              type="text"
              placeholder="Nom complet"
              className="bg-[#050505] border border-[#39FF14]/20 rounded-2xl px-5 py-5 outline-none focus:border-[#39FF14] transition-all"
            />

            <input
              type="text"
              placeholder="Sujet"
              className="bg-[#050505] border border-[#39FF14]/20 rounded-2xl px-5 py-5 outline-none focus:border-[#39FF14] transition-all"
            />

          </div>

          <textarea
            placeholder="Votre message..."
            rows={6}
            className="mt-5 w-full bg-[#050505] border border-[#39FF14]/20 rounded-2xl px-5 py-5 outline-none focus:border-[#39FF14] transition-all resize-none"
          />

          {/* BUTTON */}
          <button
            onClick={() =>
              setShowPopup(true)
            }
            className="mt-8 w-full bg-[#39FF14] hover:bg-[#52ff33] text-black py-5 rounded-[25px] font-extrabold flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.01]"
          >

            <Send size={22} />

            Envoyer la demande

          </button>

        </div>

      </section>

      {/* POPUP */}
      {showPopup && (

        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-5">

          <div className="w-full max-w-xl border border-[#39FF14]/20 bg-[#050505] rounded-[40px] p-10 shadow-[0_0_50px_rgba(57,255,20,0.2)] text-center relative overflow-hidden">

            {/* GLOW */}
            <div className="absolute top-[-120px] right-[-120px] w-[250px] h-[250px] bg-[#39FF14]/10 blur-3xl rounded-full" />

            <div className="relative z-10">

              <div className="w-24 h-24 rounded-full bg-[#39FF14]/10 border border-[#39FF14]/20 flex items-center justify-center text-[#39FF14] mx-auto">

                <CheckCircle2 size={52} />

              </div>

              <h2 className="mt-8 text-4xl font-extrabold text-[#39FF14]">
                Demande envoyée
              </h2>

              <p className="mt-5 text-zinc-400 text-lg leading-relaxed">
                Votre demande a été envoyée avec succès.
                Notre équipe vous répondra rapidement.
              </p>

              <button
                onClick={() =>
                  setShowPopup(false)
                }
                className="mt-10 w-full bg-[#39FF14] hover:bg-[#52ff33] text-black font-extrabold py-5 rounded-[25px] transition-all duration-300 hover:scale-[1.02]"
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