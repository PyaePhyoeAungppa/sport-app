import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Player } from "@/types/player";

interface PlayersState {
  players: Player[];
  cursor: number | null;
}

const initialState: PlayersState = {
  players: [],
  cursor: 0, // Initial cursor (e.g., page 1)
};

const playersSlice = createSlice({
  name: "players",
  initialState,
  reducers: {
    addPlayers(state, action: PayloadAction<{ players: Player[]; nextCursor: number | null }>) {
      const newPlayers = action.payload.players.filter(
        (p) => !state.players.some((existing) => existing.id === p.id)
      );
      state.players.push(...newPlayers);
      state.cursor = action.payload.nextCursor;
    },
    resetPlayers(state) {
      state.players = [];
      state.cursor = 0;
    },
  },
});

export const { addPlayers, resetPlayers } = playersSlice.actions;
export default playersSlice.reducer;
