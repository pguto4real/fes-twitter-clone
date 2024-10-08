// src/services/usersApi.js
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../firebase";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["UserFollowStatus", "User","UserPosts"],
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
                // Convert timestamp to a serializable format if it exists
                const userData = snapshot.data();
                const formattedData = {
                  id: snapshot.id,
                  ...userData,
                  // Ensure any timestamp field is formatted
                  timestamp: userData.timestamp
                    ? userData.timestamp.toDate().toISOString()
                    : null,
                };

                resolve({ data: formattedData });
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
          // Cleanup function for unsubscribe
          return () => unsubscribe();
        });
      },
      providesTags: (result, error, userId) => [{ type: "User", id: userId }],
    }),
    updateUserData: builder.mutation({
      async queryFn({ userId, data }) {
        try {
          const userRef = doc(db, "users", userId);
          await updateDoc(userRef, data);

          return { data: { userId, ...data } };
        } catch (error) {
          return { error: { status: "UPDATE_ERROR", message: error.message } };
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
    }),
   
   
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserDataMutation,
  // useFollowUserMutation,
  // useUnfollowUserMutation,
} = usersApi;
