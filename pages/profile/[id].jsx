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
import { setUserProfile } from "@/redux/userProfileSlice";
import {
  useGetUserByIdQuery,
  useUploadImageDataMutation,
  useUploadImageMutation,
} from "@/redux/usersApi";

import {
  ArrowLeftIcon,
  ChartBarIcon,
  LinkIcon,
} from "@heroicons/react/outline";
import { PencilIcon } from "@heroicons/react/solid";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
const Profile = () => {
  const currentUser = useSelector((state) => state.user);

  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [feedType, setFeedType] = useState("posts");

  const router = useRouter();
  const userId = router.query.id;

  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);

  const {
    data: users,
    error: userError,
    isLoading: userLoading,
  } = useGetUserByIdQuery(userId);

  const isMyProfile = currentUser.uid === users?.uid;

  const handleImgChange = (e, state) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.addEventListener("load", (e) => {
      if (state === "coverImg") {
        setCoverImg(e.target.result);
      } else {
        setProfileImg(e.target.result);
      }
    });
  };

  const [uploadImage, { isLoading }] = useUploadImageDataMutation();
  const handleUpload = async () => {
    try {
      if (coverImg) {
        await uploadImage({
          userId: currentUser.uid,
          imageType: "cover",
          imageData: coverImg,
        });
      } else if (profileImg) {
        await uploadImage({
          userId: currentUser.uid,
          imageType: "profile",
          imageData: profileImg,
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div>
      <div
        className="bg-black min-h-screen 
  text-[#E7E9EA] max-w-[1400px] mx-auto flex
  "
      >
        <SideBar />

        <div className="sm:ml-20 xl:ml-[350px] flex-grow border-x-gray-700 border-x max-w-2xl">
          {userLoading && <ProfileHeaderSkeleton />}
          {!userLoading && users && (
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
                <Image
                  src={coverImg || users?.coverImage || "/assets/cover.png"}
                  alt="Cover Image"
                  width={1024} // Adjust width as needed
                  height={208} // Adjust height to maintain aspect ratio (52 / 208 = 1 / 4)
                  className="h-52 w-full object-cover"
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
                    <Image
                      src={
                        profileImg ||
                        users?.photoURL ||
                        "/avatar-placeholder.png"
                      }
                      alt="Profile Image" // Add an alt attribute for accessibility
                      layout="fill" // Use layout fill to cover the parent div
                      objectFit="cover" // Cover the parent div with the image
                      className="rounded-full" // Ensure the image is rounded
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
                    className={
                      "bg-white text-black text-sm w-20 h-8 rounded-3xl"
                    }
                  />
                  //   <button
                  //     className="btn btn-outline rounded-full btn-sm"
                  //     onClick={() => follow(currentUser?._id)}
                  //   >
                  //     {isPendingFollow && <LoadingSpinner size="sm" />}
                  //     {!isPending && amIFollowing && "UnFollow"}
                  // {!isPending && !amIFollowing && "Follow"}
                  //   </button>
                )}
                {(coverImg || profileImg) && (
                  <button
                    className="btn btn-primary rounded-full btn-sm text-white px-4 ml-2"
                    onClick={async () => {
                      handleUpload();
                      setCoverImg(null);
                      setProfileImg(null);
                    }}
                  >
                    {isLoading ? "Updating..." : "Update"}
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
          <Posts
            feedType={feedType}
            username={users?.username}
            userId={userId}
          />
        </div>
        <Trending />
      </div>
      {!currentUser.username && <BottomBanner />}
      <CommentModal />
    </div>
  );
};

export default Profile;
