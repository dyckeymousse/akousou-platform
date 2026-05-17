"use client";

import { useState } from "react";

import {
  ArrowLeft,
  Smartphone,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { supabase } from "../../supabase";

import { useRouter } from "next/navigation";

export default function TransfertPage() {

  const router =
    useRouter();

  const [service, setService] =
    useState("MonCash");

  const [phone, setPhone] =
    useState("");

  const [receiver, setReceiver] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [popup, setPopup] =
    useState(false);

  const [popupMessage, setPopupMessage] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const conversionRate = 2.004;

  const amountNumber =
    Number(amount) || 0;

  const convertedAmount = (
    amountNumber * conversionRate
  ).toFixed(2);

  const fee =
    amountNumber * 0.02;

  const totalAmount =
    amountNumber + fee;

  const resetForm = () => {

    setPhone("");

    setReceiver("");

    setAmount("");
  };

  const handleValidation =
    async () => {

      if (loading) return;

      setLoading(true);

      try {

        if (
          !phone ||
          !receiver ||
          !amount
        ) {

          setSuccess(false);

          setPopupMessage(
            "Veuillez remplir tous les champs."
          );

          setPopup(true);

          setLoading(false);

          return;
        }

        if (
          phone.length !== 8
        ) {

          setSuccess(false);

          setPopupMessage(
            "Le numéro doit contenir 8 chiffres."
          );

          setPopup(true);

          setLoading(false);

          return;
        }

        const firstNumber =
          phone[0];

        // MONCASH VALIDATION
        if (
          service === "MonCash" &&
          firstNumber !== "3" &&
          firstNumber !== "4"
        ) {

          setSuccess(false);

          setPopupMessage(
            "Le numéro MonCash doit commencer par 3 ou 4."
          );

          setPopup(true);

          setLoading(false);

          return;
        }

        // NATCASH VALIDATION
        if (
          service === "NatCash" &&
          firstNumber !== "3" &&
          firstNumber !== "4" &&
          firstNumber !== "5"
        ) {

          setSuccess(false);

          setPopupMessage(
            "Le numéro NatCash doit commencer par 3, 4 ou 5."
          );

          setPopup(true);

          setLoading(false);

          return;
        }

        if (
          amountNumber < 500
        ) {

          setSuccess(false);

          setPopupMessage(
            "Le montant minimum est de 500 DOP."
          );

          setPopup(true);

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

          setSuccess(false);

          setPopupMessage(
            "Session expirée."
          );

          setPopup(true);

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

          setSuccess(false);

          setPopupMessage(
            "Utilisateur introuvable."
          );

          setPopup(true);

          setLoading(false);

          return;
        }

        // BLOCKED
        if (
          user.blocked
        ) {

          setSuccess(false);

          setPopupMessage(
            "Compte bloqué."
          );

          setPopup(true);

          setLoading(false);

          return;
        }

        // BALANCE CHECK
        if (
          totalAmount >
          Number(
            user.balance
          )
        ) {

          setSuccess(false);

          setPopupMessage(
            "Solde insuffisant."
          );

          setPopup(true);

          setLoading(false);

          return;
        }

        // REMOVE BALANCE
        const updatedBalance =
          Number(
            user.balance
          ) - totalAmount;

        const {
          error: updateError,
        } = await supabase
          .from("users")
          .update({
            balance:
              updatedBalance,
          })
          .eq(
            "auth_id",
            authUser.id
          );

        if (
          updateError
        ) {

          setSuccess(false);

          setPopupMessage(
            "Erreur mise à jour balance."
          );

          setPopup(true);

          setLoading(false);

          return;
        }

        // CREATE TRANSACTION
        const currentDate =
          new Date();

        const transactionId =
          `TRF-${Date.now()}`;

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

              phone_user:
                user.phone,

              user_email:
                user.email,

              type:
                `Transfert ${service}`,

              service,

              receiver_name:
                receiver,

              receiver_phone:
                phone,

              amount:
                totalAmount,

              amount_sent:
                amountNumber,

              fee,

              conversion:
                convertedAmount,

              status:
                "En attente",

              processed:
                false,

              date:
                currentDate.toLocaleDateString(),

              time:
                currentDate.toLocaleTimeString(),
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

          setSuccess(false);

          setPopupMessage(
            "Erreur lors du transfert."
          );

          setPopup(true);

          setLoading(false);

          return;
        }

        // RESET
        resetForm();

        setSuccess(true);

        setPopupMessage(
          "Votre transfert est en attente de validation. Une fois validé par notre équipe, le transfert sera effectué avec succès."
        );

        setPopup(true);

      } catch {

        setSuccess(false);

        setPopupMessage(
          "Une erreur est survenue."
        );

        setPopup(true);

      } finally {

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
              Taux actuel
            </p>

            <h1 className="text-4xl md:text-5xl font-extrabold text-[#39FF14] drop-shadow-[0_0_12px_#39FF14] mt-2">
              1 DOP = 2.004 HTG
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-12">

          {["MonCash", "NatCash"].map(
            (item) => (
              <button
                key={item}
                onClick={() => {

                  setService(item);

                  resetForm();
                }}
                className={`rounded-[30px] p-6 border transition-all duration-300 hover:scale-[1.02] active:scale-95 ${
                  service === item
                    ? "border-[#39FF14] bg-[#39FF14]/10 shadow-[0_0_30px_rgba(57,255,20,0.25)]"
                    : "border-[#39FF14]/20 bg-black/60"
                }`}
              >

                <Smartphone
                  size={40}
                  className="text-[#39FF14]"
                />

                <h3 className="mt-5 text-2xl font-bold">
                  {item}
                </h3>

              </button>
            )
          )}

        </div>

        <div className="mt-14 border border-[#39FF14]/20 bg-black/60 backdrop-blur-2xl rounded-[35px] p-8 shadow-[0_0_30px_rgba(57,255,20,0.15)]">

          <h2 className="text-3xl font-bold text-[#39FF14]">
            Transfert {service}
          </h2>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>

              <label className="text-zinc-400">
                Numéro téléphone
              </label>

              <div className="mt-3 flex items-center border border-[#39FF14]/30 rounded-2xl overflow-hidden bg-black">

                <div className="px-5 py-4 border-r border-[#39FF14]/20 text-[#39FF14] font-bold">
                  +509
                </div>

                <input
                  type="text"
                  placeholder="XXXXXXXX"
                  value={phone}
                  onChange={(e) => {

                    const value =
                      e.target.value.replace(
                        /\D/g,
                        ""
                      );

                    if (value.length <= 8) {
                      setPhone(value);
                    }
                  }}
                  className="flex-1 bg-black px-5 py-4 outline-none"
                />

              </div>

            </div>

            <div>

              <label className="text-zinc-400">
                Nom du bénéficiaire
              </label>

              <input
                type="text"
                placeholder="Nom complet"
                value={receiver}
                onChange={(e) =>
                  setReceiver(
                    e.target.value
                  )
                }
                className="mt-3 w-full bg-black border border-[#39FF14]/30 rounded-2xl px-5 py-4 outline-none focus:border-[#39FF14]"
              />

            </div>

            <div className="md:col-span-2">

              <label className="text-zinc-400">
                Montant DOP
              </label>

              <input
                type="number"
                placeholder="Minimum 500 DOP"
                value={amount}
                onChange={(e) =>
                  setAmount(
                    e.target.value
                  )
                }
                className="mt-3 w-full bg-black border border-[#39FF14]/30 rounded-2xl px-5 py-4 outline-none focus:border-[#39FF14]"
              />

            </div>

          </div>

          <div className="mt-10 border border-[#39FF14]/20 rounded-[30px] p-8 bg-black/60">

            <h3 className="text-2xl font-bold text-[#39FF14]">
              Détails de la transaction
            </h3>

            <p className="mt-5 text-xl text-zinc-300 leading-relaxed">

              Vous envoyez{" "}

              <span className="text-[#39FF14] font-bold">
                {convertedAmount} HTG
              </span>

              {" "}à{" "}

              <span className="text-[#39FF14] font-bold">
                {receiver || "-------"}
              </span>

            </p>

          </div>

          <button
            onClick={handleValidation}
            disabled={loading}
            className="mt-10 w-full bg-[#39FF14] hover:bg-[#52ff33] disabled:opacity-50 disabled:cursor-not-allowed text-black font-extrabold py-5 rounded-[25px] transition-all duration-300"
          >
            {loading
              ? "Validation..."
              : "Confirmer le transfert"}
          </button>

        </div>

      </section>

      {popup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center px-5">

          <div className={`w-full max-w-lg rounded-[35px] border p-10 ${
            success
              ? "border-[#39FF14] bg-[#020202]"
              : "border-red-500 bg-[#020202]"
          }`}>

            <div className="flex justify-center">

              <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
                success
                  ? "bg-[#39FF14]/10"
                  : "bg-red-500/10"
              }`}>

                {success ? (
                  <CheckCircle2
                    size={50}
                    className="text-[#39FF14]"
                  />
                ) : (
                  <XCircle
                    size={50}
                    className="text-red-400"
                  />
                )}

              </div>

            </div>

            <h2 className={`mt-8 text-3xl font-extrabold text-center ${
              success
                ? "text-[#39FF14]"
                : "text-red-400"
            }`}>

              {success
                ? "Transfert envoyé"
                : "Erreur"}

            </h2>

            <p className="mt-5 text-center text-zinc-300 leading-relaxed text-lg">
              {popupMessage}
            </p>

            <button
              onClick={() => {

                setPopup(false);

                if (
                  success
                ) {

                  router.push(
                    "/dashboard"
                  );
                }
              }}
              className={`mt-10 w-full py-5 rounded-[25px] font-extrabold transition-all duration-300 ${
                success
                  ? "bg-[#39FF14] hover:bg-[#52ff33] text-black"
                  : "bg-red-500 hover:bg-red-400 text-white"
              }`}
            >
              Fermer
            </button>

          </div>

        </div>
      )}

    </main>
  );
}