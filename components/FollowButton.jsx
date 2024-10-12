import useFollow from "@/hooks/useFollow";
import { openLogInModal } from "@/redux/modalSlice";
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
} from "@/redux/postsApi";

import React from "react";
import { useDispatch } from "react-redux";

const FollowButton = ({ currentUserId, targetUserId, className }) => {
  const { isFollowing, isLoading } = useFollow(currentUserId, targetUserId);

  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();
  const dispatch = useDispatch();

  const handleFollow = async () => {
    if (!currentUserId) {
      dispatch(openLogInModal());
      return;
    }
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
  // if (isLoading) return <button disabled>Loading...</button>;

  return (
    <button
      onClick={() => {
        handleFollow();
      }}
      className={`${className}`}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowButton;
