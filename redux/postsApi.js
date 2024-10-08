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
  orderBy,
  addDoc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

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
          let q;
          const postsRef = collection(db, "posts");
          // console.log('i got here')
          console.log(feedType);
          // Handle based on feed type
          if (feedType === "posts") {
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
            q = query(
              postsRef,
              where("uid", "==", uid),
              orderBy("timestamp", "desc")
            );
          } else if (feedType === "likes") {
            // Get posts liked by the current user
            q = query(
              postsRef,
              where("likes", "array-contains", uid),
              orderBy("timestamp", "desc")
            );
          } else if (feedType === "index") {
            const userDoc = await getDoc(doc(db, "users", uid));
            if (!userDoc.exists()) {
              return {
                error: { status: "NOT_FOUND", message: "User not found" },
              };
            }
            // console.log(uid)
            // console.log(userDoc)
            const { following = [] } = userDoc.data();

            q = query(
              postsRef,
              where("uid", "in", [...following, uid]),
              orderBy("timestamp", "desc")
            );
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
    createTweet: builder.mutation({
      async queryFn({ userData, text, image }, { dispatch }) {
        try {
          // Step 1: Add a new tweet document
          const docRef = await addDoc(collection(db, "posts"), {
            username: userData.username,
            name: userData.name,
            email: userData.email,
            uid: userData.uid,
            timestamp: serverTimestamp(),
            photoUrl: userData.photoUrl,
            tweet: text,
            likes: [],
          });

          const postId = docRef.id;

          // Step 2: Update the document with tweetId
          await updateDoc(docRef, { tweetId: postId });

          // Step 3: If there's an image, upload it and update the document with image URL
          if (image) {
            const imageRef = ref(storage, `tweetImages/${postId}`);
            await uploadString(imageRef, image, "data_url");
            const downloadUrl = await getDownloadURL(imageRef);
            await updateDoc(docRef, { image: downloadUrl });
          }

          // Optional: Clear local state if needed
          dispatch(postsApi.util.resetApiState());

          // Return the created tweet data as result
          return { data: { id: postId, ...docRef.data() } };
        } catch (error) {
          return { error: { status: "ERROR", message: error.message } };
        }
      },
      // This ensures that the posts list updates when a new tweet is added
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
    deletePost: builder.mutation({
      async queryFn(tweetId) {
        try {
          // Reference the post document by tweetId
          const postRef = doc(db, "posts", tweetId);

          // Delete the document
          await deleteDoc(postRef);

          // Return a success response
          return { data: { success: true } };
        } catch (error) {
          // Return an error response
          return { error: { status: "DELETE_ERROR", message: error.message } };
        }
      },
      // Invalidate UserPosts and UserFollowStatus to trigger a refresh
      invalidatesTags: (result, error, tweetId) => [
        { type: "UserPosts" },
        { type: "UserFollowStatus" },
      ],
    }),
    getNonMutualUsers: builder.query({
      queryFn: (currentUserId) => ({
        data: new Promise(async (resolve, reject) => {
          try {
            // Step 1: Fetch the following list of the current user
            const currentUserRef = doc(db, "users", currentUserId);
            const currentUserDoc = await getDoc(currentUserRef);

            // Check if the user document exists
            if (!currentUserDoc.exists()) {
              return reject({
                error: { status: "NOT_FOUND", message: "User not found" },
              });
            }

            // Use an empty array if following is missing or null
            const { following = [] } = currentUserDoc.data() || {};

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
                  const userData = doc.data();
                  const userId = userData.uid;

                  // Check if the user is not mutually following
                  if (!following.includes(userId)) {
                    // Convert any Timestamp fields to ISO strings for serialization
                    const serializableData = {
                      ...userData,
                      id: doc.id,
                      timestamp: userData.timestamp
                        ? userData.timestamp.toDate().toISOString()
                        : null,
                    };
                    filteredUsers.push(serializableData);
                  }
                });

                resolve({ data: filteredUsers });
              },
              (error) => {
                console.error("Error onSnapshot:", error);
                reject({
                  error: { status: "FETCH_ERROR", message: error.message },
                });
              }
            );

            return () => unsubscribe();
          } catch (error) {
            console.error("Error in getNonMutualUsers:", error);
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
  useCreateTweetMutation,
  useDeletePostMutation,
} = postsApi;
