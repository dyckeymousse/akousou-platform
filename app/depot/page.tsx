"use client";

import { useState } from "react";

import {
  ArrowLeft,
  UploadCloud,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { supabase } from "../../supabase";

export default function DepotPage() {

  const [amount, setAmount] =
    useState("");

  const [proof, setProof] =
    useState<File | null>(
      null
    );

  const [popup, setPopup] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const amountNumber =
    Number(amount) || 0;

  const handleValidation =
    async () => {

      if (
        !amount ||
        !proof
      ) {

        setSuccess(false);

        setPopup(
          "Veuillez remplir tous les champs."
        );

        return;
      }

      if (
        amountNumber < 1500
      ) {

        setSuccess(false);

        setPopup(
          "Le montant minimum est de 1500 DOP."
        );

        return;
      }

      try {

        setLoading(true);

        // GET CONNECTED USER
        const {
          data: sessionData,
        } = await supabase.auth.getUser();

        const authUser =
          sessionData.user;

        if (!authUser) {

          setSuccess(false);

          setPopup(
            "Session expirée."
          );

          setLoading(false);

          return;
        }

        // GET USER INFOS
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

        if (!user) {

          setSuccess(false);

          setPopup(
            "Utilisateur introuvable."
          );

          setLoading(false);

          return;
        }

        // BLOCKED ACCOUNT
        if (
          user.blocked
        ) {

          setSuccess(false);

          setPopup(
            "Compte bloqué."
          );

          setLoading(false);

          return;
        }

        // IMAGE NAME
        const fileName =
          `${Date.now()}-${proof.name}`;

        // UPLOAD IMAGE
        const {
          error: uploadError,
        } = await supabase.storage
          .from("proofs")
          .upload(
            fileName,
            proof
          );

        if (uploadError) {

          setSuccess(false);

          setPopup(
            "Erreur lors du téléversement de l'image."
          );

          setLoading(false);

          return;
        }

        // IMAGE URL
        const {
          data: imageData,
        } = supabase.storage
          .from("proofs")
          .getPublicUrl(
            fileName
          );

        const currentDate =
          new Date();

        const transactionId =
          `DEP-${Date.now()}`;

        // SAVE TRANSACTION
        const {
          error:
            transactionError,
        } = await supabase
          .from(
            "transactions"
          )
          .insert([
            {
              transaction_id:
                transactionId,

              auth_id:
                authUser.id,

              fullname:
                user.fullname,

              phone:
                user.phone,

              user_email:
                user.email,

              type:
                "Dépôt",

              method:
                "BHD",

              amount:
                amountNumber,

              proof:
                imageData.publicUrl,

              status:
                "En attente",

              processed:
                false,

              blocked:
                false,

              date:
                currentDate.toLocaleDateString(),

              time:
                currentDate.toLocaleTimeString(),
            },
          ]);

        if (
          transactionError
        ) {

          setSuccess(false);

          setPopup(
            "Erreur lors du dépôt."
          );

          setLoading(false);

          return;
        }

        setSuccess(true);

        setPopup(
          "Votre dépôt est actuellement en cours de vérification par notre équipe. Une fois validé, le montant sera automatiquement ajouté à votre compte."
        );

        setAmount("");

        setProof(null);

        setLoading(false);

      } catch {

        setSuccess(false);

        setPopup(
          "Une erreur est survenue."
        );

        setLoading(false);
      }
    };

  return (
    <main className="min-h-screen bg-[#020202] text-white relative overflow-hidden px-5 py-10">

      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-[#39FF14]/20 blur-3xl rounded-full" />

      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-[#00FF88]/20 blur-3xl rounded-full" />

      <section className="max-w-5xl mx-auto relative z-10">

        <div className="flex items-center justify-between flex-wrap gap-4">

          <div>

            <p className="text-zinc-400">
              Dépôt sécurisé
            </p>

            <h1 className="text-4xl md:text-5xl font-extrabold text-[#39FF14] drop-shadow-[0_0_12px_#39FF14] mt-2">
              Effectuer un dépôt
            </h1>

          </div>

          <a
            href="/dashboard"
            className="border border-[#39FF14] hover:bg-[#39FF14]/10 transition px-5 py-3 rounded-2xl flex items-center gap-3 text-[#39FF14]"
          >

            <ArrowLeft size={18} />

            Retour

          </a>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">

          <div className="border border-zinc-800 bg-zinc-950/60 rounded-[30px] p-6 opacity-60">

            <h3 className="text-2xl font-bold">
              Banreservas
            </h3>

            <div className="mt-4 inline-flex px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              Indisponible
            </div>

          </div>

          <div className="border border-zinc-800 bg-zinc-950/60 rounded-[30px] p-6 opacity-60">

            <h3 className="text-2xl font-bold">
              Popular
            </h3>

            <div className="mt-4 inline-flex px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              Indisponible
            </div>

          </div>

          <div className="border border-[#39FF14] bg-black rounded-[35px] p-8 shadow-[0_0_35px_rgba(57,255,20,0.35)] relative overflow-hidden">

            <div className="absolute top-[-60px] right-[-60px] w-[180px] h-[180px] bg-[#39FF14]/10 blur-3xl rounded-full" />

            <h3 className="text-3xl font-extrabold text-[#39FF14] relative z-10">
              BHD
            </h3>

            <div className="mt-6 space-y-4 relative z-10">

              <div>

                <p className="text-zinc-500 text-sm">
                  Nom
                </p>

                <p className="font-semibold text-lg">
                  Kenia Martinez Shuit
                </p>

              </div>

              <div>

                <p className="text-zinc-500 text-sm">
                  Compte
                </p>

                <p className="font-semibold text-lg">
                  Épargne
                </p>

              </div>

              <div>

                <p className="text-zinc-500 text-sm">
                  Numéro compte
                </p>

                <p className="font-semibold text-xl text-[#39FF14]">
                  29360710022
                </p>

              </div>

            </div>

          </div>

        </div>

        <div className="mt-14 border border-[#39FF14]/20 bg-black/60 backdrop-blur-2xl rounded-[35px] p-8 shadow-[0_0_30px_rgba(57,255,20,0.15)]">

          <h2 className="text-3xl font-bold text-[#39FF14]">
            Informations du dépôt
          </h2>

          <div className="mt-8 flex flex-col gap-6">

            <div>

              <label className="text-zinc-400">
                Montant du dépôt
              </label>

              <input
                type="number"
                placeholder="Minimum 1500 DOP"
                value={amount}
                onChange={(e) =>
                  setAmount(
                    e.target.value
                  )
                }
                className="mt-3 w-full bg-black border border-[#39FF14]/30 rounded-2xl px-5 py-4 outline-none focus:border-[#39FF14]"
              />

            </div>

            <div>

              <label className="text-zinc-400">
                Télécharger une preuve
              </label>

              <label className="mt-3 border-2 border-dashed border-[#39FF14]/30 hover:border-[#39FF14] transition rounded-[30px] p-10 flex flex-col items-center justify-center text-center cursor-pointer bg-black/40">

                <UploadCloud
                  size={50}
                  className="text-[#39FF14]"
                />

                <p className="mt-4 text-lg font-semibold">
                  Cliquez pour téléverser une image
                </p>

                <p className="mt-2 text-zinc-500 text-sm">
                  JPG, PNG ou JPEG
                </p>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    setProof(
                      e.target.files?.[0] ||
                        null
                    )
                  }
                />

              </label>

              {proof && (
                <p className="mt-3 text-[#39FF14] text-sm">
                  Fichier sélectionné :{" "}
                  {proof.name}
                </p>
              )}

            </div>

          </div>

          <button
            onClick={
              handleValidation
            }
            disabled={loading}
            className="mt-10 w-full bg-[#39FF14] hover:bg-[#52ff33] disabled:opacity-50 disabled:cursor-not-allowed text-black font-extrabold py-5 rounded-[25px] transition-all duration-300"
          >
            {loading
              ? "Validation..."
              : "Valider le dépôt"}
          </button>

        </div>

      </section>

      {popup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl px-5">

          <div className={`relative w-full max-w-xl overflow-hidden rounded-[40px] border p-10 ${
            success
              ? "border-[#39FF14]/30 bg-[#050505]"
              : "border-red-500/30 bg-[#050505]"
          }`}>

            <div className="relative z-10">

              <div className="flex justify-center">

                <div className={`w-28 h-28 rounded-full flex items-center justify-center border ${
                  success
                    ? "bg-[#39FF14]/10 border-[#39FF14]/20"
                    : "bg-red-500/10 border-red-500/20"
                }`}>

                  {success ? (
                    <CheckCircle2
                      size={58}
                      className="text-[#39FF14]"
                    />
                  ) : (
                    <XCircle
                      size={58}
                      className="text-red-400"
                    />
                  )}

                </div>

              </div>

              <h2 className={`mt-8 text-center text-4xl font-extrabold ${
                success
                  ? "text-[#39FF14]"
                  : "text-red-400"
              }`}>

                {success
                  ? "Dépôt envoyé"
                  : "Erreur"}

              </h2>

              <p className="mt-5 text-center text-zinc-300 text-lg leading-relaxed">
                {popup}
              </p>

              <button
                onClick={() => {

                  setPopup("");

                  if (success) {

                    window.location.href =
                      "/dashboard";
                  }
                }}
                className={`mt-8 w-full py-4 rounded-2xl font-extrabold transition-all duration-300 ${
                  success
                    ? "bg-[#39FF14] hover:bg-[#52ff33] text-black"
                    : "bg-red-500 hover:bg-red-400 text-white"
                }`}
              >

                Fermer

              </button>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}