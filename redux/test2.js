// src/services/usersApi.js
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../firebase";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["UserFollowStatus", "User", "UserPosts"],
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      queryFn: () => ({
        data: new Promise((resolve, reject) => {
          const usersCollection = collection(db, "users");
          const unsubscribe = onSnapshot(
            usersCollection,
            (snapshot) => {
              const users = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              resolve(users);
            },
            (error) =>
              reject({
                error: { status: "FETCH_ERROR", message: error.message },
              })
          );
          return () => unsubscribe();
        }),
      }),
    }),
    getUserById: builder.query({
      async queryFn(userId) {
        return new Promise((resolve, reject) => {
          const userDoc = doc(db, "users", userId);
          const unsubscribe = onSnapshot(
            userDoc,
            (snapshot) => {
              if (snapshot.exists()) {
                const userData = snapshot.data();
                resolve({ data: { id: snapshot.id, ...userData } });
              } else {
                reject({
                  error: { status: "NOT_FOUND", message: "User not found" },
                });
              }
            },
            (error) =>
              reject({
                error: { status: "FETCH_ERROR", message: error.message },
              })
          );
          return () => unsubscribe();
        });
      },
      providesTags: (result, error, userId) => [{ type: "User", id: userId }],
    }),
    
    unfollowUser: builder.mutation({
      async queryFn({ currentUserId, targetUserId }) {
        try {
          const currentUserRef = doc(db, "users", currentUserId);
          const targetUserRef = doc(db, "users", targetUserId);

          await Promise.all([
            updateDoc(currentUserRef, { following: arrayRemove(targetUserId) }),
            updateDoc(targetUserRef, { followers: arrayRemove(currentUserId) }),
          ]);

          return { data: { currentUserId, targetUserId } };
        } catch (error) {
          return { error: { status: "UPDATE_ERROR", message: error.message } };
        }
      },
      invalidatesTags: ["UserFollowStatus"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  ,
} = usersApi;
