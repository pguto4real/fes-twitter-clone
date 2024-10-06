import Post from "./Post";

import { useEffect, useState } from "react";
import PostSkeleton from "./PostSkeleton";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";
import Tweet from "./Tweet";

const Posts = ({ feedType, username, userId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  const fetchUserPosts = () => {
    setIsLoading(true);

    try {
      const postsRef = collection(db, "posts");
      let q;

      // Determine the query based on feedType
      if (feedType === "posts") {

        q = query(postsRef, where("uid", "==", userId)); // Posts created by the user

        // Subscribe to posts updates
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const postsData = [];
          querySnapshot.forEach((doc) => {
            postsData.push({ id: doc.id, ...doc.data() });
          });
          setPosts(postsData);
          setIsLoading(false); // Set loading to false after fetching posts
        });

        return () => unsubscribe(); // Cleanup subscription on unmount
      } else if (feedType === "likes") {
 
        // Subscribe to all posts and filter liked posts based on userId
        const unsubscribe = onSnapshot(postsRef, (querySnapshot) => {
          const likedPostsData = [];
          querySnapshot.forEach((doc) => {
            const postData = { id: doc.id, ...doc.data() };
            if (postData.likes && postData.likes.includes(userId)) {
              likedPostsData.push(postData); // Include posts where the user has liked
            }
          });
          setPosts(likedPostsData);
          setIsLoading(false); // Set loading to false after fetching posts
        });

        return () => unsubscribe(); // Cleanup subscription on unmount
      } else {
        // Handle other feed types or set to an empty array if unknown
        console.error("Unknown feed type:", feedType);
        setPosts([]);
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setIsLoading(false); // Ensure loading is stopped in case of an error
    }
  };
  const refreshPosts = () => {
    fetchUserPosts();
  };
  useEffect(() => {
    if (userId) {
      fetchUserPosts();
    }
  }, [userId, feedType]);


  return (
    <>
      {isLoading && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
        
        </div>
      )}
      {!isLoading && posts?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && posts && (
        <div>
          {posts.map((post) => (
            // <Post key={post._id} post={post} />
            // <div>fdfffd</div>
            <Tweet key={post.id} data={post} refreshPosts={refreshPosts} isRefreshed ={true}/>
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
