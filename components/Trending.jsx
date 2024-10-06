import { db } from "@/firebase";
import { DotsHorizontalIcon, SearchIcon } from "@heroicons/react/outline";
import { BadgeCheckIcon } from "@heroicons/react/solid";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import WhoToFollow from "./WhoToFollow";
import useNonMutualUsers from "@/hooks/useNonMutualUsers";

const Trending = () => {
  const currentUser = useSelector((state) => state.user);
  const [unfollowedUsers, setUnfollowedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [followStatus, setFollowStatus] = useState(false);
  const { nonMutualUsers, isLoadings } = useNonMutualUsers(currentUser.uid,followStatus);

  
  // console.log(nonMutualUsers);
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
        {nonMutualUsers.map((user) => (
          <WhoToFollow user={user} currentUser={currentUser}/>
        ))}

      </div>
    </div>
  );
};

export default Trending;
