import BottomBanner from "@/components/BottomBanner";
import PostFeed from "@/components/PostFeed";
import ProfileHeaderSkeleton from "@/components/ProfileHeaderSkeleton";
import SideBar from "@/components/SideBar";
import Trending from "@/components/Trending";
import Tweet from "@/components/Tweet";
import { db } from "@/firebase";
import { useGetTweetByIdQuery } from "@/redux/postsApi";
import { ArrowLeftIcon } from "@heroicons/react/outline";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Moment from "react-moment";
import { useSelector } from "react-redux";
// export const getServerSideProps = async (context) => {
//   const id = context.query.id;

//   try {
//     const docRef = doc(db, 'posts', id);
//     const tweetDoc = await getDoc(docRef);

//     if (!tweetDoc.exists()) {
//       // If the document does not exist, return a 404 page
//       return {
//         notFound: true,
//       };
//     }

//     const data = tweetDoc.data();

//     // Safely extract data fields and handle any missing ones
//     const formattedData = {
//       username: data?.username || 'Unknown',
//       name: data?.name || 'Anonymous',
//       email: data?.email || '',
//       uid: data?.uid || '',
//       photoUrl: data?.photoUrl || '/default-avatar.png',
//       image: data?.image || null,
//       tweet: data?.tweet || '',
//       comments: data?.comment || null,
//       timestamp: data.timestamp ? JSON.stringify(data.timestamp.toDate()) : null,
//     };

//     return {
//       props: {
//         tweetData: formattedData,
//       },
//     };

//   } catch (error) {
//     console.error('Error fetching tweet:', error);

//     // Optionally, you can return a fallback page or redirect
//     return {
//       props: {
//         tweetData: null,
//         error: 'Failed to load tweet data',
//       },
//     };
//   }
// };
const CommentsPage = () => {
  const user = useSelector((state) => state.user);
  const router = useRouter();
  const { id } = router.query;
   const tweetId = id;
  console.log(id);
  const {
    data: tweetData,
    error,
    isLoading,
  } = useGetTweetByIdQuery({ tweetId });

  return (
    <div>
      <div
        className="bg-black min-h-screen 
    text-[#E7E9EA] max-w-[1400px] mx-auto flex
    "
      >
        <SideBar />
        <div className="sm:ml-20 xl:ml-[350px] flex-grow border-x-gray-700 border-x max-w-2xl">
          {isLoading && <ProfileHeaderSkeleton />}
          {!isLoading && (
            <>
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
                  alt=""
                  // width={44}
                  // height={44}
                  className="w-11 h-11 rounded-full object-cover"
                  src={tweetData?.photoUrl || "/assets/avatar-placeholder.png/"}
                />
                <div>
                  <div className="mb-1 flex space-x-2 items-center text-gray-500">
                    <h1 className="text-white font-bold">{tweetData?.name}</h1>
                    <span>@{tweetData?.username}</span>
                    <div className="w-1 h-1 rounded-full bg-gray-500"></div>
                    <Moment fromNow>{tweetData?.timestamp}</Moment>
                  </div>
                  <span className="text-2xl">{tweetData?.tweet}</span>
                  {tweetData?.image && (
                    <img
                      src={tweetData?.image}
                      alt="Tweet image"
                      // width={320} // Set a width value suitable for your layout
                      // height={320} // Set a height value or calculate based on aspect ratio
                      className="object-cover rounded-md mt-3 max-h-80 border border-gray-700"
                    />
                  )}
                </div>
              </div>
              <div className="flex justify-between p-3   border-b border-gray-700">
                <div className="flex justify-center items-center space-x-2">
                  <img
                    // width={48}
                    // height={48}
                    className="w-12 h-12 rounded-full object-cover"
                    src={user?.photoUrl}
                    alt=""
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
              {tweetData?.comments?.map((comment, index) => {
                return (
                  <div
                    key={index}
                    className="flex space-x-3 p-3  border-b border-gray-700"
                  >
                    <img
                      alt=""
                      // width={44}
                      // height={44}
                      className="w-11 h-11 rounded-full object-cover"
                      src={comment?.photoUrl}
                    />
                    <div>
                      <div className="mb-1 flex space-x-2 items-center text-gray-500">
                        <h1 className="text-white font-bold">
                          {comment?.name}
                        </h1>
                        <span>@{comment?.username}</span>

                        <Moment fromNow>{comment?.timestamp}</Moment>
                      </div>
                      <span>{comment?.comment}</span>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
        <Trending />
      </div>
      {!user.username && <BottomBanner />}
    </div>
  );
};

export default CommentsPage;
