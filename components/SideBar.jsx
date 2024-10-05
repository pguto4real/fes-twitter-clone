import React from "react";
import SideBarLink from "./SideBarLink";
import {
  HomeIcon,
  HashtagIcon,
  InboxIcon,
  BookmarkIcon,
  ClipboardListIcon,
  BellIcon,
  UserIcon,
  DotsCircleHorizontalIcon,
  BadgeCheckIcon,
  DotsHorizontalIcon,
} from "@heroicons/react/outline";
import Image from "next/image";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useDispatch, useSelector } from "react-redux";
import { signOutUser } from "@/redux/userSlice";
import { closeLogInModal, closeSignUpModal } from "@/redux/modalSlice";

const SideBar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  console.log(user)

  async function handleSignOut() {
    await signOut(auth);
    dispatch(signOutUser());
    dispatch(closeSignUpModal());
    dispatch(closeLogInModal());
  }
  return (
    <div className=" xl:ml-24  hidden sm:flex flex-col fixed justify-between h-full">
      {/* <Link to='/' className='flex justify-center md:justify-start'>
					<XSvg className='px-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900' />
				</Link> */}
      <div className="mx-auto">
        <nav className="xl:space-y-1.5">
          <div className="xl:justify-start flex justify-center items-center py-3 xl:p-3">
            <Image
              src={"/assets/twitter-logo.svg"}
              width={34}
              height={34}
              className="invert"
            />
          </div>
          <SideBarLink Icon={HomeIcon} text={"Home"} />
          <SideBarLink Icon={HashtagIcon} text={"Explore"} />
          <SideBarLink Icon={BellIcon} text={"Notifications"} />
          <SideBarLink Icon={InboxIcon} text={"Messages"} />
          <SideBarLink Icon={BookmarkIcon} text={"Bookmarks"} />
          <SideBarLink Icon={UserIcon} text={"Profile"} />
          <SideBarLink Icon={DotsCircleHorizontalIcon} text={"More"} />
          <button className="text-xl font-bold mt-2 hidden xl:inline bg-[#1d9bf0] rounded-full h-[52px] w-[200px]">
            Tweet
          </button>
        </nav>
      </div>
      {user.username && (
        <div className="mb-2 " onClick={handleSignOut}>
          <div className="p-3 flex justify-between items-center rounded-full hover:bg-white hover:bg-opacity-10 cursor-pointer">
            <div className="flex space-x-3 items-center ">
              <img
                className="w-10 h-10 rounded-full object-cover"
                src={`${user.photoUrl || "/assets/avatar-placeholder.png/"}`}
              />
              <div className="xl:flex flex-col hidden ">
                <h1 className="font-bold overflow-hidden text-ellipsis max-w-24">
                  {user?.name?.split(" ")[0]}
                </h1>

                <h1 className="text-gray-500 text-xs">@{user.username}</h1>
              </div>
            </div>
            <div className="hidden xl:flex">
              <DotsHorizontalIcon className="h-5" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideBar;
