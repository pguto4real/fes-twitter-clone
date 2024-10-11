import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";

import SideBar from "@/components/SideBar";
import PostFeed from "@/components/PostFeed";
import Trending from "@/components/Trending";
import BottomBanner from "@/components/BottomBanner";
import { useSelector } from "react-redux";
import CommentModal from "@/components/modals/CommentModal";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
 
  const user = useSelector(state=>state.user)
console.log(user)
  return (
    <div>
      <div
        className="bg-black min-h-screen 
      text-[#E7E9EA] max-w-[1400px] mx-auto flex
      "
      >
        <SideBar />
        <PostFeed currentUserId = {user.uid}/>
        <Trending />
      </div>
      {
        !user.username &&  <BottomBanner />
      }
     <CommentModal/>
    </div>
  );
}
