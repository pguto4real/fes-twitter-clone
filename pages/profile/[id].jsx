import BottomBanner from "@/components/BottomBanner";
import EditProfileModal from "@/components/modals/EditProfileModal";
import PostFeed from "@/components/PostFeed";
import SideBar from "@/components/SideBar";
import Trending from "@/components/Trending";
import { db } from "@/firebase";
import { setUserProfile } from "@/redux/userProfileSlice";

import {
  ArrowLeftIcon,
  ChartBarIcon,
  LinkIcon,
} from "@heroicons/react/outline";
import { PencilIcon } from "@heroicons/react/solid";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import Moment from "react-moment";
import { useSelector } from "react-redux";
// export const getServerSideProps = async (context) => {
//   const id = context.query.id; // Extract user id from the URL

//   let userData = null;
//   let formattedData = null;

//   try {
//     const userRef = doc(db, "users", id); // Reference to the user document in Firestore
//     const docSnap = await getDoc(userRef);

//     if (docSnap.exists()) {
//       userData = docSnap.data();
//       console.log(userData)
//       formattedData = {
//         uid: userData.uid,
//         email: userData.email,
//         name: userData.name,
//         link: userData.link,
//         username: userData.username,
//         coverImage: userData.coverImage,
//         bio: userData.bio,
//         followers: userData.followers,
//         following: userData.following,
//         photoUrl: userData.photoURL,
//         timestamp: JSON.stringify(userData.timestamp.toDate()),
//       };
//     }
//   } catch (error) {
//     console.error("Error fetching user data:", error);
//   }

//   // If user not found, return 404
//   if (!userData) {
//     return {
//       notFound: true,
//     };
//   }

//   // Return user data as props
//   return {
//     props: {
//       tweetData: formattedData,
//     },
//   };
// };
const profile = () => {
  const user = useSelector((state) => state.user);
  console.log(user);

  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [tweetData, setTweetData] = useState([]);
  //   const [feedType, setFeedType] = useState("posts");

  const [isPendingFollow, setIsPendingFollow] = useState(null);
  // 	// const [profileImg, setProfileImg] = useState(null);
  // console.log(user)

  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);

  //   console.log(formattedData);
  //   console.log(user);

  const isMyProfile = user.uid === tweetData?.uid;

  const router = useRouter();
  const id = router.query.id;
  console.log(id);
  useEffect(() => {
    // Get user ID from the tweetData
    if (!id) return;
    // Subscribe to Firestore document updates
    const unsubscribe = onSnapshot(doc(db, "users", id), (doc) => {
      if (doc.exists()) {
        setTweetData({ ...tweetData, ...doc.data() }); // Merge new data with existing data
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [id]);
  console.log(tweetData);
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
            <h1>{tweetData.name}</h1>
          </div>
          <div className="relative group/cover">
            <img
              src={coverImg || user?.coverImg || "/assets/cover.png"}
              className="h-52 w-full object-cover"
              alt="cover image"
            />
            {isMyProfile && (
              <div
                className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200"
                onClick={() => coverImgRef.current.click()}
              >
                <PencilIcon className="w-5 h-5 text-white" />
              </div>
            )}

            <input
              type="file"
              hidden
              ref={coverImgRef}
              onChange={(e) => handleImgChange(e, "coverImg")}
            />
            <input
              type="file"
              hidden
              ref={profileImgRef}
              onChange={(e) => handleImgChange(e, "profileImg")}
            />
            {/* USER AVATAR */}
            <div className="avatar absolute -bottom-16 left-4">
              <div className="w-32 rounded-full relative group/avatar">
                <img
                  src={
                    profileImg ||
                    tweetData?.photoURL ||
                    "/avatar-placeholder.png"
                  }
                />
                <div className="absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer">
                  {isMyProfile && (
                    <PencilIcon
                      className="w-4 h-4 text-white"
                      onClick={() => profileImgRef.current.click()}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end px-4 mt-5">
            {isMyProfile && <EditProfileModal />}
            {!isMyProfile && (
              <button
                className="btn btn-outline rounded-full btn-sm"
                onClick={() => follow(user?._id)}
              >
                {isPendingFollow && <LoadingSpinner size="sm" />}
                {/* {!isPending && amIFollowing && "UnFollow"}
                {!isPending && !amIFollowing && "Follow"} */}
              </button>
            )}
            {(coverImg || profileImg) && (
              <button
                className="btn btn-primary rounded-full btn-sm text-white px-4 ml-2"
                onClick={async () => {
                  await updateProfile({ coverImg, profileImg });
                  setCoverImg(null);
                  setProfileImg(null);
                }}
              >
                {isUpdatingProfile ? "Updating..." : "Update"}
              </button>
            )}
          </div>

          <div className="flex flex-col gap-4 mt-14 px-4">
            <div className="flex flex-col">
              <span className="font-bold text-lg">{tweetData?.name}</span>
              <span className="text-sm text-slate-500">
                @{tweetData?.username}
              </span>
              <span className="text-sm my-1">{tweetData?.bio}</span>
            </div>

            <div className="flex gap-2 flex-wrap">
              {tweetData?.link && (
                <div className="flex gap-1 items-center ">
                  <>
                    <LinkIcon className="w-3 h-3 text-slate-500" />
                    <a
                      href="https://youtube.com/@asaprogrammer_"
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-blue-500 hover:underline"
                    >
                      {tweetData?.link}
                    </a>
                  </>
                </div>
              )}
              <div className="flex gap-2 items-center">
                {/* <IoCalendarOutline className="w-4 h-4 text-slate-500" /> */}
                <span className="text-sm text-slate-500">
                  {/* {formatMemberSinceDate(user?.createdAt)} */}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex gap-1 items-center">
                <span className="font-bold text-xs">
                  {tweetData?.following?.length}
                </span>
                <span className="text-slate-500 text-xs">Following</span>
              </div>
              <div className="flex gap-1 items-center">
                <span className="font-bold text-xs">
                  {tweetData?.followers?.length}
                </span>
                <span className="text-slate-500 text-xs">Followers</span>
              </div>
            </div>
          </div>
          <div className="flex w-full border-b border-gray-700 mt-4">
            <div
              className="flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer"
              onClick={() => setFeedType("posts")}
            >
              Posts
              {feedType === "posts" && (
                <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary" />
              )}
            </div>
            <div
              className="flex justify-center flex-1 p-3 text-slate-500 hover:bg-secondary transition duration-300 relative cursor-pointer"
              onClick={() => setFeedType("likes")}
            >
              Likes
              {feedType === "likes" && (
                <div className="absolute bottom-0 w-10  h-1 rounded-full bg-primary" />
              )}
            </div>
          </div>
        </div>
        <Trending />
      </div>
      {!user.username && <BottomBanner />}
    </div>
  );
};

export default profile;
