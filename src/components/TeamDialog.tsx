"use client";

import { useWatch } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Team } from "@/types/team";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addTeam,
  updateTeam,
  removePlayerFromTeam,
} from "@/features/teams/teamSlice";
import { useCallback, useEffect, useMemo } from "react";
import SelectablePlayersList from "./SelectablePlayersList";

const teamSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  region: z.string().min(1, "Region is required"),
  country: z.string().min(1, "Country is required"),
  playerIds: z.array(z.number()).optional(),
});

type TeamFormData = z.infer<typeof teamSchema>;

interface TeamDialogProps {
  open: boolean;
  onClose: () => void;
  team?: Team | null;
}

const TeamDialog = ({ open, onClose, team }: TeamDialogProps) => {
  const dispatch = useAppDispatch();
  const teams = useAppSelector((state) => state.teams.teams);

  const form = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: "",
      region: "",
      country: "",
      playerIds: [],
    },
  });

  useEffect(() => {
    if (open) {
      if (team) {
        form.reset({
          name: team.name,
          region: team.region,
          country: team.country,
          playerIds: team.playerIds,
        });
      } else {
        form.reset({
          name: "",
          region: "",
          country: "",
          playerIds: [],
        });
      }
    }
  }, [team, form, open]);

  const onSubmit = useCallback(
    (data: TeamFormData) => {
      const isNameTaken =
        !team &&
        teams.some((t) => t.name.toLowerCase() === data.name.toLowerCase());

      if (isNameTaken) {
        form.setError("name", { message: "Team name must be unique" });
        return;
      }

      const newTeamId = team?.id ?? crypto.randomUUID();

      data.playerIds?.forEach((playerId) => {
        const currentTeam = teams.find((t) => t.playerIds.includes(playerId));
        if (currentTeam && currentTeam.id !== newTeamId) {
          dispatch(removePlayerFromTeam({ teamId: currentTeam.id, playerId }));
        }
      });

      const teamData: Team = {
        id: newTeamId,
        name: data.name,
        region: data.region,
        country: data.country,
        playerIds: data.playerIds ?? [],
        playerCount: data.playerIds?.length ?? 0,
      };

      if (team) {
        dispatch(updateTeam(teamData));
      } else {
        dispatch(addTeam(teamData));
      }

      onClose();
    },
    [team, teams, dispatch, onClose, form]
  );

  const watchedPlayerIds =
    useWatch({
      control: form.control,
      name: "playerIds",
    }) || [];

  const selectedPlayerIds = useMemo(() => watchedPlayerIds, [watchedPlayerIds]);

  const togglePlayer = useCallback(
    (playerId: number) => {
      const newSelection = selectedPlayerIds.includes(playerId)
        ? selectedPlayerIds.filter((id) => id !== playerId)
        : [...selectedPlayerIds, playerId];

      form.setValue("playerIds", newSelection);
    },
    [selectedPlayerIds, form]
  );

  const playerTeamMap = useMemo(() => {
    const map = new Map<number, string>();
    teams.forEach((team) => {
      team.playerIds.forEach((playerId) => {
        map.set(playerId, team.name);
      });
    });
    return map;
  }, [teams]);

  const getPlayerTeamName = useCallback(
    (playerId: number): string | null => {
      return playerTeamMap.get(playerId) || null;
    },
    [playerTeamMap]
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{team ? "Edit Team" : "Create Team"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Team name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Region</FormLabel>
                    <FormControl>
                      <Input placeholder="Region" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Player Select */}
            <FormField
              control={form.control}
              name="playerIds"
              render={() => (
                <FormItem>
                  <FormLabel>Players</FormLabel>
                  <SelectablePlayersList
                    selectedPlayerIds={selectedPlayerIds}
                    onToggle={togglePlayer}
                    getPlayerTeamName={getPlayerTeamName}
                    teamId={team?.id}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              {team ? "Update Team" : "Create Team"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TeamDialog;
