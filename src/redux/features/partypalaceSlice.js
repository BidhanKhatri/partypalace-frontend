import { createSlice } from "@reduxjs/toolkit";

const partypalaceSlice = createSlice({
  name: "partypalace",
  initialState: {
    partypalace: [],
    selectedPartyPalace: null,
    bookedPartyPalaceLength: null,
    myPartyPalace: [],
    reviews: [],
  },
  reducers: {
    setPartyPalace: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.partypalace = action.payload;
      } else {
        state.partypalace = [action.payload, ...state.partypalace];
      }
    },

    setSelectedPartyPalace: (state, action) => {
      state.selectedPartyPalace = action?.payload;
    },
    setBookedPartyPalaceLength: (state, action) => {
      state.bookedPartyPalaceLength = action?.payload;
    },
    setMyPartyPalace: (state, action) => {
      state.myPartyPalace = action?.payload;
    },
    setReviews: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.reviews = action.payload;
      } else {
        state.reviews = [action.payload, ...state.reviews];
      }
    },
  },
});
export const {
  setPartyPalace,
  setSelectedPartyPalace,
  setBookedPartyPalaceLength,
  setMyPartyPalace,
  setReviews,
} = partypalaceSlice.actions;
export default partypalaceSlice.reducer;
