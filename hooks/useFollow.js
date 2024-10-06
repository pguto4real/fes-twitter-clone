import { useState, useEffect } from "react";
import { doc, updateDoc, onSnapshot, arrayUnion, arrayRemove, runTransaction } from "firebase/firestore";
import { db } from "@/firebase"; // Adjust path based on your project structure

const useFollow = (currentUserId, targetUserId) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUserId || !targetUserId) return;

    // Real-time listener for follow status
    const targetUserRef = doc(db, "users", targetUserId);
    const unsubscribe = onSnapshot(targetUserRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const followers = docSnapshot.data().followers || [];
        setIsFollowing(followers.includes(currentUserId));
      }
      setIsLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [currentUserId, targetUserId]);

  const followUser = async () => {
    const currentUserRef = doc(db, "users", currentUserId);
    const targetUserRef = doc(db, "users", targetUserId);

    try {
      await runTransaction(db, async (transaction) => {
        // Add the current user to the followers of the target user
        transaction.update(targetUserRef, {
          followers: arrayUnion(currentUserId),
        });

        // Add the target user to the following list of the current user
        transaction.update(currentUserRef, {
          following: arrayUnion(targetUserId),
        });
      });
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const unfollowUser = async () => {
    const currentUserRef = doc(db, "users", currentUserId);
    const targetUserRef = doc(db, "users", targetUserId);

    try {
      await runTransaction(db, async (transaction) => {
        // Remove the current user from the followers of the target user
        transaction.update(targetUserRef, {
          followers: arrayRemove(currentUserId),
        });

        // Remove the target user from the following list of the current user
        transaction.update(currentUserRef, {
          following: arrayRemove(targetUserId),
        });
      });
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  return { isFollowing, isLoading, followUser, unfollowUser };
};

export default useFollow;