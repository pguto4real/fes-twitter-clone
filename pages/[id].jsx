import BottomBanner from "@/components/BottomBanner";
import PostFeed from "@/components/PostFeed";
import SideBar from "@/components/SideBar";
import Trending from "@/components/Trending";
import Tweet from "@/components/Tweet";
import { db } from "@/firebase";
import { ArrowLeftIcon } from "@heroicons/react/outline";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import React from "react";
import Moment from "react-moment";
import { useSelector } from "react-redux";
export const getServerSideProps = async (context) => {
  const id = context.query.id; // Extract dynamic route param
  const docRef = doc(db, "posts", id);
  const tweetDoc = await getDoc(docRef);
  const data = tweetDoc.data();
  // console.log(data)
  const formattedData = {
    username: data.username,
    name: data.name,
    email: data.email,
    uid: data.uid,
    photoUrl: data.photoUrl,
    image: data.image || null,
    tweet: data.tweet,
    comments: data.comment || null,
    timestamp: JSON.stringify(data.timestamp.toDate()),
  };

  return {
    props: {
      tweetData: formattedData,
    },
  };
};
const CommentsPage = ({ tweetData }) => {
 
  const user = useSelector((state) => state.user);
  return (
    <div>
      <div
        className="bg-black min-h-screen 
    text-[#E7E9EA] max-w-[1400px] mx-auto flex
    "
      >
        <SideBar />
        <div className="sm:ml-20 xl:ml-[350px] flex-grow border-x-gray-700 border-x max-w-2xl">
          <div
            className="px-3 
      py-2 text-lg 
      sm:text-xl font-bold 
      border-b border-gray-700
      sticky top-0 z-50 flex space-x-2"
          >
            <Link href={"/"}>
              <ArrowLeftIcon className="w-7 cursor-pointer " />
            </Link>
            <h1>Tweet</h1>
          </div>
          <div className="flex space-x-3 p-3  border-b border-gray-700">
            <img
              className="w-11 h-11 rounded-full object-cover"
              src={tweetData?.photoUrl || "/assets/avatar-placeholder.png/"}
            />
            <div>
              <div className="mb-1 flex space-x-2 items-center text-gray-500">
                <h1 className="text-white font-bold">{tweetData?.name}</h1>
                <span>@{tweetData?.username}</span>
                <div className="w-1 h-1 rounded-full bg-gray-500"></div>
                <Moment fromNow>{JSON.parse(tweetData?.timestamp)}</Moment>
              </div>
              <span className="text-2xl">{tweetData?.tweet}</span>
              {tweetData?.image && (
                <img
                  src={tweetData?.image}
                  className="object-cover rounded-md mt-3 max-h-80 border border-gray-700"
                />
              )}
            </div>
          </div>
          <div className="flex justify-between p-3   border-b border-gray-700">
            <div className="flex justify-center items-center space-x-2">
              <img
                className="w-12 h-12 rounded-full object-cover"
                src={user?.photoUrl}
              />
              <h1 className="text-2xl text-gray-500">Tweet Your reply</h1>
            </div>
            <div>
              <button
                disabled="true"
                className={` bg-[#1d9bf0] rounded-full  px-4 py-1.5 
                disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                Tweet
              </button>
            </div>
          </div>
          {tweetData.comments?.map((comment) => {
            return (
              <div className="flex space-x-3 p-3  border-b border-gray-700">
                <img
                  className="w-11 h-11 rounded-full object-cover"
                  src={comment?.photoUrl}
                />
                <div>
                  <div className="mb-1 flex space-x-2 items-center text-gray-500">
                    <h1 className="text-white font-bold">{comment?.name}</h1>
                    <span>@{comment?.username}</span>

                    {/* <Moment fromNow>{JSON.parse(comment?.timestamp)}</Moment> */}
                  </div>
                  <span>{comment?.comment}</span>
                </div>
              </div>
            );
          })}
        </div>
        <Trending />
      </div>
      {!user.username && <BottomBanner />}
    </div>
  );
};

export default CommentsPage;
