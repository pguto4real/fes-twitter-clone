import React from "react";

import { openSignUpModal } from "@/redux/modalSlice";
import { useDispatch } from "react-redux";
import SignUpModal from "./modals/SignUpModal";


const BottomBanner = () => {
    const dispatch = useDispatch()
  return (
    <div className="flex xl:space-x-[200px] justify-center items-center fixed w-full h-[80px] bg-[#1d9bf0] bottom-0">
      <div className="hidden xl:inline text-white">
        <h1 className="text-2xl font-bold">Don't miss what's happening</h1>
        <span className="text-[18px] font-normal">
          People on Twitter are the first to know.
        </span>
      </div>
      <div className="space-x-3">
        <button className="bg-transparent rounded-full border-white border h-10 w-40 
        text-white  hover:bg-[#cbd2d7]">
          Log In
        </button>
        <button
        onClick={()=>dispatch(openSignUpModal())} 
        className="bg-white rounded-full h-10 w-40 text-black hover:bg-[#cbd2d7]" >
          Sign Up
        </button>
        <SignUpModal/>
      </div>
    </div>
  );
};

export default BottomBanner;
