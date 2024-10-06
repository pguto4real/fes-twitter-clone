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
  getDoc,
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
      async queryFn({ uid, feedType }) {
        try {
          let q;
          const postsRef = collection(db, "posts");
// console.log('i got here')
// console.log(feedType)
          // Handle based on feed type
          if (feedType === "posts") {
            // Fetch posts by current user and users they follow
            const userDoc = await getDoc(doc(db, "users", uid));
            if (!userDoc.exists()) {
              return { error: { status: "NOT_FOUND", message: "User not found" } };
            }
            // console.log(uid)
            // console.log(userDoc)
            const { following = [] } = userDoc.data();

            // Get posts by current user and followed users
            q = query(postsRef, where("uid", "in", [...following, uid]));
          } else if (feedType === "likes") {
            // Get posts liked by the current user
            q = query(postsRef, where("likes", "array-contains", uid));
          } else {
            return { error: { status: "INVALID_FEED_TYPE", message: "Invalid feed type" } };
          }

          return new Promise((resolve) => {
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
              const posts = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                  id: doc.id,
                  ...data,
                  timestamp: data.timestamp?.toDate().toISOString() || null,
                };
              });
              resolve({ data: posts });
            });

            return () => unsubscribe();
          });
        } catch (error) {
          return { error: { status: "FETCH_ERROR", message: error.message } };
        }
      },
      providesTags: (result, error, { uid }) => [{ type: "UserPosts", id: uid }],
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
      invalidatesTags: (result, error, { id }) => [{ type: "UserPosts", id }],
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
