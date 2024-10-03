import React from "react";

import TweetInput from "./TweetInput";
import Tweet from "./Tweet";

const PostFeed = () => {
  return (
    <div className="sm:ml-20 xl:ml-96 flex-grow border-x-gray-700 border-x max-w-2xl">
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
      <Tweet />
    </div>
  );
};

export default PostFeed;
