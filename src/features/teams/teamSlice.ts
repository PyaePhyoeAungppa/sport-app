// features/teams/teamSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Team } from "@/types/team";

interface TeamsState {
  teams: Team[];
}

const initialState: TeamsState = {
  teams: [],
};

const teamSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    addTeam(state, action: PayloadAction<Team>) {
      state.teams.push(action.payload);
    },
    updateTeam(state, action: PayloadAction<Team>) {
      const index = state.teams.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.teams[index] = action.payload;
      }
    },
    deleteTeam(state, action: PayloadAction<string>) {
      state.teams = state.teams.filter((team) => team.id !== action.payload);
    },
    assignPlayerToTeam(
      state,
      action: PayloadAction<{ teamId: string; playerId: number }>
    ) {
      // First, remove player from any existing team
      state.teams.forEach((team) => {
        team.playerIds = team.playerIds.filter(
          (id) => id !== action.payload.playerId
        );
      });

      const team = state.teams.find((t) => t.id === action.payload.teamId);
      if (team && !team.playerIds.includes(action.payload.playerId)) {
        team.playerIds.push(action.payload.playerId);
        team.playerCount = team.playerIds.length;
      }
    },
    removePlayerFromTeam(
      state,
      action: PayloadAction<{ teamId: string; playerId: number }>
    ) {
      const team = state.teams.find((t) => t.id === action.payload.teamId);
      if (team) {
        team.playerIds = team.playerIds.filter(
          (id) => id !== action.payload.playerId
        );
        team.playerCount = team.playerIds.length;
      }
    },
  },
});

export const {
  addTeam,
  updateTeam,
  deleteTeam,
  assignPlayerToTeam,
  removePlayerFromTeam,
} = teamSlice.actions;

export default teamSlice.reducer;
