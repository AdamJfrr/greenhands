import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    loggedIn: false,
    user: null,
    loggedOut: true,
  },
  reducers: {
    logIn(state, action) {
      state.loggedIn = true;
      state.loggedOut = false;
      state.user = action.payload.user;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logOut(state, action) {
      state.loggedIn = false;
      state.loggedOut = false;
      state.user = null;
      localStorage.removeItem('user'); 
    },
  },
});

export const { logIn, logOut } = authSlice.actions;
export default authSlice.reducer;
