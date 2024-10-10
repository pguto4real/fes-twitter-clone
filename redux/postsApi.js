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
    getTweetById: builder.query({
      // Using async onSnapshot to get real-time updates
      async queryFn({ tweetId }) {
        try {
          if (!tweetId) {
            return {
              error: {
                status: "INVALID_REQUEST",
                message: "Tweet ID is required",
              },
            };
          }
          console.log(tweetId);
          // Return a Promise that resolves when onSnapshot fetches data
          return new Promise((resolve) => {
            const docRef = doc(db, "posts", tweetId);

            const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
              if (docSnapshot.exists()) {
                const data = docSnapshot.data();

                const formattedData = {
                  username: data?.username || "Unknown",
                  name: data?.name || "Anonymous",
                  email: data?.email || "",
                  uid: data?.uid || "",
                  photoUrl: data?.photoUrl || "/default-avatar.png",
                  image: data?.image || null,
                  tweet: data?.tweet || "",
                  comments: data?.comment || null,
                  timestamp: data.timestamp
                    ? data.timestamp.toDate().toISOString()
                    : null,
                };

                resolve({ data: formattedData });
              } else {
                resolve({
                  error: { status: "NOT_FOUND", message: "Tweet not found" },
                });
              }
            });

            return () => unsubscribe(); // Cleanup on unmount
          });
        } catch (error) {
          console.error("Error fetching tweet:", error);
          return { error: { status: "FETCH_ERROR", message: error.message } };
        }
      },
      providesTags: (result, error, tweetId) => [{ type: "Tweet", tweetId }],
    }),
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

          // Handle based on feed type
          if (feedType === "posts") {
            // Fetch posts by current user and users they follow
            const userDoc = await getDoc(doc(db, "users", uid));
            if (!userDoc.exists()) {
              return {
                error: { status: "NOT_FOUND", message: "User not found" },
              };
            }

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
            const usersRef = collection(db, "users");

            // If currentUserId is null, fetch all users
            if (!currentUserId) {
              const unsubscribe = onSnapshot(
                usersRef,
                (querySnapshot) => {
                  const allUsers = querySnapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                    timestamp: doc.data().timestamp
                      ? doc.data().timestamp.toDate().toISOString()
                      : null,
                  }));

                  resolve({ data: allUsers });
                },
                (error) => {
                  console.error("Error onSnapshot:", error);
                  reject({
                    error: { status: "FETCH_ERROR", message: error.message },
                  });
                }
              );

              return () => unsubscribe();
            }

            // If currentUserId is provided, fetch non-mutual users
            const currentUserRef = doc(db, "users", currentUserId);
            const currentUserDoc = await getDoc(currentUserRef);

            if (!currentUserDoc.exists()) {
              return reject({
                error: { status: "NOT_FOUND", message: "User not found" },
              });
            }

            const { following } = currentUserDoc.data() || {};
            const followingArray = Array.isArray(following) ? following : [];

            const usersQuery = query(
              usersRef,
              where("uid", "!=", currentUserId)
            );
            const unsubscribe = onSnapshot(
              usersQuery,
              (querySnapshot) => {
                const filteredUsers = [];
                querySnapshot.forEach((doc) => {
                  const userData = doc.data();
                  const userId = userData?.uid;

                  if (userData && userId && !followingArray.includes(userId)) {
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

    fetchPosts: builder.query({
      async queryFn({ uid, isLoggedIn, feedType }) {
        console.log(isLoggedIn);
        if (!isLoggedIn) {
          console.log(12344);
          return await api.endpoints.getAllPosts.initiate();
        } else {
          return await api.endpoints.getPostsByUid.initiate({ uid, feedType });
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
  useFollowUserMutation,
  useUnfollowUserMutation,
  useGetNonMutualUsersQuery,
  useCreateTweetMutation,
  useDeletePostMutation,
  useFetchPostsQuery,
  useGetTweetByIdQuery,
} = postsApi;
