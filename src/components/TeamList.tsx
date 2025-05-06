"use client";

import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { Team } from "@/types/team";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TeamDialog from "./TeamDialog";
import { deleteTeam } from "@/features/teams/teamSlice";
import { Pencil, Trash2, Plus } from "lucide-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

const TeamList = () => {
  const dispatch = useAppDispatch();
  const { teams } = useAppSelector((state) => state.teams);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);

  const openDialogToAdd = () => {
    setSelectedTeam(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (team: Team) => {
    setSelectedTeam(team);
    setIsDialogOpen(true);
  };

  const confirmDeleteTeam = () => {
    if (teamToDelete) {
      dispatch(deleteTeam(teamToDelete.id));
      setTeamToDelete(null);
    }
  };

  const closeDialog = () => {
    setSelectedTeam(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-simibold">Teams</h1>
        <Button onClick={openDialogToAdd}><Plus className="w-4 h-4"/> Add Team</Button>
      </div>
      {teams.length === 0 ? (
        <p className="text-muted-foreground text-center">No teams available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <Card key={team.id} className="shadow-sm border-muted">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold text-primary">
                      {team.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {team.region}, {team.country}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="hover:bg-accent"
                      onClick={() => handleEdit(team)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="hover:bg-red-50"
                      onClick={() => setTeamToDelete(team)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                <p>
                  <span className="font-medium text-foreground">Players:</span>{" "}
                  {team.playerIds.length}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <TeamDialog
        open={isDialogOpen}
        onClose={closeDialog}
        team={selectedTeam}
      />
      <ConfirmDialog
        open={!!teamToDelete}
        title="Delete Team"
        description={`Are you sure you want to delete "${teamToDelete?.name}"?`}
        onCancel={() => setTeamToDelete(null)}
        onConfirm={confirmDeleteTeam}
      />
    </div>
  );
};

export default TeamList;
