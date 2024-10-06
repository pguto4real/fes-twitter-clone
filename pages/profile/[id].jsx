import BottomBanner from "@/components/BottomBanner";
import FollowButton from "@/components/FollowButton";
import CommentModal from "@/components/modals/CommentModal";
import EditProfileModal from "@/components/modals/EditProfileModal";
import PostFeed from "@/components/PostFeed";
import Posts from "@/components/Posts";
import ProfileHeaderSkeleton from "@/components/ProfileHeaderSkeleton";
import SideBar from "@/components/SideBar";
import Trending from "@/components/Trending";
import { db, storage } from "@/firebase";
import { useGetAllPostsQuery, useGetPostsByUidQuery } from "@/redux/postsApi";
import { setUserProfile } from "@/redux/userProfileSlice";
import { useGetUserByIdQuery } from "@/redux/usersApi";

import {
  ArrowLeftIcon,
  ChartBarIcon,
  LinkIcon,
} from "@heroicons/react/outline";
import { PencilIcon } from "@heroicons/react/solid";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import Moment from "react-moment";
import { useSelector } from "react-redux";

const profile = () => {
  const currentUser = useSelector((state) => state.user);
  const router = useRouter();
  const id = router.query.id;
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);

  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);

  const { data: posts, error, isLoading } = useGetPostsByUidQuery(id);
  const {
    data: users,
    error: userError,
    isLoading:isUsersLoading,
  } = useGetUserByIdQuery(id);

  const [_, setForceUpdate] = useState(false); // State to force rerender

  useEffect(() => {
    // Force a rerender when the user data changes
    if (users) {
      setForceUpdate((prev) => !prev); // Toggle the force update state
    }
  }, [users]);
  console.log(users)
  const [feedType, setFeedType] = useState("posts");
console.log(isUsersLoading)
console.log(isLoading)
  const isMyProfile = currentUser.uid === users?.uid;
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
          {!isUsersLoading && users && (
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
                <h1>{users.name}</h1>
              </div>
              <div className="relative group/cover">
                <img
                  src={
                    coverImg || currentUser?.coverImage || "/assets/cover.png"
                  }
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
                        users?.photoURL ||
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
                  <FollowButton
                    currentUserId={currentUser.uid}
                    targetUserId={users.uid}
                    className={"btn btn-outline rounded-full btn-sm"}
                  />
                )}
                {(coverImg || profileImg) && (
                  <button
                    className="btn btn-primary rounded-full btn-sm text-white px-4 ml-2"
                    onClick={async () => {
                      await uploadImage();
                      setCoverImg(null);
                      setProfileImg(null);
                    }}
                  >
                    {isUploading ? "Updating..." : "Update"}
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-4 mt-14 px-4">
                <div className="flex flex-col">
                  <span className="font-bold text-lg">{users?.name}</span>
                  <span className="text-sm text-slate-500">
                    @{users?.username}
                  </span>
                  <span className="text-sm my-1">{users?.bio}</span>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {users?.link && (
                    <div className="flex gap-1 items-center ">
                      <>
                        <LinkIcon className="w-3 h-3 text-slate-500" />
                        <a
                          href="https://youtube.com/@asaprogrammer_"
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-blue-500 hover:underline"
                        >
                          {users?.link}
                        </a>
                      </>
                    </div>
                  )}
                  <div className="flex gap-2 items-center">
                    {/* <IoCalendarOutline className="w-4 h-4 text-slate-500" /> */}
                    <span className="text-sm text-slate-500">
                      {/* {formatMemberSinceDate(currentUser?.createdAt)} */}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex gap-1 items-center">
                    <span className="font-bold text-xs">
                      {users?.following?.length}
                    </span>
                    <span className="text-slate-500 text-xs">Following</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <span className="font-bold text-xs">
                      {users?.followers?.length}
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
            </>
          )}
          <Posts feedType={feedType} username={users?.username} userId={id} />
        </div>
        <Trending />
      </div>
      {!currentUser.username && <BottomBanner />}
      <CommentModal />
    </div>
  );
};

export default profile;
