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
import { useGetPostsByUidQuery } from "@/redux/postsApi";

const Posts = ({ feedType, userId }) => {
 

  const { data: posts, error, isLoading } = useGetPostsByUidQuery({ uid: userId, feedType: feedType });

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
            <Tweet key={post.id} data={post}/>
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
