import Image from "next/image";
import Link from "next/link";
import React from "react";
import Moment from "react-moment";

const TweetHeader = ({
  username,
  name,
  timestamp,
  text,
  photoUrl,
  image,
  uid,
  tweetId,
}) => {
  return (
    <div className="flex space-x-3 p-3 ">
      <Image
      alt=""
        width={44}
        height={44}
        className="w-11 h-11 rounded-full object-cover"
        src={photoUrl}
      />
      <div>
        <Link href={`/profile/${uid}`}>
          <div className="mb-1 flex space-x-2 items-center text-gray-500">
            <h1 className="text-white font-bold">{name}</h1>
            <span>@{username}</span>
            <div className="w-1 h-1 rounded-full bg-gray-500"></div>
            <Moment fromNow>{timestamp}</Moment>
          </div>
        </Link>
        <Link href={`${tweetId}`}>
          <span>{text}</span>
          {image && (
            <Image
              src={image}
              alt="Tweet image"
              width={320} // Replace with appropriate width
              height={320} // Replace with appropriate height
              className="object-cover rounded-md mt-3 max-h-80 border border-gray-700"
            />
          )}
        </Link>
      </div>
    </div>
  );
};

export default TweetHeader;
