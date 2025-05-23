"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { persistor } from "@/store";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { Users, Trophy, LogOut } from "lucide-react";

type View = "teams" | "players";

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const Sidebar = ({ currentView, setCurrentView }: SidebarProps) => {
  const dispatch = useAppDispatch();
  const { username } = useAppSelector((state) => state.auth);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const handleLogoutConfirm = () => {
    dispatch(logout());
    persistor.purge();
    setShowConfirmLogout(false);
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-muted p-4 flex flex-col justify-between shadow-md z-50">
      {/* Top: Username */}
      <div>
        <div className="text-lg font-semibold mb-6 mt-6 text-center">
          <span className="text-primary">{username}</span>
        </div>
        <Separator className="mb-4" />

        {/* Navigation */}
        <nav className="space-y-2">
          <Button
            variant={currentView === "teams" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setCurrentView("teams")}
          >
            <Users className="w-5 h-5" />

            Teams
          </Button>
          <Button
            variant={currentView === "players" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setCurrentView("players")}
          >

            <Trophy className="w-5 h-5" />
            Players
          </Button>
        </nav>
      </div>

      {/* Bottom: Logout */}
      <div>
        <Separator className="mb-4" />
        <Button
          variant="destructive"
          className="w-full"
          onClick={() => setShowConfirmLogout(true)}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
        <ConfirmDialog
          open={showConfirmLogout}
          title="Confirm Logout"
          description="Are you sure you want to log out?"
          onCancel={() => setShowConfirmLogout(false)}
          onConfirm={handleLogoutConfirm}
        />
      </div>
    </div>
  );
};

export default Sidebar;
