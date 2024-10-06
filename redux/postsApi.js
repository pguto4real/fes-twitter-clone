// src/services/postsApi.js
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getAllPosts: builder.query({
      async queryFn() {
        try {
          const postsCollection = collection(db, "posts");
          const postsSnapshot = await getDocs(postsCollection);
          const posts = postsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          return { data: posts };
        } catch (error) {
          return { error: { status: "FETCH_ERROR", message: error.message } };
        }
      },
    }),
    getPostsByUid: builder.query({
      async queryFn(uid) {
        try {
          const postsRef = collection(db, "posts");
          const q = query(postsRef, where("uid", "==", uid));

          return new Promise((resolve) => {
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
              const posts = querySnapshot.docs.map((doc) => {
                const data = doc.data();

                // Convert the Timestamp to a serializable format
                return {
                  id: doc.id,
                  ...data,
                  timestamp: data.timestamp.toDate().toISOString(), // or .toDate().getTime()
                };
              });
              resolve({ data: posts });
            });

            return () => unsubscribe();
          });
        } catch (error) {
          return { error: error.message };
        }
      },
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
    }),
    addPostComment: builder.mutation({
      async queryFn({ postId, comment }) {
        try {
          const postRef = doc(db, "posts", postId);
          await updateDoc(postRef, {
            comments: arrayUnion(comment),
          });
          return { data: { postId, comment } };
        } catch (error) {
          return { error: { status: "UPDATE_ERROR", message: error.message } };
        }
      },
    }),
  }),
});

export const {
  useGetAllPostsQuery,
  useGetPostsByUidQuery,
  useUpdatePostLikeMutation,
  useAddPostCommentMutation,
} = postsApi;
