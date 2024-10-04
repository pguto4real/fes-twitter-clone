import { DotsHorizontalIcon, SearchIcon } from "@heroicons/react/outline";
import { BadgeCheckIcon } from "@heroicons/react/solid";
import React from "react";

const Trending = () => {
  return (
    <div className="hidden lg:flex flex-col ml-7 mt-4 ">
      
      <div
        className="flex space-x-3
       bg-white bg-opacity-10 
       w-[300px] h-[44px] p-3 rounded-3xl"
      >
        <SearchIcon className="w-6 text-gray-600 " />
        <input
          placeholder="Search Twitter"
          className="bg-transparent focus:outline-none
          placeholder:text-gray-600"
        />
      </div>
      <div className="bg-white bg-opacity-10 w-[300px] h-[500px] rounded-3xl mt-3">
        <h1 className="font-bold text-xl p-3">What's happening</h1>
        <div className="p-3 flex justify-between">
          <div>
            <p className="text-gray-500 text-xs">Trending in US</p>
            <h1 className="text-[15px] font-bold ">China</h1>
            <p className="text-gray-500 text-xs">340k Tweets</p>
          </div>
          <div>
            <DotsHorizontalIcon className="w-5 text-gray-600 " />
          </div>
        </div>
        <div className="p-3 flex justify-between">
          <div>
            <p className="text-gray-500 text-xs">Trending in US</p>
            <h1 className="text-[15px] font-bold ">China</h1>
            <p className="text-gray-500 text-xs">340k Tweets</p>
          </div>
          <div>
            <DotsHorizontalIcon className="w-5 text-gray-600 " />
          </div>
        </div>
        <div className="p-3 flex justify-between">
          <div>
            <p className="text-gray-500 text-xs">Trending in US</p>
            <h1 className="text-[15px] font-bold ">China</h1>
            <p className="text-gray-500 text-xs">340k Tweets</p>
          </div>
          <div>
            <DotsHorizontalIcon className="w-5 text-gray-600 " />
          </div>
        </div>
        <div className="p-3 flex justify-between">
          <div>
            <p className="text-gray-500 text-xs">Trending in US</p>
            <h1 className="text-[15px] font-bold ">China</h1>
            <p className="text-gray-500 text-xs">340k Tweets</p>
          </div>
          <div>
            <DotsHorizontalIcon className="w-5 text-gray-600 " />
          </div>
        </div>
        <div className="p-3 flex justify-between">
          <div>
            <p className="text-gray-500 text-xs">Trending in US</p>
            <h1 className="text-[15px] font-bold ">China</h1>
            <p className="text-gray-500 text-xs">340k Tweets</p>
          </div>
          <div>
            <DotsHorizontalIcon className="w-5 text-gray-600 " />
          </div>
        </div>
      </div>
      <div className="bg-white bg-opacity-10 w-[300px] h-[300px] rounded-3xl mt-3">
        <h1 className="font-bold text-xl p-3">Who to follow</h1>
        <div className="p-3 flex justify-between">
          <div className="flex space-x-3">
            <img
              className="w-11 h-11 rounded-full object-cover"
              src="/assets/avatar-placeholder.png/"
            />
            <div className="flex flex-col">
              <div className="flex space-x-1">
                <h1 className="font-bold">Elon Musk</h1>
                <BadgeCheckIcon className="text-blue-400  w-[18px]" />
              </div>

              <h1 className="text-gray-500 text-[12px] mt-1">@elonMusk</h1>
            </div>
          </div>
          <button className="bg-white text-black text-sm w-20 h-8 rounded-3xl">
            Follow
          </button>
        </div>
        <div className="p-3 flex justify-between">
          <div className="flex space-x-3">
            <img
              className="w-11 h-11 rounded-full object-cover"
              src="/assets/avatar-placeholder.png/"
            />
            <div className="flex flex-col">
              <div className="flex space-x-1">
                <h1 className="font-bold">Elon Musk</h1>
                <BadgeCheckIcon className="text-blue-400  w-[18px]" />
              </div>

              <h1 className="text-gray-500 text-[12px] mt-1">@elonMusk</h1>
            </div>
          </div>
          <button className="bg-white text-black text-sm w-20 h-8 rounded-3xl">
            Follow
          </button>
        </div>
        <div className="p-3 flex justify-between">
          <div className="flex space-x-3">
            <img
              className="w-11 h-11 rounded-full object-cover"
              src="/assets/avatar-placeholder.png/"
            />
            <div className="flex flex-col">
              <div className="flex space-x-1">
                <h1 className="font-bold">Elon Musk</h1>
                <BadgeCheckIcon className="text-blue-400  w-[18px]" />
              </div>

              <h1 className="text-gray-500 text-[12px] mt-1">@elonMusk</h1>
            </div>
          </div>
          <button className="bg-white text-black text-sm w-20 h-8 rounded-3xl">
            Follow
          </button>
        </div>
      </div>
    </div>
  );
};

export default Trending;
