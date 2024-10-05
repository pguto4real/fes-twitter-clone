import React from "react";
import TweetHeader from "./TweetHeader";
import {
  ChartBarIcon,
  ChatIcon,
  HeartIcon,
  UploadIcon,
} from "@heroicons/react/outline";
import { useDispatch } from "react-redux";
import { openCommentModal } from "@/redux/modalSlice";

const Tweet = ({ data }) => {
  const { username, name, timestamp, tweet, photoUrl } = data;
  const dispatch = useDispatch();

  return (
    <div className="border-b border-gray-700">
      <TweetHeader
        username={username}
        name={name}
        timestamp={timestamp?.toDate()}
        text={tweet}
        photoUrl={photoUrl}
      />
      <div className="p-3 ml-16 text-gray-500 flex space-x-14">
        <div onClick={() => dispatch(openCommentModal())}>
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
