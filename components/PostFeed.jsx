import React, { useEffect, useState } from "react";

import TweetInput from "./TweetInput";
import Tweet from "./Tweet";
import {
  useFetchPostsQuery,
  useGetAllPostsQuery,
  useGetPostsByUidQuery,
} from "@/redux/postsApi";
import PostSkeleton from "./PostSkeleton";

const PostFeed = ({ currentUserId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tweets, setTweets] = useState([]);

  const {
    data: postsByUid,
    error: errorByUid,
    isLoading: isLoadingByUid,
  } = useGetPostsByUidQuery(
    {
      uid: currentUserId,
      feedType: "index",
    },
    { skip: !currentUserId }
  );

  const {
    data: allPosts,
    error: errorAllPosts,
    isLoading: isLoadingAllPosts,
  } = useGetAllPostsQuery({}, { skip: !!currentUserId }); // Skip if the user is logged in

  useEffect(() => {
    if (currentUserId) {
      if (postsByUid) {
        setTweets(postsByUid);
      }
      setIsLoading(isLoadingByUid);
    } else {
      if (allPosts) {
        setTweets(allPosts);
      }
      setIsLoading(isLoadingAllPosts);
    }
  }, [postsByUid, allPosts, currentUserId, isLoadingByUid, isLoadingAllPosts]);

  // useEffect(() => {
  //   if (currentUserId) {
  //     const { data, error, isLoading } = useGetPostsByUidQuery({
  //       uid: currentUserId,
  //       feedType: "index",
  //     });
  //     setIsLoading(isLoading);
  //     setTweets(data);
  //   } else {
  //     const {
  //       data,
  //       error,
  //       isLoading,
  //     } = useGetAllPostsQuery()
  //     setIsLoading(isLoading);
  //     setTweets(data);
  //   }
  // }, []);

  // const {
  //   data: tweets,
  //   error,
  //   isLoading,
  // } = useFetchPostsQuery({ uid: currentUserId, isLoggedIn, feedType: "index" });

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
