"use client";

import {
  useState,
  useEffect,
} from "react";

import {
  ArrowLeft,
  Wallet,
  Repeat,
  CreditCard,
  Landmark,
  Eye,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

import { supabase } from "../../supabase";

export default function TransactionsPage() {

  const [
    selectedTransaction,
    setSelectedTransaction,
  ] = useState<any>(null);

  const [
    transactions,
    setTransactions,
  ] = useState<any[]>([]);

  const [balance, setBalance] =
    useState(0);

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

        // USER
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

        setBalance(
          Number(
            user.balance
          ) || 0
        );

        // TRANSACTIONS
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

        if (data) {

          setTransactions(
            data
          );
        }

      } catch {

        console.log(
          "Erreur transactions"
        );

      } finally {

        setLoading(false);
      }
    };

  const getStatusStyle = (
    status: string
  ) => {

    if (
      status === "Validé" ||
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
      status === "En attente" ||
      status ===
        "En traitement"
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
      <section className="max-w-7xl mx-auto relative z-10">

        {/* HEADER */}
        <div className="flex items-center justify-between flex-wrap gap-4">

          <div>

            <p className="text-zinc-400">
              Activité financière
            </p>

            <h1 className="text-4xl md:text-5xl font-extrabold text-[#39FF14] drop-shadow-[0_0_12px_#39FF14] mt-2">
              Transactions
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

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-12">

          {/* SOLDE */}
          <div className="border border-[#39FF14]/20 bg-black/60 backdrop-blur-2xl rounded-[35px] p-7 shadow-[0_0_20px_rgba(57,255,20,0.12)]">

            <div className="w-14 h-14 rounded-2xl bg-[#39FF14]/10 border border-[#39FF14]/20 flex items-center justify-center text-[#39FF14]">

              <Wallet size={28} />

            </div>

            <p className="mt-6 text-zinc-500">
              Solde actuel
            </p>

            <h2 className="mt-3 text-4xl font-extrabold text-[#39FF14]">
              {balance.toLocaleString()} DOP
            </h2>

          </div>

          {/* TRANSFERTS */}
          <div className="border border-[#39FF14]/20 bg-black/60 backdrop-blur-2xl rounded-[35px] p-7 shadow-[0_0_20px_rgba(57,255,20,0.12)]">

            <div className="w-14 h-14 rounded-2xl bg-[#39FF14]/10 border border-[#39FF14]/20 flex items-center justify-center text-[#39FF14]">

              <Repeat size={28} />

            </div>

            <p className="mt-6 text-zinc-500">
              Total transferts
            </p>

            <h2 className="mt-3 text-4xl font-extrabold text-[#39FF14]">
              {
                transactions.filter(
                  (item) =>
                    item.type?.includes(
                      "Transfert"
                    )
                ).length
              }
            </h2>

          </div>

          {/* RECHARGES */}
          <div className="border border-[#39FF14]/20 bg-black/60 backdrop-blur-2xl rounded-[35px] p-7 shadow-[0_0_20px_rgba(57,255,20,0.12)]">

            <div className="w-14 h-14 rounded-2xl bg-[#39FF14]/10 border border-[#39FF14]/20 flex items-center justify-center text-[#39FF14]">

              <CreditCard size={28} />

            </div>

            <p className="mt-6 text-zinc-500">
              Total recharges
            </p>

            <h2 className="mt-3 text-4xl font-extrabold text-[#39FF14]">
              {
                transactions.filter(
                  (item) =>
                    item.type?.includes(
                      "Recharge"
                    )
                ).length
              }
            </h2>

          </div>

          {/* DEPOTS */}
          <div className="border border-[#39FF14]/20 bg-black/60 backdrop-blur-2xl rounded-[35px] p-7 shadow-[0_0_20px_rgba(57,255,20,0.12)]">

            <div className="w-14 h-14 rounded-2xl bg-[#39FF14]/10 border border-[#39FF14]/20 flex items-center justify-center text-[#39FF14]">

              <Landmark size={28} />

            </div>

            <p className="mt-6 text-zinc-500">
              Dépôts actifs
            </p>

            <h2 className="mt-3 text-4xl font-extrabold text-[#39FF14]">
              {
                transactions.filter(
                  (item) =>
                    item.type ===
                    "Dépôt"
                ).length
              }
            </h2>

          </div>

        </div>

        {/* EMPTY */}
        {transactions.length ===
          0 && (

          <div className="mt-16 text-center border border-[#39FF14]/20 bg-black/60 rounded-[35px] p-12">

            <h2 className="text-3xl font-bold text-[#39FF14]">
              Aucune transaction
            </h2>

            <p className="mt-4 text-zinc-500">
              Aucune activité disponible.
            </p>

          </div>
        )}

        {/* TABLE */}
        {transactions.length >
          0 && (

          <div className="mt-12 border border-[#39FF14]/20 bg-black/60 backdrop-blur-2xl rounded-[35px] overflow-hidden shadow-[0_0_30px_rgba(57,255,20,0.12)]">

            {/* HEAD */}
            <div className="hidden md:grid grid-cols-6 gap-4 px-8 py-6 border-b border-[#39FF14]/10 text-zinc-500 font-bold">

              <p>ID</p>

              <p>Service</p>

              <p>Montant</p>

              <p>Statut</p>

              <p>Date</p>

              <p>Action</p>

            </div>

            {/* ROWS */}
            {transactions.map(
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
                    className="grid md:grid-cols-6 gap-6 px-8 py-8 border-b border-[#39FF14]/10 items-center hover:bg-[#39FF14]/5 transition-all duration-300"
                  >

                    {/* ID */}
                    <div>

                      <p className="md:hidden text-zinc-500 mb-2">
                        ID
                      </p>

                      <p className="font-bold">
                        {
                          transaction.transaction_id
                        }
                      </p>

                    </div>

                    {/* SERVICE */}
                    <div>

                      <p className="md:hidden text-zinc-500 mb-2">
                        Service
                      </p>

                      <p className="font-bold text-[#39FF14]">
                        {
                          transaction.type
                        }
                      </p>

                    </div>

                    {/* AMOUNT */}
                    <div>

                      <p className="md:hidden text-zinc-500 mb-2">
                        Montant
                      </p>

                      <p className="font-bold">
                        {
                          transaction.amount
                        }{" "}
                        DOP
                      </p>

                    </div>

                    {/* STATUS */}
                    <div>

                      <p className="md:hidden text-zinc-500 mb-2">
                        Statut
                      </p>

                      <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-2xl border ${statusStyle.bg} ${statusStyle.border} ${statusStyle.color}`}>

                        {statusStyle.icon}

                        <span className="font-semibold">
                          {
                            transaction.status
                          }
                        </span>

                      </div>

                    </div>

                    {/* DATE */}
                    <div>

                      <p className="md:hidden text-zinc-500 mb-2">
                        Date
                      </p>

                      <p className="font-bold">
                        {
                          transaction.date
                        }
                      </p>

                    </div>

                    {/* ACTION */}
                    <div>

                      <button
                        onClick={() =>
                          setSelectedTransaction(
                            transaction
                          )
                        }
                        className="bg-[#39FF14] hover:bg-[#52ff33] text-black px-5 py-3 rounded-2xl font-bold flex items-center gap-3 transition-all duration-300 hover:scale-[1.02]"
                      >

                        <Eye size={18} />

                        Voir détails

                      </button>

                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}

      </section>

      {/* DETAILS POPUP */}
      {selectedTransaction && (

        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-5">

          <div className="w-full max-w-2xl border border-[#39FF14]/20 bg-[#050505] rounded-[40px] p-10 shadow-[0_0_50px_rgba(57,255,20,0.2)] relative overflow-hidden">

            {/* GLOW */}
            <div className="absolute top-[-120px] right-[-120px] w-[250px] h-[250px] bg-[#39FF14]/10 blur-3xl rounded-full" />

            {/* HEADER */}
            <div className="relative z-10 text-center">

              <h2 className="text-4xl font-extrabold text-[#39FF14]">
                Détails transaction
              </h2>

            </div>

            {/* DETAILS */}
            <div className="mt-12 space-y-7 relative z-10">

              <div className="flex items-center justify-between border-b border-zinc-800 pb-5">

                <span className="text-zinc-500">
                  ID
                </span>

                <span className="font-bold">
                  {
                    selectedTransaction.transaction_id
                  }
                </span>

              </div>

              <div className="flex items-center justify-between border-b border-zinc-800 pb-5">

                <span className="text-zinc-500">
                  Type
                </span>

                <span className="font-bold text-[#39FF14]">
                  {
                    selectedTransaction.type
                  }
                </span>

              </div>

              <div className="flex items-center justify-between border-b border-zinc-800 pb-5">

                <span className="text-zinc-500">
                  Montant
                </span>

                <span className="font-bold">
                  {
                    selectedTransaction.amount
                  }{" "}
                  DOP
                </span>

              </div>

              {selectedTransaction.conversion && (

                <div className="flex items-center justify-between border-b border-zinc-800 pb-5">

                  <span className="text-zinc-500">
                    Conversion
                  </span>

                  <span className="font-bold">
                    {
                      selectedTransaction.conversion
                    }
                  </span>

                </div>
              )}

              {selectedTransaction.receiver_name && (

                <div className="flex items-center justify-between border-b border-zinc-800 pb-5">

                  <span className="text-zinc-500">
                    Bénéficiaire
                  </span>

                  <span className="font-bold">
                    {
                      selectedTransaction.receiver_name
                    }
                  </span>

                </div>
              )}

              {selectedTransaction.contact_phone && (

                <div className="flex items-center justify-between border-b border-zinc-800 pb-5">

                  <span className="text-zinc-500">
                    Téléphone
                  </span>

                  <span className="font-bold">
                    {
                      selectedTransaction.contact_phone
                    }
                  </span>

                </div>
              )}

              {selectedTransaction.withdrawal_method && (

                <div className="flex items-center justify-between border-b border-zinc-800 pb-5">

                  <span className="text-zinc-500">
                    Méthode
                  </span>

                  <span className="font-bold">
                    {
                      selectedTransaction.withdrawal_method
                    }
                  </span>

                </div>
              )}

              <div className="flex items-center justify-between border-b border-zinc-800 pb-5">

                <span className="text-zinc-500">
                  Date
                </span>

                <span className="font-bold">
                  {
                    selectedTransaction.date
                  }
                </span>

              </div>

              <div className="flex items-center justify-between border-b border-zinc-800 pb-5">

                <span className="text-zinc-500">
                  Heure
                </span>

                <span className="font-bold">
                  {
                    selectedTransaction.time
                  }
                </span>

              </div>

              <div className="flex items-center justify-between">

                <span className="text-zinc-500">
                  Statut
                </span>

                <span className="font-bold text-[#39FF14]">
                  {
                    selectedTransaction.status
                  }
                </span>

              </div>

            </div>

            {/* CLOSE */}
            <button
              onClick={() =>
                setSelectedTransaction(
                  null
                )
              }
              className="mt-12 w-full bg-[#39FF14] hover:bg-[#52ff33] text-black font-extrabold py-5 rounded-[25px] transition-all duration-300 hover:scale-[1.02]"
            >
              Fermer
            </button>

          </div>

        </div>
      )}

    </main>
  );
}