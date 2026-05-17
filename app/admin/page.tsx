"use client";

import { useEffect, useMemo, useState } from "react";

import Image from "next/image";

import {
  ShieldCheck,
  Users,
  Wallet,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock3,
  Search,
  Ban,
  Eye,
  TrendingUp,
  RefreshCcw,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { supabase } from "../../supabase";

export default function AdminPage() {

  const router =
    useRouter();

  const [authorized, setAuthorized] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [requests, setRequests] =
    useState<any[]>([]);

  const [users, setUsers] =
    useState<any[]>([]);

  const [
    selectedTransaction,
    setSelectedTransaction,
  ] = useState<any>(null);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("Tous");

  useEffect(() => {

    checkAdmin();

  }, []);

  const checkAdmin =
    async () => {

      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {

        router.push("/login");

        return;
      }

      const {
        data: user,
      } = await supabase
        .from("users")
        .select("*")
        .eq(
          "email",
          authUser.email
        )
        .single();

      if (
        !user ||
        !user.is_admin
      ) {

        router.push(
          "/dashboard"
        );

        return;
      }

      setAuthorized(true);

      loadAllData();
    };

  const loadAllData =
    async () => {

      const {
        data: transactions,
      } = await supabase
        .from(
          "transactions"
        )
        .select("*")
        .order(
          "id",
          {
            ascending: false,
          }
        );

      const {
        data: usersData,
      } = await supabase
        .from("users")
        .select("*");

      setRequests(
        transactions || []
      );

      setUsers(
        usersData || []
      );
    };

  const filteredTransactions =
    useMemo(() => {

      return requests.filter(
        (item) => {

          const matchFilter =
            filter === "Tous"
              ? true
              : item.type
                  ?.toLowerCase()
                  .includes(
                    filter.toLowerCase()
                  );

          const query =
            search.toLowerCase();

          const matchSearch =
            item.user_email
              ?.toLowerCase()
              .includes(
                query
              ) ||
            item.type
              ?.toLowerCase()
              .includes(
                query
              ) ||
            item.transaction_id
              ?.toLowerCase()
              .includes(
                query
              ) ||
            item.phone
              ?.toLowerCase()
              .includes(
                query
              ) ||
            item.receiver_name
              ?.toLowerCase()
              .includes(
                query
              ) ||
            item.fullname
              ?.toLowerCase()
              .includes(
                query
              );

          return (
            matchFilter &&
            matchSearch
          );
        }
      );

    }, [
      requests,
      search,
      filter,
    ]);

  const totalProfits =
    useMemo(() => {

      let total = 0;

      requests.forEach(
        (item) => {

          if (
            item.status ===
            "Validé"
          ) {

            if (
              item.fee
            ) {

              total += Number(
                item.fee
              );
            }
          }
        }
      );

      return total;

    }, [requests]);

  const updateStatus =
    async (
      id: number,
      status: string
    ) => {

      if (loading)
        return;

      setLoading(true);

      try {

        const transaction =
          requests.find(
            (item) =>
              item.id === id
          );

        if (
          !transaction ||
          transaction.processed
        ) {

          return;
        }

        const {
          data: user,
        } = await supabase
          .from("users")
          .select("*")
          .eq(
            "email",
            transaction.user_email
          )
          .single();

        if (!user)
          return;

        let updatedBalance =
          Number(
            user.balance
          );

        // VALIDATION
        if (
          status === "Validé"
        ) {

          if (
            transaction.type ===
            "Dépôt"
          ) {

            updatedBalance +=
              Number(
                transaction.amount
              );
          }
        }

        // REJET
        if (
          status === "Rejeté"
        ) {

          if (
            transaction.type.includes(
              "Recharge"
            ) ||
            transaction.type.includes(
              "Transfert"
            ) ||
            transaction.type ===
              "Retrait"
          ) {

            updatedBalance +=
              Number(
                transaction.amount
              );
          }
        }

        await supabase
          .from("users")
          .update({
            balance:
              updatedBalance,
          })
          .eq(
            "email",
            transaction.user_email
          );

        await supabase
          .from(
            "transactions"
          )
          .update({
            status,
            processed:
              true,
          })
          .eq(
            "id",
            id
          );

        loadAllData();

      } finally {

        setLoading(false);
      }
    };

  const blockUser =
    async (
      email: string
    ) => {

      const confirmBlock =
        confirm(
          "Bloquer cet utilisateur ?"
        );

      if (
        !confirmBlock
      ) {

        return;
      }

      await supabase
        .from("users")
        .update({
          blocked: true,
        })
        .eq(
          "email",
          email
        );

      loadAllData();
    };

  const unblockUser =
    async (
      email: string
    ) => {

      await supabase
        .from("users")
        .update({
          blocked: false,
        })
        .eq(
          "email",
          email
        );

      loadAllData();
    };

  const handleLogout =
    async () => {

      await supabase.auth.signOut();

      router.push("/login");
    };

  const getStatusStyle = (
    status: string
  ) => {

    if (
      status === "Validé"
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
      status === "Rejeté"
    ) {

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
    }

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
  };

  if (!authorized)
    return null;

  return (
    <main className="min-h-screen bg-[#020202] text-white relative overflow-hidden px-5 py-10">

      {/* BG */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-[#39FF14]/20 blur-3xl rounded-full" />

      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-[#00FF88]/20 blur-3xl rounded-full" />

      <section className="max-w-7xl mx-auto relative z-10">

        {/* HEADER */}
        <div className="flex items-center justify-between flex-wrap gap-5">

          <div className="flex items-center gap-5">

            <div className="w-20 h-20 rounded-3xl bg-[#39FF14]/10 border border-[#39FF14]/20 flex items-center justify-center text-[#39FF14]">

              <ShieldCheck size={40} />

            </div>

            <div>

              <p className="text-zinc-400">
                Administration sécurisée
              </p>

              <h1 className="text-5xl font-extrabold text-[#39FF14]">
                Admin Panel
              </h1>

            </div>

          </div>

          <button
            onClick={handleLogout}
            className="border border-red-500 text-red-400 hover:bg-red-500/10 px-6 py-4 rounded-2xl font-bold"
          >
            Déconnexion
          </button>

        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-12">

          <div className="border border-[#39FF14]/20 bg-black/60 rounded-[35px] p-7">

            <Users
              size={32}
              className="text-[#39FF14]"
            />

            <p className="mt-5 text-zinc-500">
              Total utilisateurs
            </p>

            <h2 className="mt-2 text-4xl font-extrabold text-[#39FF14]">
              {users.length}
            </h2>

          </div>

          <div className="border border-[#39FF14]/20 bg-black/60 rounded-[35px] p-7">

            <CreditCard
              size={32}
              className="text-[#39FF14]"
            />

            <p className="mt-5 text-zinc-500">
              Transactions
            </p>

            <h2 className="mt-2 text-4xl font-extrabold text-[#39FF14]">
              {requests.length}
            </h2>

          </div>

          <div className="border border-[#39FF14]/20 bg-black/60 rounded-[35px] p-7">

            <Clock3
              size={32}
              className="text-[#39FF14]"
            />

            <p className="mt-5 text-zinc-500">
              En attente
            </p>

            <h2 className="mt-2 text-4xl font-extrabold text-[#39FF14]">
              {
                requests.filter(
                  (item) =>
                    item.status ===
                    "En attente"
                ).length
              }
            </h2>

          </div>

          <div className="border border-[#39FF14]/20 bg-black/60 rounded-[35px] p-7">

            <TrendingUp
              size={32}
              className="text-[#39FF14]"
            />

            <p className="mt-5 text-zinc-500">
              Profit plateforme
            </p>

            <h2 className="mt-2 text-4xl font-extrabold text-[#39FF14]">
              {totalProfits.toFixed(
                2
              )} DOP
            </h2>

          </div>

        </div>

        {/* SEARCH */}
        <div className="mt-12 flex flex-col xl:flex-row gap-5">

          <div className="flex-1 flex items-center border border-[#39FF14]/20 bg-black/60 rounded-[25px] px-5">

            <Search className="text-[#39FF14]" />

            <input
              type="text"
              placeholder="Rechercher email, id, numéro..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full bg-transparent px-5 py-5 outline-none"
            />

          </div>

          <div className="flex flex-wrap gap-3">

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
                className={`px-5 py-4 rounded-2xl font-bold transition ${
                  filter === item
                    ? "bg-[#39FF14] text-black"
                    : "border border-[#39FF14]/20 bg-black/60 text-white"
                }`}
              >
                {item}
              </button>
            ))}

          </div>

        </div>

        {/* TRANSACTIONS */}
        <div className="mt-12 grid gap-6">

          {filteredTransactions.map(
            (item) => {

              const style =
                getStatusStyle(
                  item.status
                );

              return (
                <div
                  key={item.id}
                  className="border border-[#39FF14]/20 bg-black/60 rounded-[35px] p-7"
                >

                  <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

                    <div>

                      <h2 className="text-3xl font-bold text-[#39FF14]">
                        {item.type}
                      </h2>

                      <p className="mt-3 text-zinc-400 break-all">
                        {item.user_email}
                      </p>

                      <p className="mt-2 text-zinc-500">
                        {item.amount} DOP
                      </p>

                      <p className="mt-2 text-zinc-500">
                        {
                          item.transaction_id
                        }
                      </p>

                    </div>

                    <div className="flex flex-wrap gap-4">

                      <button
                        onClick={() =>
                          setSelectedTransaction(
                            item
                          )
                        }
                        className="border border-[#39FF14] text-[#39FF14] hover:bg-[#39FF14]/10 px-5 py-3 rounded-2xl font-bold flex items-center gap-3"
                      >

                        <Eye size={18} />

                        Voir

                      </button>

                      <button
                        onClick={() =>
                          blockUser(
                            item.user_email
                          )
                        }
                        className="border border-red-500 text-red-400 hover:bg-red-500/10 px-5 py-3 rounded-2xl font-bold flex items-center gap-3"
                      >

                        <Ban size={18} />

                        Bloquer

                      </button>

                      <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border ${style.bg} ${style.border} ${style.color}`}>

                        {style.icon}

                        <span className="font-bold">
                          {item.status}
                        </span>

                      </div>

                    </div>

                  </div>

                  {!item.processed && (

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">

                      <button
                        disabled={
                          loading
                        }
                        onClick={() =>
                          updateStatus(
                            item.id,
                            "Validé"
                          )
                        }
                        className="bg-[#39FF14] hover:bg-[#52ff33] text-black font-extrabold py-4 rounded-2xl disabled:opacity-50"
                      >
                        Valider
                      </button>

                      <button
                        disabled={
                          loading
                        }
                        onClick={() =>
                          updateStatus(
                            item.id,
                            "Rejeté"
                          )
                        }
                        className="bg-red-500 hover:bg-red-400 text-white font-extrabold py-4 rounded-2xl disabled:opacity-50"
                      >
                        Rejeter
                      </button>

                    </div>
                  )}

                </div>
              );
            }
          )}

        </div>

      </section>

      {/* POPUP DETAILS */}
      {selectedTransaction && (

        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center px-5">

          <div className="w-full max-w-4xl border border-[#39FF14]/20 bg-[#050505] rounded-[40px] p-10 overflow-y-auto max-h-[90vh]">

            <div className="flex items-center justify-between gap-5">

              <h2 className="text-4xl font-extrabold text-[#39FF14]">
                Détails transaction
              </h2>

              <button
                onClick={() =>
                  setSelectedTransaction(
                    null
                  )
                }
                className="border border-[#39FF14]/20 px-5 py-3 rounded-2xl"
              >

                Fermer

              </button>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">

              {Object.entries(
                selectedTransaction
              ).map(
                ([key, value]) => (

                  <div
                    key={key}
                    className="border border-[#39FF14]/10 rounded-2xl p-5 bg-black/40"
                  >

                    <p className="text-zinc-500 capitalize">
                      {key.replaceAll(
                        "_",
                        " "
                      )}
                    </p>

                    <p className="mt-3 font-bold break-all">
                      {String(
                        value || "-"
                      )}
                    </p>

                  </div>
                )
              )}

            </div>

            {/* IMAGE */}
            {selectedTransaction.proof_url && (

              <div className="mt-10">

                <p className="text-zinc-500 mb-5">
                  Preuve image
                </p>

                <div className="relative w-full h-[450px] rounded-[35px] overflow-hidden border border-[#39FF14]/20">

                  <Image
                    src={
                      selectedTransaction.proof_url
                    }
                    alt="preuve"
                    fill
                    className="object-cover"
                  />

                </div>

              </div>
            )}

            {/* USER CONTROLS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">

              <button
                onClick={() =>
                  blockUser(
                    selectedTransaction.user_email
                  )
                }
                className="bg-red-500 hover:bg-red-400 text-white py-5 rounded-[25px] font-extrabold"
              >
                Bloquer utilisateur
              </button>

              <button
                onClick={() =>
                  unblockUser(
                    selectedTransaction.user_email
                  )
                }
                className="border border-[#39FF14] text-[#39FF14] hover:bg-[#39FF14]/10 py-5 rounded-[25px] font-extrabold flex items-center justify-center gap-3"
              >

                <RefreshCcw size={20} />

                Débloquer utilisateur

              </button>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}