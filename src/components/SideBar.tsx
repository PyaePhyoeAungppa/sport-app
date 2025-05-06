"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { persistor } from "@/store";
// import { useState } from "react";
// import { cn } from "@/lib/utils";

type View = "teams" | "players";

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const Sidebar = ({ currentView, setCurrentView }: SidebarProps) => {
  const dispatch = useAppDispatch();
  const { username } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    persistor.purge();
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-muted p-4 flex flex-col justify-between shadow-md z-50">
      {/* Top: Username */}
      <div>
        <div className="text-lg font-semibold mb-6">
          Hello, <span className="text-primary">{username}</span>
        </div>
        <Separator className="mb-4" />

        {/* Navigation */}
        <nav className="space-y-2">
          <Button
            variant={currentView === "teams" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setCurrentView("teams")}
          >
            Teams
          </Button>
          <Button
            variant={currentView === "players" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setCurrentView("players")}
          >
            Players
          </Button>
        </nav>
      </div>

      {/* Bottom: Logout */}
      <div>
        <Separator className="mb-4" />
        <Button variant="destructive" className="w-full" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
