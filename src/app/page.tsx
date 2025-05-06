"use client";
import PlayersList from "@/components/PlayersList";
import TeamList from "@/components/TeamList";
import Sidebar from "@/components/SideBar";
import { useState } from "react";
import { useAppSelector } from "@/store/hooks";
import LoginForm from "@/components/LoginForm";

export default function HomePage() {
  const [view, setView] = useState<"teams" | "players">("teams");

  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
<div className="flex">
  <Sidebar currentView={view} setCurrentView={setView} />
  <main className="ml-64 flex-1 p-6 overflow-auto">
    {view === "teams" ? (
      <TeamList/>
    ) : (
      <PlayersList />
    )}
  </main>
</div>

  );
}
