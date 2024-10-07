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
  tagTypes: ["UserFollowStatus", "UserPosts"],
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
          console.log(1234);
          let q;
          const postsRef = collection(db, "posts");
          // console.log('i got here')
          // console.log(feedType)
          // Handle based on feed type
          if (feedType === "posts") {
            console.log("i got here3");
            // Fetch posts by current user and users they follow
            const userDoc = await getDoc(doc(db, "users", uid));
            if (!userDoc.exists()) {
              return {
                error: { status: "NOT_FOUND", message: "User not found" },
              };
            }
            // console.log(uid)
            // console.log(userDoc)
            const { following = [] } = userDoc.data();

            // Get posts by current user and followed users
            //
            q = query(postsRef, where("uid", "==", uid));
          } else if (feedType === "likes") {
            console.log("i got here1");
            // Get posts liked by the current user
            q = query(postsRef, where("likes", "array-contains", uid));
          } else if (feedType === "index") {
            console.log("i got here2");
            const userDoc = await getDoc(doc(db, "users", uid));
            if (!userDoc.exists()) {
              return {
                error: { status: "NOT_FOUND", message: "User not found" },
              };
            }
            // console.log(uid)
            // console.log(userDoc)
            const { following = [] } = userDoc.data();
            q = query(postsRef, where("uid", "in", [...following, uid]));
          } else {
            return {
              error: {
                status: "INVALID_FEED_TYPE",
                message: "Invalid feed type",
              },
            };
          }

          return new Promise((resolve) => {
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
              const posts = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                console.log(data);
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
      providesTags: (result, error, { uid }) => [
        { type: "UserPosts", id: uid },
        { type: "UserFollowStatus" },
      ],
    }),
    followUser: builder.mutation({
      async queryFn({ currentUserId, targetUserId }) {
        try {
          const currentUserRef = doc(db, "users", currentUserId);
          const targetUserRef = doc(db, "users", targetUserId);

          await Promise.all([
            updateDoc(currentUserRef, { following: arrayUnion(targetUserId) }),
            updateDoc(targetUserRef, { followers: arrayUnion(currentUserId) }),
          ]);

          return { data: { currentUserId, targetUserId } };
        } catch (error) {
          return { error: { status: "UPDATE_ERROR", message: error.message } };
        }
      },
      invalidatesTags: (result, error, { postId }) => [
        { type: "UserPosts", id: postId },
        "UserFollowStatus",
      ],
    }),
    unfollowUser: builder.mutation({
      async queryFn({ currentUserId, targetUserId }) {
        try {
          const currentUserRef = doc(db, "users", currentUserId);
          const targetUserRef = doc(db, "users", targetUserId);

          // Start both updates in parallel
          const batchUpdate = [
            updateDoc(currentUserRef, { following: arrayRemove(targetUserId) }),
            updateDoc(targetUserRef, { followers: arrayRemove(currentUserId) }),
          ];

          await Promise.all(batchUpdate);

          return { data: { currentUserId, targetUserId } };
        } catch (error) {
          return { error: { status: "UPDATE_ERROR", message: error.message } };
        }
      },
      invalidatesTags: (result, error, { postId }) => [
        { type: "UserPosts", id: postId },
        "UserFollowStatus",
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
    getNonMutualUsers: builder.query({
      queryFn: (currentUserId) => ({
        data: new Promise(async (resolve, reject) => {
          try {
            // Step 1: Fetch the following and followers lists of the current user
            const currentUserRef = doc(db, "users", currentUserId);
            const currentUserDoc = await getDoc(currentUserRef);
            const { following = [], followers = [] } = currentUserDoc.exists()
              ? currentUserDoc.data()
              : {};

            // Step 2: Query all users except the current user
            const usersRef = collection(db, "users");
            const usersQuery = query(
              usersRef,
              where("uid", "!=", currentUserId)
            );

            // Step 3: Use onSnapshot to listen for real-time updates
            const unsubscribe = onSnapshot(
              usersQuery,
              (querySnapshot) => {
                const filteredUsers = [];
                querySnapshot.forEach((doc) => {
                  const userData = { id: doc.id, ...doc.data() };
                  const userId = userData.uid;

                  // Check if the user is not mutually following
                  const isNotMutuallyFollowing =
                    !following.includes(userId) && !followers.includes(userId);

                  if (isNotMutuallyFollowing) {
                    filteredUsers.push(userData);
                  }
                });

                resolve({ data: filteredUsers });
              },
              (error) => {
                reject({
                  error: { status: "FETCH_ERROR", message: error.message },
                });
              }
            );

            return () => unsubscribe();
          } catch (error) {
            reject({
              error: { status: "FETCH_ERROR", message: error.message },
            });
          }
        }),
      }),
      providesTags: ["UserFollowStatus"],
    }),
  }),
});

export const {
  useGetAllPostsQuery,
  useGetPostsByUidQuery,
  useUpdatePostLikeMutation,
  useAddPostCommentMutation,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useGetNonMutualUsersQuery,
} = postsApi;
