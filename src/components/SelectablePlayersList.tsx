"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Player } from "@/types/player";
import { useGetPlayersQuery } from "@/features/players/playersApi";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SelectablePlayersListProps {
  selectedPlayerIds: number[];
  onToggle: (playerId: number) => void;
  getPlayerTeamName: (playerId: number) => string | null;
  teamId: string | null | undefined;
}

const SelectablePlayersList = ({
  selectedPlayerIds,
  onToggle,
  getPlayerTeamName,
  teamId,
}: SelectablePlayersListProps) => {
  const [cursor, setCursor] = useState<number | null>(null);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [currentCursor, setCurrentCursor] = useState<number | undefined>(
    undefined
  );

  const { data, isFetching, isError, isLoading } = useGetPlayersQuery({
    cursor: currentCursor,
    per_page: 25,
  });

  // Deduplicate new players before adding
  useEffect(() => {
    if (data?.data) {
      setAllPlayers((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newUniquePlayers = data.data.filter(
          (p) => !existingIds.has(p.id)
        );
        return [...prev, ...newUniquePlayers];
      });
      setCursor(data.meta.next_cursor ?? null);
    }
  }, [data]);

  const handleLoadMore = useCallback(() => {
    if (cursor !== null) {
      setCurrentCursor(cursor);
    }
  }, [cursor]);

  const renderedPlayers = useMemo(() => {
    return allPlayers.map((player) => {
      const assignedTeam = getPlayerTeamName(player.id);
      const isDisabled = assignedTeam !== null && assignedTeam !== teamId && !selectedPlayerIds.includes(player.id);

      const isChecked = selectedPlayerIds.includes(player.id);

      return (
        <div
          key={`player-${player.id}`}
          className="flex items-center justify-between py-1"
        >
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={isChecked}
              disabled={isDisabled}
              onCheckedChange={() => onToggle(player.id)}
              id={`player-${player.id}`}
            />
            <label
              htmlFor={`player-${player.id}`}
              className="text-sm cursor-pointer"
            >
              {player.first_name} {player.last_name}
            </label>
          </div>
          {assignedTeam && assignedTeam !== teamId && (
            <span className="text-xs text-muted-foreground italic">
              ({assignedTeam})
            </span>
          )}
        </div>
      );
    });
  }, [allPlayers, selectedPlayerIds, teamId, getPlayerTeamName, onToggle]);

  if (isLoading && allPlayers.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-4">
        Loading players...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center">Failed to load players</div>
    );
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <ScrollArea className="h-40 border rounded-md p-2">
        {renderedPlayers}
  
        {cursor !== null && (
          <div className="text-center pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation(); // Also stop on button itself
                handleLoadMore();
              }}
              disabled={isFetching}
            >
              {isFetching ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}
  
        {cursor === null && allPlayers.length > 0 && (
          <div className="text-center text-xs text-muted-foreground pt-2">
            All players loaded.
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default SelectablePlayersList;