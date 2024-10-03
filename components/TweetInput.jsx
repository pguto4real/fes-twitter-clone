import {
  CalendarIcon,
  ChartBarIcon,
  EmojiHappyIcon,
  LocationMarkerIcon,
  PhotographIcon,
} from "@heroicons/react/outline";
import React from "react";
import TweetInputIcons from "./TweetInputIcons";

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
          <div className="flex space-x-0">
            <TweetInputIcons Icon={PhotographIcon} />

            <TweetInputIcons Icon={ChartBarIcon} />
            <TweetInputIcons Icon={EmojiHappyIcon} />
            <TweetInputIcons Icon={CalendarIcon} />
            <TweetInputIcons Icon={LocationMarkerIcon} />
          </div>
          <div>
            <button className=" bg-[#1d9bf0] rounded-full  px-4 py-1.5  ">
              Tweet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetInput;
