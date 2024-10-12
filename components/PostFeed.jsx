import React, { useEffect, useState } from "react";

import TweetInput from "./TweetInput";
import Tweet from "./Tweet";
import { useGetPostsByUidQuery } from "@/redux/postsApi";
import PostSkeleton from "./PostSkeleton";

const PostFeed = ({ currentUserId }) => {
  

  const {
    data: tweets,
    error,
    isLoading,
  } = useGetPostsByUidQuery({ uid: currentUserId, feedType: "index" });

  return (
    <div className="sm:ml-20 xl:ml-[350px] flex-grow border-x-gray-700 border-x max-w-2xl">
      <div
        className="px-3 
      py-2 text-lg 
      sm:text-xl font-bold 
      border-b border-gray-700
      sticky top-0 z-50"
      >
        Home
      </div>
      <TweetInput />
      {isLoading && (
        <>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </>
      )}
      {!isLoading &&
        tweets?.map((tweet) => {
          return <Tweet key={tweet.tweetId} data={tweet} />;
        })}
    </div>
  );
};

export default PostFeed;
