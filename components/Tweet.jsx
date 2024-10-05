import React, { useEffect, useState } from "react";
import TweetHeader from "./TweetHeader";
import {
  ChartBarIcon,
  ChatIcon,
  HeartIcon,
  TrashIcon,
  UploadIcon,
} from "@heroicons/react/outline";
import { HeartIcon as FilledHeart } from "@heroicons/react/solid";
import { useDispatch, useSelector } from "react-redux";
import {
  openCommentModal,
  openLogInModal,
  setCommentTweet,
} from "@/redux/modalSlice";
import Link from "next/link";
import { db } from "@/firebase";
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

const Tweet = ({ data }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
 

  const [isLiked, setIsLiked] = useState(false); // Tracks if the user has liked the post
  const [likesCount, setLikesCount] = useState(0); // Tracks the number of likes on the post
  const [commentsCount, setCommentsCount] = useState(0); // Tracks the number of likes on the post

  // Real-time listener for the post document using onSnapshot
  useEffect(() => {
    const tweetId = data?.tweetId;
   
    const userId = user.uid;
  
    if (!tweetId) return;
    const unsubscribe = onSnapshot(doc(db, "posts", tweetId), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();

        const likes = data.likes || [];
        const comments = data.comment || [];
        setLikesCount(likes.length); // Set the total likes count
        setCommentsCount(comments.length); // Set the total likes count
        setIsLiked(likes.includes(userId)); // Check if the current user has liked the post
      }
    });

    // Cleanup listener when component unmounts
    return  unsubscribe;
  }, [data.tweetId, user.uid]);

  // Function to toggle like/unlike
  const likeComment = async () => {
    if (!user.username) {
      dispatch(openLogInModal());
      return;
    }
    const postRef = doc(db, "posts", data.tweetId);

    try {
      if (isLiked) {
        // If the user has liked the post, unlike it
        await updateDoc(postRef, {
          likes: arrayRemove(user.uid),
        });
      } else {
        // If the user hasn't liked the post, like it
        await updateDoc(postRef, {
          likes: arrayUnion(user.uid),
        });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const isAuthorized = user.uid === data?.uid;

  const deleteTweet = async () => {
    const tweetId = data.tweetId;

    try {
      const postRef = doc(db, "posts", tweetId);
      await deleteDoc(postRef);
      console.log("Post deleted successfully.");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  return (
    <div className="border-b border-gray-700">
      <Link href={`${data?.tweetId}`}>
        <TweetHeader
          username={data?.username}
          name={data?.name}
          timestamp={data?.timestamp?.toDate()}
          text={data?.tweet}
          photoUrl={data?.photoUrl}
          tweetId={data?.tweetId}
          image={data?.image}
        />
      </Link>
      <div className="p-3 ml-16 text-gray-500 flex space-x-14">
        <div
          onClick={() => {
            if (!user.username) {
              dispatch(openLogInModal());
              return;
            }
            dispatch(
              setCommentTweet({
                id: data?.tweetId,
                tweet: data?.tweet,
                photoUrl: data?.photoUrl,
                name: data?.name,
                username: data?.username,
              })
            );
            dispatch(openCommentModal());
          }}
          className="flex justify-center items-center space-x-2"
        >
          <ChatIcon className="w-5 text-pink-500 cursor-pointer hover:text-green-400" />
          {commentsCount > 0 && <span>{commentsCount}</span>}
        </div>
        <div
          className="flex justify-center items-center space-x-2"
          onClick={likeComment}
        >
          {isLiked ? (
            <FilledHeart className="w-5 cursor-pointer text-pink-500" />
          ) : (
            <HeartIcon className="w-5 cursor-pointer hover:text-pink-500" />
          )}
          {likesCount > 0 && <span>{likesCount}</span>}
        </div>
        {isAuthorized && (
          <div onClick={deleteTweet}>
            <TrashIcon className="w-5 cursor-pointer hover:text-red-600" />
          </div>
        )}
        <div>
          <ChartBarIcon className="w-5 flex justify-center items-center cursor-not-allowed" />
        </div>

        <UploadIcon className="w-5 flex justify-center items-center  cursor-not-allowed" />
      </div>
    </div>
  );
};

export default Tweet;
