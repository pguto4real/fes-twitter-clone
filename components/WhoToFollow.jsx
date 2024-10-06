import { BadgeCheckIcon } from "@heroicons/react/outline";
import React from "react";
import FollowButton from "./FollowButton";

const WhoToFollow = ({ user, currentUser }) => {

  return (
    <div className="p-3 flex justify-between">
      <div className="flex space-x-3">
        <img
          className="w-11 h-11 rounded-full object-cover"
          src={`${user.photoURL || "/assets/avatar-placeholder.png/"}`}
        />
        <div className="flex flex-col">
          <div className="flex space-x-1">
            <h1 className="font-bold">{user?.name?.split(" ")[0]}</h1>
            <BadgeCheckIcon className="text-blue-400  w-[18px]" />
          </div>

          <h1 className="text-gray-500 text-[12px] mt-1">@{user.username}</h1>
        </div>
      </div>
      <FollowButton
        currentUserId={currentUser.uid}
        targetUserId={user.uid}
        className={"bg-white text-black text-sm w-20 h-8 rounded-3xl"}
      />
    </div>
  );
};

export default WhoToFollow;
