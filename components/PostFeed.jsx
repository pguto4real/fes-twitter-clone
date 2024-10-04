import React, { useEffect, useState } from "react";

import TweetInput from "./TweetInput";
import Tweet from "./Tweet";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase";

const PostFeed = () => {
  const [tweets, SetTweets] = useState([]);
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      SetTweets(snapshot.docs);
    });
  }, []);
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
      {tweets.map((tweet) => {
        console.log(tweet)
        return <Tweet key={tweet.id} data={tweet.data()}/>;
      })}
    </div>
  );
};

export default PostFeed;
