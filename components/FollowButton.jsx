import useFollow from "@/hooks/useFollow";
import { useFollowUserMutation, useUnfollowUserMutation } from "@/redux/postsApi";

import React from "react";

const FollowButton = ({ currentUserId, targetUserId, className }) => {
  const { isFollowing, isLoading } = useFollow(currentUserId, targetUserId);
  console.log(isFollowing);
  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();

  const handleFollow = async () => {
    console.log(isFollowing);
    !isFollowing
      ? await followUser({
          currentUserId,
          targetUserId,
        })
      : await unfollowUser({
          currentUserId,
          targetUserId,
        });
  };
  if (isLoading) return <button disabled>Loading...</button>;

  return (
    <button onClick={handleFollow} className={`${className}`}>
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowButton;
