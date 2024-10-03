import React from "react";

const TweetHeader = () => {
  return (
    <div className="flex space-x-3 p-3 ">
      <img
        className="w-11 h-11 rounded-full object-cover"
        src="/assets/avatar-placeholder.png/"
      />
      <div>
        <div className="mb-1 flex space-x-2 items-center text-gray-500">
          <span>@_pguto</span>
          <div className="w-1 h-1 rounded-full bg-gray-500"></div>
          <span>2 hours ago</span>
        </div>
        <span>Text</span>
      </div>
    </div>
  );
};

export default TweetHeader;
