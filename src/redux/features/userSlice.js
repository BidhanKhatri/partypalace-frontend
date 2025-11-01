import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",

  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    role: localStorage.getItem("role") || null,
    userId: localStorage.getItem("userId") || null,
    selectedChat: null, // storing partyPalaceName, userId, userName
    selectedChatAtAdmin: null,
  },

  reducers: {
    login: (state, action) => {
      state.user = action?.payload?.user;
      state.token = action?.payload?.token;
      state.role = action?.payload?.role;
      state.userId = action?.payload?.userId;

      localStorage.setItem("user", JSON.stringify(action?.payload?.user));
      localStorage.setItem("token", action?.payload?.token);
      localStorage.setItem("role", action?.payload?.role);
      localStorage.setItem("userId", action?.payload?.userId);
    },
    logout: (state, action) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.userId = null;

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
    },
    setSelectedChat: (state, action) => {
      state.selectedChat = action?.payload;
    },
    setSelectedChatAtAdmin: (state, action) => {
      state.selectedChatAtAdmin = action?.payload;
    },
  },
});

export const { login, logout, setSelectedChat, setSelectedChatAtAdmin } = userSlice.actions;
export default userSlice.reducer;
