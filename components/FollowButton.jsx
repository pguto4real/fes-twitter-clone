import useFollow from "@/hooks/useFollow";
import React from "react";


const FollowButton = ({ currentUserId, targetUserId,className }) => {
  const { isFollowing, isLoading, followUser, unfollowUser } = useFollow(currentUserId, targetUserId);

  if (isLoading) return <button disabled>Loading...</button>;

  return (
    <button  onClick={isFollowing ? unfollowUser : followUser} className={`${className}`}>
      {isFollowing ? "Unfollow" : "Follow"}
      </button>
    
  );
};

export default FollowButton;