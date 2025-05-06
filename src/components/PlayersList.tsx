"use client";

import { useState, useEffect } from "react";
import { Player } from "@/types/player";
import { useGetPlayersQuery } from "@/features/players/playersApi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const PlayersList = () => {
  const [cursor, setCursor] = useState<number | null>(null);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [currentCursor, setCurrentCursor] = useState<number | undefined>(
    undefined
  );

  const { data, isFetching, isError, isLoading } = useGetPlayersQuery({
    cursor: currentCursor,
    per_page: 10,
  });

  useEffect(() => {
    if (data?.data) {
      setAllPlayers((prev) => [...prev, ...data.data]);
      setCursor(data.meta.next_cursor ?? null);
    }
  }, [data]);

  const handleLoadMore = () => {
    if (cursor !== null) {
      setCurrentCursor(cursor);
    }
  };

  if (isLoading && allPlayers.length === 0) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <div>Error loading players</div>;
  }

  return (
    <div className="space-y-4 mt-4">
        <h1>Players</h1>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {allPlayers.map((player: Player) => (
          <Card key={player.id} className="w-full">
            <CardHeader>
              <CardTitle className="text-lg">
                {player.first_name} {player.last_name}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Position: {player.position || "N/A"}</p>
              <p>Country: {player.country || "N/A"}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {cursor !== null && (
        <div className="text-center pt-4">
          <Button onClick={handleLoadMore} disabled={isFetching}>
            {isFetching ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}

      {cursor === null && allPlayers.length > 0 && (
        <div className="text-center text-sm text-muted-foreground pt-4">
          No more players to load.
        </div>
      )}
    </div>
  );
};

export default PlayersList;
