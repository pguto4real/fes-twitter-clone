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
} from "@heroicons/react/outline";
import Image from "next/image";

const SideBar = () => {
  return (
    <div className=" xl:ml-24 sm:ml-5 hidden sm:flex flex-col fixed justify-between h-full">
      {/* <Link to='/' className='flex justify-center md:justify-start'>
					<XSvg className='px-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900' />
				</Link> */}
      <div>
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
      <div>User</div>
    </div>
  );
};

export default SideBar;
