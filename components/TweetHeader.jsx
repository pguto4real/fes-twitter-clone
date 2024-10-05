import React from "react";
import Moment from "react-moment";

const TweetHeader = ({ username, name, timestamp, text, photoUrl, image }) => {
  return (
    <div className="flex space-x-3 p-3 ">
      
      <img className="w-11 h-11 rounded-full object-cover" src={photoUrl} />
      <div>
        <div className="mb-1 flex space-x-2 items-center text-gray-500">
          <h1 className="text-white font-bold">{name}</h1>
          <span>@{username}</span>
          <div className="w-1 h-1 rounded-full bg-gray-500"></div>
          <Moment fromNow>{timestamp}</Moment>
        </div>
        <span>{text}</span>
        {image && <img src={image} className="object-cover rounded-md mt-3 max-h-80 border border-gray-700"/>}
      </div>
    </div>
  );
};

export default TweetHeader;
