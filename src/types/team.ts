export interface Team {
  id: string;
  name: string;
  playerCount: number;
  region: string;
  country: string;
  playerIds: number[]; // Array of player IDs
}
