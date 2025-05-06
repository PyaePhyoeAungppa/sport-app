"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetPlayersQuery } from "@/features/players/playersApi";
import { addPlayers } from "@/features/players/playersSlice";
import { RootState } from "@/store";
import { Player } from "@/types/player";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UserIcon } from "lucide-react";

const PlayersList = () => {
  const dispatch = useDispatch();
  const players = useSelector((state: RootState) => state.players.players);
  const cursor = useSelector((state: RootState) => state.players.cursor);
  const [currentCursor, setCurrentCursor] = useState<number | undefined>(0);

  const { data, isFetching, isError, isLoading } = useGetPlayersQuery({
    cursor: currentCursor,
    per_page: 10,
  });

  useEffect(() => {
    if (data?.data) {
      dispatch(
        addPlayers({
          players: data.data,
          nextCursor: data.meta.next_cursor ?? null,
        })
      );
    }
  }, [data, dispatch]);

  const handleLoadMore = () => {
    if (!isFetching && cursor !== null) {
      setCurrentCursor(cursor);
    }
  };

  if (isLoading && players.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl">Players</h1>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return <div>Error loading players.</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl">Players</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {players.map((player: Player) => (
          <Card
            key={player.id}
            className="w-full rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-border"
          >
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="bg-muted rounded-full p-3">
                <UserIcon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">
                  {player.first_name} {player.last_name}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Position: {player.position || "N/A"}
                </p>
              </div>
            </CardHeader>
            <CardContent className="pt-0 text-sm text-muted-foreground">
              Country: {player.country || "N/A"}
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

      {cursor === null && players.length > 0 && (
        <div className="text-center text-sm text-muted-foreground pt-4">
          No more players to load.
        </div>
      )}
    </div>
  );
};

export default PlayersList;
