// src/services/postsApi.js
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";

export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["UserFollowStatus", "UserPosts"],
  endpoints: (builder) => ({
    getAllPosts: builder.query({
      queryFn: () => ({
        data: new Promise((resolve, reject) => {
          const postsCollection = collection(db, "posts");
          const unsubscribe = onSnapshot(
            postsCollection,
            (snapshot) => {
              const posts = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              resolve(posts);
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
    getPostsByUid: builder.query({
      async queryFn({ uid, feedType }) {
        try {
          let q;
          const postsRef = collection(db, "posts");

          if (feedType === "posts") {
            const userDoc = await getDoc(doc(db, "users", uid));
            if (!userDoc.exists()) {
              return { error: { status: "NOT_FOUND", message: "User not found" } };
            }
            q = query(postsRef, where("uid", "==", uid));
          } else if (feedType === "likes") {
            q = query(postsRef, where("likes", "array-contains", uid));
          } else if (feedType === "index") {
            const userDoc = await getDoc(doc(db, "users", uid));
            if (!userDoc.exists()) {
              return { error: { status: "NOT_FOUND", message: "User not found" } };
            }
            const { following = [] } = userDoc.data();
            q = query(postsRef, where("uid", "in", [...following, uid]));
          } else {
            return { error: { status: "INVALID_FEED_TYPE", message: "Invalid feed type" } };
          }

          return new Promise((resolve) => {
            const unsubscribe = onSnapshot(q, (snapshot) => {
              const posts = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate().toISOString() || null,
              }));
              resolve({ data: posts });
            });
            return () => unsubscribe();
          });
        } catch (error) {
          return { error: { status: "FETCH_ERROR", message: error.message } };
        }
      },
      providesTags: (result, error, { uid }) => [
        { type: "UserPosts", id: uid },
        { type: "UserFollowStatus" },
      ],
    }),
  
    updatePostLike: builder.mutation({
      async queryFn({ postId, userId, isLiked }) {
        try {
          const postRef = doc(db, "posts", postId);
          await updateDoc(postRef, {
            likes: isLiked ? arrayRemove(userId) : arrayUnion(userId),
          });
          return { data: { postId, userId } };
        } catch (error) {
          return { error: { status: "UPDATE_ERROR", message: error.message } };
        }
      },
      invalidatesTags: (result, error, { postId }) => [{ type: "UserPosts", id: postId }],
    }),
  }),
});

export const {
  useGetAllPostsQuery,
  useGetPostsByUidQuery,
  useUpdatePostLikeMutation,
  
} = postsApi;
