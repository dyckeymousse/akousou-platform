"use client";

import { useState } from "react";

import {
  ArrowLeft,
  Landmark,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import { supabase } from "../../supabase";

import { useRouter } from "next/navigation";

export default function RetraitPage() {

  const router =
    useRouter();

  const [method, setMethod] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [fullname, setFullname] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [showPopup, setShowPopup] =
    useState(false);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const methods = [
    "Caribe Express",
    "MonCash",
    "NatCash",
    "Zelle",
    "Western Union",
  ];

  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const value =
      e.target.value.replace(
        /\D/g,
        ""
      );

    if (
      value.length <= 12
    ) {

      setPhone(value);
    }
  };

  const resetForm = () => {

    setFullname("");

    setPhone("");

    setMethod("");

    setAmount("");

    setShowPopup(false);

    setError("");
  };

  const handleSubmit =
    async () => {

      if (loading) return;

      setLoading(true);

      setError("");

      try {

        if (
          !fullname ||
          !phone ||
          !method ||
          !amount
        ) {

          setError(
            "Veuillez remplir tous les champs."
          );

          setLoading(false);

          return;
        }

        if (
          phone.length < 8
        ) {

          setError(
            "Numéro invalide."
          );

          setLoading(false);

          return;
        }

        if (
          Number(amount) < 500
        ) {

          setError(
            "Le montant minimum est de 500 DOP."
          );

          setLoading(false);

          return;
        }

        // GET AUTH USER
        const {
          data: authData,
        } = await supabase.auth.getUser();

        const authUser =
          authData.user;

        if (!authUser) {

          setError(
            "Session expirée."
          );

          setLoading(false);

          return;
        }

        // GET USER
        const {
          data: user,
          error: userError,
        } = await supabase
          .from("users")
          .select("*")
          .eq(
            "auth_id",
            authUser.id
          )
          .single();

        if (
          userError ||
          !user
        ) {

          setError(
            "Utilisateur introuvable."
          );

          setLoading(false);

          return;
        }

        // BLOCKED
        if (
          user.blocked
        ) {

          setError(
            "Compte bloqué."
          );

          setLoading(false);

          return;
        }

        const amountNumber =
          Number(amount);

        // BALANCE CHECK
        if (
          amountNumber >
          Number(
            user.balance
          )
        ) {

          setError(
            "Solde insuffisant."
          );

          setLoading(false);

          return;
        }

        // REMOVE BALANCE
        const newBalance =
          Number(
            user.balance
          ) - amountNumber;

        const {
          error: balanceError,
        } = await supabase
          .from("users")
          .update({
            balance:
              newBalance,
          })
          .eq(
            "auth_id",
            authUser.id
          );

        if (
          balanceError
        ) {

          setError(
            "Erreur mise à jour balance."
          );

          setLoading(false);

          return;
        }

        // CREATE TRANSACTION
        const currentDate =
          new Date();

        const transactionId =
          `RET-${Date.now()}`;

         const {
  error:
    transactionError,
} = await supabase
  .from(
    "transactions"
  )
  .insert([
    {
      transaction_code:
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
        "Retrait",

      service:
        method,

      receiver_name:
        fullname,

      receiver_number:
        phone,

      amount:
        amountNumber,

      total_dop:
        amountNumber,

      status:
        "En attente",

      processed:
        false,
    },
  ]);
        // RESTORE BALANCE IF ERROR
        if (
          transactionError
        ) {

          await supabase
            .from("users")
            .update({
              balance:
                user.balance,
            })
            .eq(
              "auth_id",
              authUser.id
            );

          setError(
            "Erreur retrait."
          );

          setLoading(false);

          return;
        }

        // SUCCESS
        resetForm();

        setShowPopup(true);

      } catch {

        setError(
          "Une erreur est survenue."
        );

      } finally {

        setLoading(false);
      }
    };

  return (
    <main className="min-h-screen bg-[#020202] text-white relative overflow-hidden px-5 py-10">

      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-[#39FF14]/20 blur-3xl rounded-full" />

      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-[#00FF88]/20 blur-3xl rounded-full" />

      <section className="max-w-3xl mx-auto relative z-10">

        <div className="flex items-center justify-between flex-wrap gap-4">

          <div>

            <p className="text-zinc-400">
              Retrait sécurisé
            </p>

            <h1 className="text-4xl md:text-5xl font-extrabold text-[#39FF14] drop-shadow-[0_0_12px_#39FF14] mt-2">
              Retrait
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

        <div className="mt-12 border border-[#39FF14]/20 bg-black/60 backdrop-blur-2xl rounded-[40px] p-8 md:p-10 shadow-[0_0_30px_rgba(57,255,20,0.12)] relative overflow-hidden">

          <div className="absolute top-[-120px] right-[-120px] w-[250px] h-[250px] bg-[#39FF14]/10 blur-3xl rounded-full" />

          <div className="relative z-10 w-20 h-20 rounded-3xl bg-[#39FF14]/10 border border-[#39FF14]/20 flex items-center justify-center text-[#39FF14]">

            <Landmark size={40} />

          </div>

          <div className="mt-8 relative z-10">

            <h2 className="text-3xl font-bold text-[#39FF14]">
              Formulaire de retrait
            </h2>

            <p className="text-zinc-500 mt-2">
              Effectuez votre demande de retrait rapidement.
            </p>

          </div>

          {error && (

            <div className="mt-8 flex items-center gap-3 border border-red-500/30 bg-red-500/10 text-red-400 rounded-2xl px-5 py-4 relative z-10">

              <AlertTriangle size={22} />

              <span className="font-semibold">
                {error}
              </span>

            </div>
          )}

          <div className="mt-10 space-y-6 relative z-10">

            <div>

              <label className="text-zinc-400">
                Nom complet
              </label>

              <input
                type="text"
                value={fullname}
                onChange={(e) =>
                  setFullname(
                    e.target.value
                  )
                }
                placeholder="Jean Client"
                className="mt-3 w-full bg-[#050505] border border-[#39FF14]/20 rounded-2xl px-5 py-5 outline-none focus:border-[#39FF14] transition-all"
              />

            </div>

            <div>

              <label className="text-zinc-400">
                Numéro contact
              </label>

              <div className="mt-3 flex items-center border border-[#39FF14]/20 bg-[#050505] rounded-2xl overflow-hidden">

                <input
                  type="text"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="509XXXXXXXX"
                  className="w-full bg-transparent px-5 py-5 outline-none"
                />

              </div>

            </div>

            <div>

              <label className="text-zinc-400">
                Méthode de retrait
              </label>

              <input
                type="text"
                value={method}
                onChange={(e) => {

                  setMethod(
                    e.target.value
                  );
                }}
                list="methods"
                placeholder="Caribe Express / MonCash / NatCash..."
                className="mt-3 w-full bg-[#050505] border border-[#39FF14]/20 rounded-2xl px-5 py-5 outline-none focus:border-[#39FF14] transition-all"
              />

              <datalist id="methods">

                {methods.map(
                  (item) => (

                    <option
                      key={item}
                      value={item}
                    />
                  )
                )}

              </datalist>

            </div>

            <div>

              <label className="text-zinc-400">
                Montant
              </label>

              <input
                type="number"
                value={amount}
                onChange={(e) =>
                  setAmount(
                    e.target.value
                  )
                }
                placeholder="Minimum 500 DOP"
                className="mt-3 w-full bg-[#050505] border border-[#39FF14]/20 rounded-2xl px-5 py-5 outline-none focus:border-[#39FF14] transition-all"
              />

            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-4 bg-[#39FF14] hover:bg-[#52ff33] disabled:opacity-50 disabled:cursor-not-allowed text-black py-5 rounded-[25px] font-extrabold transition-all duration-300 hover:scale-[1.01] shadow-[0_0_30px_rgba(57,255,20,0.25)]"
            >
              {loading
                ? "Validation..."
                : "Confirmer le retrait"}
            </button>

          </div>

        </div>

      </section>

      {showPopup && (

        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 px-5">

          <div className="w-full max-w-xl border border-[#39FF14]/20 bg-[#050505] rounded-[40px] p-10 shadow-[0_0_50px_rgba(57,255,20,0.2)] text-center relative overflow-hidden">

            <div className="absolute top-[-120px] right-[-120px] w-[250px] h-[250px] bg-[#39FF14]/10 blur-3xl rounded-full" />

            <div className="relative z-10">

              <div className="w-24 h-24 rounded-full bg-[#39FF14]/10 border border-[#39FF14]/20 flex items-center justify-center text-[#39FF14] mx-auto">

                <CheckCircle2 size={52} />

              </div>

              <h2 className="mt-8 text-4xl font-extrabold text-[#39FF14]">
                Retrait en vérification
              </h2>

              <p className="mt-5 text-zinc-400 text-lg leading-relaxed">
                Votre demande de retrait est actuellement en vérification.
                Les fonds seront envoyés après validation de notre équipe.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">

                <button
                  onClick={() =>
                    router.push(
                      "/dashboard"
                    )
                  }
                  className="bg-[#39FF14] hover:bg-[#52ff33] text-black font-extrabold py-5 rounded-[25px] transition-all duration-300 text-center"
                >
                  Terminer
                </button>

                <button
                  onClick={() => {

                    resetForm();
                  }}
                  className="border border-[#39FF14] text-[#39FF14] hover:bg-[#39FF14]/10 font-bold py-5 rounded-[25px] transition-all duration-300"
                >
                  Nouveau retrait
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}