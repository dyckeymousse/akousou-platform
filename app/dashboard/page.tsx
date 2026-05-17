"use client";

import { useEffect, useState } from "react";

import {
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  Repeat,
  History,
  Settings,
  LifeBuoy,
  CreditCard,
  Menu,
} from "lucide-react";

import { supabase } from "../../supabase";

export default function DashboardPage() {

  const [userName, setUserName] =
    useState("Utilisateur");

  const [balance, setBalance] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const loadUser =
      async () => {

        // GET AUTH USER
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        // NOT CONNECTED
        if (!authUser) {

          window.location.replace(
            "/login"
          );

          return;
        }

        // GET USER DATA
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

        // USER NOT FOUND
        if (!user) {

          await supabase.auth.signOut();

          window.location.replace(
            "/login"
          );

          return;
        }

        // BLOCKED ACCOUNT
        if (user.blocked) {

          await supabase.auth.signOut();

          window.location.replace(
            "/login"
          );

          return;
        }

        setUserName(
          user.fullname
        );

        setBalance(
          Number(
            user.balance
          ) || 0
        );

        setLoading(false);
      };

    loadUser();

  }, []);

  // LOADING SCREEN
  if (loading) {

    return (
      <main className="min-h-screen bg-[#020202] flex items-center justify-center text-[#39FF14] text-2xl font-bold">
        Chargement...
      </main>
    );
  }

  const sidebarButtons = [
    {
      name: "Recharge",
      icon: <Wallet size={20} />,
      link: "/recharge",
    },

    {
      name: "Dépôt",
      icon: <ArrowDownCircle size={20} />,
      link: "/depot",
    },

    {
      name: "Transfert",
      icon: <Repeat size={20} />,
      link: "/transfert",
    },

    {
      name: "Retrait",
      icon: <ArrowUpCircle size={20} />,
      link: "/retrait",
    },

    {
      name: "Transactions",
      icon: <CreditCard size={20} />,
      link: "/transactions",
    },

    {
      name: "Historique",
      icon: <History size={20} />,
      link: "/historique",
    },

    {
      name: "Settings",
      icon: <Settings size={20} />,
      link: "/settings",
    },

    {
      name: "Support",
      icon: <LifeBuoy size={20} />,
      link: "/support",
    },
  ];

  return (
    <main className="min-h-screen bg-[#020202] text-white flex overflow-hidden relative">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-[#39FF14]/20 blur-3xl rounded-full" />

      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-[#00FF88]/20 blur-3xl rounded-full" />

      {/* SIDEBAR DESKTOP */}
      <aside className="hidden lg:flex w-[290px] min-h-screen border-r border-[#39FF14]/20 bg-black/70 backdrop-blur-2xl p-6 flex-col relative z-10">

        <div>

          <h1 className="text-3xl font-extrabold text-[#39FF14] tracking-tight drop-shadow-[0_0_12px_#39FF14]">
            Akousou GLS
          </h1>

          <p className="text-zinc-500 mt-2 text-sm">
            Digital Services Platform
          </p>

        </div>

        <div className="mt-12 flex flex-col gap-4">

          {sidebarButtons.map((button) => (

            <a
              key={button.name}
              href={button.link}
              className="group flex items-center gap-4 border border-[#39FF14]/20 bg-zinc-950 hover:bg-[#39FF14]/10 hover:border-[#39FF14] rounded-2xl px-5 py-4 transition-all duration-300 hover:scale-[1.03] active:scale-95 hover:shadow-[0_0_20px_#39FF14]"
            >

              <span className="text-[#39FF14]">
                {button.icon}
              </span>

              <span className="font-semibold text-zinc-200 group-hover:text-white">
                {button.name}
              </span>

            </a>
          ))}

        </div>

      </aside>

      {/* CONTENT */}
      <section className="flex-1 relative z-10 p-5 md:p-10 overflow-y-auto">

        <div className="lg:hidden flex items-center justify-between mb-8">

          <h1 className="text-2xl font-extrabold text-[#39FF14] drop-shadow-[0_0_10px_#39FF14]">
            Akousou GLS
          </h1>

          <button className="border border-[#39FF14] p-3 rounded-2xl text-[#39FF14] shadow-[0_0_15px_#39FF14]">
            <Menu />
          </button>

        </div>

        <div className="border border-[#39FF14]/30 bg-black/60 backdrop-blur-2xl rounded-[35px] p-8 md:p-10 shadow-[0_0_40px_rgba(57,255,20,0.2)] relative overflow-hidden">

          <div className="absolute top-[-100px] right-[-100px] w-[250px] h-[250px] bg-[#39FF14]/10 blur-3xl rounded-full" />

          <div className="relative z-10">

            <p className="text-zinc-400 text-lg">
              Bienvenue sur
            </p>

            <h2 className="text-4xl md:text-6xl font-extrabold mt-2 leading-tight text-[#39FF14] drop-shadow-[0_0_18px_#39FF14]">
              Akousou Shop & GLS
            </h2>

          </div>

          <div className="mt-10 relative z-10">

            <p className="text-zinc-500">
              Utilisateur
            </p>

            <h3 className="text-2xl font-bold mt-2">
              {userName}
            </h3>

          </div>

          <div className="mt-10 border border-[#39FF14] rounded-[30px] bg-[#050505] p-8 shadow-[0_0_35px_rgba(57,255,20,0.35)] relative overflow-hidden">

            <div className="absolute top-[-50px] right-[-50px] w-[150px] h-[150px] bg-[#39FF14]/10 blur-3xl rounded-full" />

            <p className="text-zinc-400 text-lg relative z-10">
              Solde disponible
            </p>

            <h1 className="text-5xl md:text-7xl font-extrabold text-[#39FF14] mt-4 relative z-10 drop-shadow-[0_0_20px_#39FF14]">
              {balance.toLocaleString()} DOP
            </h1>

          </div>

        </div>

      </section>

    </main>
  );
}