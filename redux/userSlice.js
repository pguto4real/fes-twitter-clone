import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  uid: null,
  email: null,
  name: null,
  link: null,
  username: null,
  coverImage: null,
  bio: null,
  followers: null,
  following: null,
  photoUrl: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      (state.uid = action.payload.uid),
      (state.email = action.payload.email),
      (state.name = action.payload.name),
      (state.link = action.payload.link),
      (state.username = action.payload.username),
      (state.coverImage = action.payload.coverImage),
      (state.bio = action.payload.bio),
      (state.followers = action.payload.followers),
      (state.following = action.payload.following),
        (state.photoUrl = action.payload.photoUrl)
    },
    updateUser: (state, action) => {
      // Assuming action.payload contains the fields to update
      Object.assign(state, action.payload);
    },
    signOutUser: (state) => {
      state.uid= null,
      state.email= null,
      state.name= null,
      state.link= null,
      state.username= null,
      state.coverImage= null,
      state.bio= null,
      state.followers= null,
      state.following= null,
      state.photoUrl= null
    },
  },
});

export const { setUser, signOutUser,updateUser } = userSlice.actions;

export default userSlice.reducer;
