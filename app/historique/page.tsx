"use client";

import { useEffect, useState } from "react";

import jsPDF from "jspdf";

import {
  ArrowLeft,
  Clock3,
  CheckCircle2,
  XCircle,
  ReceiptText,
  Download,
} from "lucide-react";

import { supabase } from "../../supabase";

export default function HistoriquePage() {

  const [filter, setFilter] =
    useState("Tous");

  const [
    selectedReceipt,
    setSelectedReceipt,
  ] = useState<any>(null);

  const [
    transactions,
    setTransactions,
  ] = useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    loadTransactions();

  }, []);

  const loadTransactions =
    async () => {

      try {

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

        // GET USER
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

          window.location.href =
            "/login";

          return;
        }

        // BLOCKED
        if (
          user.blocked
        ) {

          await supabase.auth.signOut();

          window.location.href =
            "/login";

          return;
        }

        // GET TRANSACTIONS
        const {
          data,
        } = await supabase
          .from(
            "transactions"
          )
          .select("*")
          .eq(
            "auth_id",
            authUser.id
          )
          .order(
            "id",
            {
              ascending: false,
            }
          );

        if (!data) {

          setTransactions([]);

          return;
        }

        const formattedTransactions =
          data.map(
            (
              item: any
            ) => {

              let status =
                "En vérification";

              if (
                item.status ===
                "Validé"
              ) {

                status =
                  "Réussi";
              }

              if (
                item.status ===
                "Rejeté"
              ) {

                status =
                  "Échoué";
              }

              return {
                ...item,

                status,

                service:
                  item.withdrawal_method ||
                  item.method ||
                  item.type,

                beneficiary:
                  item.receiver_name ||
                  item.fullname ||
                  "Utilisateur",

                conversion:
                  item.conversion ||
                  "-",
              };
            }
          );

        setTransactions(
          formattedTransactions
        );

      } catch {

        console.log(
          "Erreur historique"
        );

      } finally {

        setLoading(false);
      }
    };

  const filteredTransactions =
    filter === "Tous"
      ? transactions
      : transactions.filter(
          (item) =>
            item.type
              ?.toLowerCase()
              .includes(
                filter.toLowerCase()
              )
        );

  const getStatusStyle = (
    status: string
  ) => {

    if (
      status === "Réussi"
    ) {

      return {
        color:
          "text-[#39FF14]",
        bg:
          "bg-[#39FF14]/10",
        border:
          "border-[#39FF14]/30",
        icon: (
          <CheckCircle2 size={18} />
        ),
      };
    }

    if (
      status ===
      "En vérification"
    ) {

      return {
        color:
          "text-yellow-400",
        bg:
          "bg-yellow-500/10",
        border:
          "border-yellow-500/30",
        icon: (
          <Clock3 size={18} />
        ),
      };
    }

    return {
      color:
        "text-red-400",
      bg:
        "bg-red-500/10",
      border:
        "border-red-500/30",
      icon: (
        <XCircle size={18} />
      ),
    };
  };

  const downloadReceipt =
    async () => {

      if (!selectedReceipt)
        return;

      try {

        const pdf =
          new jsPDF(
            "p",
            "mm",
            "a4"
          );

        // BACKGROUND
        pdf.setFillColor(
          5,
          5,
          5
        );

        pdf.rect(
          0,
          0,
          210,
          297,
          "F"
        );

        // TOP BAR
        pdf.setFillColor(
          57,
          255,
          20
        );

        pdf.rect(
          0,
          0,
          210,
          8,
          "F"
        );

        // HEADER
        pdf.setTextColor(
          57,
          255,
          20
        );

        pdf.setFontSize(
          28
        );

        pdf.text(
          "Akousou Shop & GLS",
          20,
          28
        );

        pdf.setTextColor(
          180,
          180,
          180
        );

        pdf.setFontSize(
          13
        );

        pdf.text(
          "Recu officiel de transaction",
          20,
          38
        );

        // LINE
        pdf.setDrawColor(
          57,
          255,
          20
        );

        pdf.setLineWidth(
          0.6
        );

        pdf.line(
          20,
          48,
          190,
          48
        );

        // STATUS BOX
        if (
          selectedReceipt.status ===
          "Réussi"
        ) {

          pdf.setFillColor(
            57,
            255,
            20
          );

        } else if (
          selectedReceipt.status ===
          "En vérification"
        ) {

          pdf.setFillColor(
            255,
            204,
            0
          );

        } else {

          pdf.setFillColor(
            255,
            80,
            80
          );
        }

        pdf.roundedRect(
          140,
          20,
          50,
          14,
          3,
          3,
          "F"
        );

        pdf.setTextColor(
          0,
          0,
          0
        );

        pdf.setFontSize(
          11
        );

        pdf.text(
          selectedReceipt.status,
          152,
          29
        );

        // CONTENT
        let y = 70;

        const addRow = (
          label: string,
          value: string
        ) => {

          pdf.setFillColor(
            15,
            15,
            15
          );

          pdf.roundedRect(
            18,
            y - 8,
            174,
            14,
            3,
            3,
            "F"
          );

          pdf.setTextColor(
            120,
            120,
            120
          );

          pdf.setFontSize(
            12
          );

          pdf.text(
            label,
            25,
            y
          );

          pdf.setTextColor(
            255,
            255,
            255
          );

          pdf.setFontSize(
            13
          );

          pdf.text(
            value || "-",
            90,
            y
          );

          y += 20;
        };

        addRow(
          "Transaction",
          selectedReceipt.type
        );

        addRow(
          "Service",
          selectedReceipt.service
        );

        addRow(
          "Montant",
          `${selectedReceipt.amount} DOP`
        );

        addRow(
          "Conversion",
          selectedReceipt.conversion
        );

        addRow(
          "Beneficiaire",
          selectedReceipt.beneficiary
        );

        addRow(
          "Telephone",
          selectedReceipt.contact_phone ||
            "-"
        );

        addRow(
          "Date",
          selectedReceipt.date
        );

        addRow(
          "Heure",
          selectedReceipt.time
        );

        addRow(
          "ID Transaction",
          selectedReceipt.transaction_id
        );

        // FOOTER
        pdf.setDrawColor(
          57,
          255,
          20
        );

        pdf.line(
          20,
          250,
          190,
          250
        );

        pdf.setTextColor(
          57,
          255,
          20
        );

        pdf.setFontSize(
          14
        );

        pdf.text(
          "Merci d'utiliser Akousou Shop & GLS.",
          20,
          268
        );

        pdf.setTextColor(
          140,
          140,
          140
        );

        pdf.setFontSize(
          11
        );

        pdf.text(
          "Service rapide • Securise • Professionnel",
          20,
          278
        );

        pdf.save(
          `receipt-${selectedReceipt.transaction_id}.pdf`
        );

      } catch (error) {

        console.log(
          "PDF ERROR:",
          error
        );
      }
    };

  if (loading) {

    return (
      <main className="min-h-screen bg-[#020202] text-white flex items-center justify-center">

        <h1 className="text-3xl font-bold text-[#39FF14] animate-pulse">
          Chargement...
        </h1>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#020202] text-white relative overflow-hidden px-5 py-10">

      {/* BACKGROUND */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-[#39FF14]/20 blur-3xl rounded-full" />

      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-[#00FF88]/20 blur-3xl rounded-full" />

      {/* CONTENT */}
      <section className="max-w-6xl mx-auto relative z-10">

        {/* HEADER */}
        <div className="flex items-center justify-between flex-wrap gap-4">

          <div>

            <p className="text-zinc-400">
              Historique complet
            </p>

            <h1 className="text-4xl md:text-5xl font-extrabold text-[#39FF14] drop-shadow-[0_0_12px_#39FF14] mt-2">
              Historique des transactions
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

        {/* FILTERS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-12">

          {[
            "Tous",
            "Recharge",
            "Dépôt",
            "Transfert",
            "Retrait",
          ].map((item) => (

            <button
              key={item}
              onClick={() =>
                setFilter(item)
              }
              className={`py-4 rounded-2xl border font-bold transition-all duration-300 hover:scale-[1.02] active:scale-95 ${
                filter === item
                  ? "border-[#39FF14] bg-[#39FF14]/10 text-[#39FF14] shadow-[0_0_20px_rgba(57,255,20,0.25)]"
                  : "border-[#39FF14]/20 bg-black/60 text-zinc-300"
              }`}
            >
              {item}
            </button>
          ))}

        </div>

        {/* EMPTY */}
        {filteredTransactions.length ===
          0 && (

          <div className="mt-16 text-center border border-[#39FF14]/20 bg-black/60 rounded-[35px] p-12">

            <h2 className="text-3xl font-bold text-[#39FF14]">
              Aucun historique
            </h2>

            <p className="mt-4 text-zinc-500">
              Aucune transaction disponible.
            </p>

          </div>
        )}

        {/* TRANSACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">

          {filteredTransactions.map(
            (
              transaction,
              index
            ) => {

              const statusStyle =
                getStatusStyle(
                  transaction.status
                );

              return (
                <div
                  key={index}
                  className="border border-[#39FF14]/20 bg-black/60 backdrop-blur-2xl rounded-[35px] p-8 shadow-[0_0_25px_rgba(57,255,20,0.12)] hover:border-[#39FF14]/40 transition-all duration-300"
                >

                  <div className="w-16 h-16 rounded-2xl bg-[#39FF14]/10 border border-[#39FF14]/20 flex items-center justify-center text-[#39FF14]">

                    <ReceiptText size={32} />

                  </div>

                  <h2 className="mt-6 text-3xl font-bold text-[#39FF14]">
                    {transaction.type}
                  </h2>

                  <p className="mt-4 text-2xl font-bold text-white">
                    {transaction.amount} DOP
                  </p>

                  <p className="mt-3 text-zinc-500">
                    {transaction.date}
                  </p>

                  <div className={`mt-6 inline-flex items-center gap-3 px-5 py-3 rounded-2xl border ${statusStyle.bg} ${statusStyle.border} ${statusStyle.color}`}>

                    {statusStyle.icon}

                    <span className="font-semibold">
                      {transaction.status}
                    </span>

                  </div>

                  <button
                    onClick={() =>
                      setSelectedReceipt(
                        transaction
                      )
                    }
                    className="mt-8 w-full bg-[#39FF14] hover:bg-[#52ff33] text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02]"
                  >

                    <Download size={20} />

                    Télécharger le reçu

                  </button>

                </div>
              );
            }
          )}

        </div>

      </section>

      {/* RECEIPT */}
      {selectedReceipt && (

        <div className="fixed inset-0 bg-[#020202] z-50 overflow-y-auto">

          <div className="min-h-screen px-5 py-10 flex items-center justify-center">

            <div
              className="w-full max-w-3xl border border-[#39FF14]/30 bg-black rounded-[40px] p-8 md:p-14 shadow-[0_0_60px_rgba(57,255,20,0.25)] relative overflow-hidden"
            >

              <div className="absolute top-[-120px] right-[-120px] w-[300px] h-[300px] bg-[#39FF14]/10 blur-3xl rounded-full" />

              <div className="relative z-10 text-center">

                <h1 className="text-5xl md:text-6xl font-extrabold text-[#39FF14] drop-shadow-[0_0_15px_#39FF14]">
                  Akousou Shop & GLS
                </h1>

                <p className="mt-4 text-zinc-400 text-lg">
                  Reçu premium prêt à télécharger
                </p>

              </div>

            </div>

            <div className="fixed bottom-6 left-0 right-0 px-5 flex flex-col md:flex-row gap-4 justify-center">

              <button
                onClick={
                  downloadReceipt
                }
                className="bg-[#39FF14] hover:bg-[#52ff33] text-black font-extrabold py-4 px-8 rounded-[25px] transition-all duration-300 hover:scale-[1.02] shadow-[0_0_30px_rgba(57,255,20,0.35)]"
              >
                Télécharger PDF
              </button>

              <button
                onClick={() =>
                  setSelectedReceipt(
                    null
                  )
                }
                className="border border-[#39FF14] text-[#39FF14] hover:bg-[#39FF14]/10 font-bold py-4 px-8 rounded-[25px] transition-all duration-300"
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