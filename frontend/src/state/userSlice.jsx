import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",

  initialState: {
    loggedIn: false,
    // adminMode: false,
    // info: {},
    // token: "",
  },

  reducers: {
    setLoggedIn: (state, { payload }) => {
      state.loggedIn = true;
      state.licensePlate = payload.licensePlate;
      state.email = payload.email;
      state.balance = payload.balance;

      //   state.info = payload.user;
      //   state.token = payload.token;
    },
    setEmail: (state, { payload }) => {
      state.email = payload;
    },
    setBalance: (state, { payload }) => {
      state.balance = payload;
    },
    // setAdminMode: (state, { payload }) => {
    //   state.adminMode = payload;
    // },
    // setMarkedMovies: (state, { payload }) => {
    //   state.markedMovies = payload;
    // },
    // setAvatar: (state, { payload }) => {
    //   state.avatar = payload;
    // },
    clear: (state) => {
      state.loggedIn = false;
      state.licensePlate = null;
      state.email = null;
      state.balance = null;
      //   state.info = {};
      //   state.token = "";
      //   state.adminMode = false;
      //   state.avatar = "";
      //   state.markedMovies = [];
    },
  },
});

export const { setLoggedIn, setEmail, setBalance, clear } = userSlice.actions;

export default userSlice.reducer;