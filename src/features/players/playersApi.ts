import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { PlayersResponse } from "@/types/player";

export const playersApi = createApi({
    reducerPath: "playersApi",
    baseQuery: fetchBaseQuery({
      baseUrl: "https://api.balldontlie.io/v1/",
      prepareHeaders: (headers) => {
        headers.set("Authorization", "976b5fc6-e4bb-4612-8e37-476bfcffef29");
        return headers;
      },
    }),
    endpoints: (builder) => ({
      getPlayers: builder.query<PlayersResponse, { cursor?: number; per_page?: number }>({
        query: ({ cursor, per_page = 10 }) => {
          const params = new URLSearchParams({ per_page: per_page.toString() });
          if (cursor) params.set("cursor", cursor.toString());
          return `players?${params.toString()}`;
        },
        keepUnusedDataFor: 300, // Keep cached for 5 minutes
      }),
    }),
  });
  

export const { useGetPlayersQuery } = playersApi;