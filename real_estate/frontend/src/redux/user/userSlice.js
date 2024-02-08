import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  isSubmitting: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.isSubmitting = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.isSubmitting = false;
      state.currentUser = action.payload;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.isSubmitting = false;
      state.error = action.payload;
    },
    updateUserAtStart: (state) => {
      state.isSubmitting = true;
      state.error = null;
    },
    updateUserSuccess: (state, action) => {
      state.isSubmitting = false;
      state.currentUser = action.payload;
      state.error = null;
    },
    updateUserFailure: (state, action) => {
      state.isSubmitting = false;
      state.error = action.payload;
    },
  },
});

export const {
  signInFailure,
  signInStart,
  signInSuccess,
  updateUserAtStart,
  updateUserSuccess,
  updateUserFailure,
} = userSlice.actions;

export default userSlice.reducer;
