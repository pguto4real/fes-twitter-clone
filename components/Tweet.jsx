import React from "react";
import TweetHeader from "./TweetHeader";
import {
  ChartBarIcon,
  ChatIcon,
  HeartIcon,
  UploadIcon,
} from "@heroicons/react/outline";
import { useDispatch } from "react-redux";
import { openCommentModal, setCommentTweet } from "@/redux/modalSlice";
import Link from "next/link";

const Tweet = ({ data }) => {
  const dispatch = useDispatch();

  return (
    <div className="border-b border-gray-700">
      <Link href={`${data?.tweetId}`} >
      <TweetHeader
        username={data?.username}
        name={data?.name}
        timestamp={data?.timestamp?.toDate()}
        text={data?.tweet}
        photoUrl={data?.photoUrl}
        tweetId={data?.tweetId}
      />
      </Link>
      <div className="p-3 ml-16 text-gray-500 flex space-x-14">
        <div
          onClick={() => {
            dispatch(
              setCommentTweet({
                id: data?.tweetId,
                tweet: data?.tweet,
                photoUrl: data?.photoUrl,
                name: data?.name,
                username: data?.username,
              })
            );
            dispatch(openCommentModal());
          }}
        >
          <ChatIcon className="w-5 cursor-pointer hover:text-green-400" />
        </div>
        <HeartIcon className="w-5 cursor-pointer hover:text-pink-500" />
        <ChartBarIcon className="w-5 cursor-not-allowed" />
        <UploadIcon className="w-5 cursor-not-allowed" />
      </div>
    </div>
  );
};

export default Tweet;
