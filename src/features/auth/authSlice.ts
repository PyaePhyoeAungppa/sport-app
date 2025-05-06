import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
    username: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    username: null,
    isAuthenticated: false,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<string>) => {
            state.username = action.payload;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.username = null;
            state.isAuthenticated = false;
        },
    }
})

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;