export interface Player {
    id: number;
    first_name: string;
    last_name: string;
    position: string;
    height: string | null;
    weight: string | null;
    jersey_number: string | null;
    college: string | null;
    country: string;
    draft_year: number | null;
    draft_round: number | null;
    draft_number: number | null;
    team: {
      id: number;
      full_name: string;
      abbreviation: string;
      city: string;
      name: string;
      conference: string;
      division: string;
    };
  }

export interface PlayersResponse {
  data: Player[];
  meta: {
    next_cursor: number | null;
    per_page: number;
  };
}
