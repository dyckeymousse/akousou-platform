"use client";

import { useState } from "react";

import {
  ArrowLeft,
  Wallet,
  BadgeDollarSign,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { supabase } from "../../supabase";

import { useRouter } from "next/navigation";

export default function RechargePage() {

  const router =
    useRouter();

  const [service, setService] =
    useState("Wise");

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [tag, setTag] =
    useState("");

  const [binanceId, setBinanceId] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [popup, setPopup] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const usdToDop = 64;

  const amountNumber =
    Number(amount) || 0;

  const getFee = () => {

    if (amountNumber >= 5 && amountNumber <= 19) return 2;

    if (amountNumber >= 20 && amountNumber <= 39) return 3;

    if (amountNumber >= 40 && amountNumber <= 99) return 4;

    if (amountNumber >= 100 && amountNumber <= 199) return 6;

    if (amountNumber >= 200 && amountNumber <= 299) return 8;

    if (amountNumber >= 300 && amountNumber <= 399) return 10;

    if (amountNumber >= 400 && amountNumber <= 499) return 12;

    if (amountNumber >= 500)
      return amountNumber * 0.05;

    return 0;
  };

  const fee = getFee();

  const totalUsd =
    amountNumber + fee;

  const totalDop =
    totalUsd * usdToDop;

  const handleValidation =
    async () => {

      if (loading) return;

      setLoading(true);

      try {

        if (
          !name ||
          !email ||
          !amount
        ) {

          setSuccess(false);

          setPopup(
            "Veuillez remplir tous les champs."
          );

          setLoading(false);

          return;
        }

        if (
          service !== "Binance" &&
          !tag
        ) {

          setSuccess(false);

          setPopup(
            "Veuillez entrer votre tag."
          );

          setLoading(false);

          return;
        }

        if (
          service === "Binance" &&
          !binanceId
        ) {

          setSuccess(false);

          setPopup(
            "Veuillez entrer votre ID Binance."
          );

          setLoading(false);

          return;
        }

        if (
          amountNumber < 10
        ) {

          setSuccess(false);

          setPopup(
            "Le montant minimum est de 10 USD."
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

          setSuccess(false);

          setPopup(
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

          setSuccess(false);

          setPopup(
            "Utilisateur introuvable."
          );

          setLoading(false);

          return;
        }

        // BLOCKED
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

        // BALANCE CHECK
        if (
          Number(user.balance) <
          totalDop
        ) {

          setSuccess(false);

          setPopup(
            "Solde insuffisant."
          );

          setLoading(false);

          return;
        }

        // REMOVE BALANCE
        const updatedBalance =
          Number(
            user.balance
          ) - totalDop;

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

          setPopup(
            "Erreur mise à jour balance."
          );

          setLoading(false);

          return;
        }

        // CREATE TRANSACTION
        const currentDate =
          new Date();

        const transactionId =
          `REC-${Date.now()}`;

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
                "Recharge",

              service,

              recharge_name:
                name,

              recharge_email:
                email,

              recharge_tag:
                service ===
                "Binance"
                  ? binanceId
                  : tag,

              amount_usd:
                amountNumber,

              fee_usd:
                fee,

              total_usd:
                totalUsd,

              conversion:
                totalDop,

              amount:
                totalDop,

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

        if (
          transactionError
        ) {

          // RESTORE BALANCE IF ERROR
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

          setPopup(
            "Erreur lors de la recharge."
          );

          setLoading(false);

          return;
        }

        // RESET FORM
        setName("");

        setEmail("");

        setTag("");

        setBinanceId("");

        setAmount("");

        setSuccess(true);

        setPopup(
          "Votre recharge a été envoyée avec succès. Notre équipe procèdera à la vérification de votre demande dans les plus brefs délais."
        );

      } catch {

        setSuccess(false);

        setPopup(
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

      <section className="max-w-5xl mx-auto relative z-10">

        <div className="flex items-center justify-between flex-wrap gap-4">

          <div>

            <p className="text-zinc-400">
              Taux actuel
            </p>

            <h1 className="text-4xl md:text-5xl font-extrabold text-[#39FF14] drop-shadow-[0_0_12px_#39FF14] mt-2">
              1 USD = 64 DOP
            </h1>

          </div>

          <a
            href="/dashboard"
            className="border border-[#39FF14] hover:bg-[#39FF14]/10 transition px-5 py-3 rounded-2xl flex items-center gap-3 text-[#39FF14] shadow-[0_0_20px_rgba(57,255,20,0.2)]"
          >

            <ArrowLeft size={18} />

            Retour

          </a>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">

          {[
            "Wise",
            "Meru",
            "Binance",
          ].map((item) => (
            <button
              key={item}
              onClick={() =>
                setService(item)
              }
              className={`rounded-[30px] p-6 border transition-all duration-300 hover:scale-[1.02] active:scale-95 ${
                service === item
                  ? "border-[#39FF14] bg-[#39FF14]/10 shadow-[0_0_30px_rgba(57,255,20,0.25)]"
                  : "border-[#39FF14]/20 bg-black/60"
              }`}
            >

              <Wallet
                size={40}
                className="text-[#39FF14]"
              />

              <h3 className="mt-5 text-3xl font-bold">
                {item}
              </h3>

              <p className="mt-3 text-zinc-400">
                Recharge rapide et sécurisée.
              </p>

            </button>
          ))}

        </div>

        <div className="mt-14 border border-[#39FF14]/20 bg-black/60 backdrop-blur-2xl rounded-[35px] p-8 shadow-[0_0_30px_rgba(57,255,20,0.15)]">

          <h2 className="text-3xl font-bold text-[#39FF14]">
            Recharge {service}
          </h2>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>

              <label className="text-zinc-400">
                Nom du compte
              </label>

              <input
                type="text"
                placeholder="Nom du compte"
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
                className="mt-3 w-full bg-black border border-[#39FF14]/30 rounded-2xl px-5 py-4 outline-none focus:border-[#39FF14]"
              />

            </div>

            <div>

              <label className="text-zinc-400">
                Email
              </label>

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                className="mt-3 w-full bg-black border border-[#39FF14]/30 rounded-2xl px-5 py-4 outline-none focus:border-[#39FF14]"
              />

            </div>

            <div>

              <label className="text-zinc-400">
                {service ===
                "Binance"
                  ? "ID Compte"
                  : "Tag"}
              </label>

              <input
                type="text"
                placeholder={
                  service ===
                  "Binance"
                    ? "ID Binance"
                    : "Tag"
                }
                value={
                  service ===
                  "Binance"
                    ? binanceId
                    : tag
                }
                onChange={(e) => {

                  if (
                    service ===
                    "Binance"
                  ) {

                    const value =
                      e.target.value.replace(
                        /\D/g,
                        ""
                      );

                    if (
                      value.length <=
                      10
                    ) {

                      setBinanceId(
                        value
                      );
                    }

                  } else {

                    setTag(
                      e.target.value
                    );

                  }
                }}
                className="mt-3 w-full bg-black border border-[#39FF14]/30 rounded-2xl px-5 py-4 outline-none focus:border-[#39FF14]"
              />

            </div>

            <div>

              <label className="text-zinc-400">
                Montant USD
              </label>

              <input
                type="number"
                placeholder="Minimum 10 USD"
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

            <div className="flex items-center gap-3 text-[#39FF14]">

              <BadgeDollarSign size={28} />

              <h3 className="text-2xl font-bold">
                Résumé de la recharge
              </h3>

            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="border border-[#39FF14]/20 rounded-2xl p-5 bg-black">

                <p className="text-zinc-500">
                  Montant
                </p>

                <h4 className="mt-2 text-3xl font-bold text-[#39FF14]">
                  {amountNumber} USD
                </h4>

              </div>

              <div className="border border-[#39FF14]/20 rounded-2xl p-5 bg-black">

                <p className="text-zinc-500">
                  Frais
                </p>

                <h4 className="mt-2 text-3xl font-bold text-[#39FF14]">
                  {fee.toFixed(2)} USD
                </h4>

              </div>

              <div className="border border-[#39FF14]/20 rounded-2xl p-5 bg-black">

                <p className="text-zinc-500">
                  Total USD
                </p>

                <h4 className="mt-2 text-3xl font-bold text-[#39FF14]">
                  {totalUsd.toFixed(2)} USD
                </h4>

              </div>

              <div className="border border-[#39FF14]/20 rounded-2xl p-5 bg-black">

                <p className="text-zinc-500">
                  Équivalent DOP
                </p>

                <h4 className="mt-2 text-3xl font-bold text-[#39FF14]">
                  {totalDop.toFixed(2)} DOP
                </h4>

              </div>

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
              : "Valider la recharge"}
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
                  ? "Recharge envoyée"
                  : "Erreur"}

              </h2>

              <p className="mt-5 text-center text-zinc-300 text-lg leading-relaxed">
                {popup}
              </p>

              <button
                onClick={() => {

                  setPopup("");

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

        </div>
      )}

    </main>
  );
}