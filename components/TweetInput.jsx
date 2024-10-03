import React from "react";

const TweetInput = () => {
  return (
    <div className="flex space-x-3 p-3 border-b border-gray-700">
      <img
        className="w-11 h-11 rounded-full object-cover"
        src="/assets/avatar-placeholder.png/"
        alt=""
      />
      <div className="w-full">
        <textarea
          name=""
          id=""
          className="bg-transparent resize-none outline-none w-full minh-[50px] text-lg"
          placeholder="What's on you mind?"
        />

        {/*  */}
        <div className="flex justify-between border-t border-gray-700 pt-4">
          <div>icons</div>
          <div>button</div>
        </div>
      </div>
    </div>
  );
};

export default TweetInput;
