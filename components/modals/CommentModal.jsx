import { closeCommentModal } from "@/redux/modalSlice";
import Modal from "@mui/material/Modal";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TweetInputIcons from "../TweetInputIcons";
import {
  CalendarIcon,
  ChartBarIcon,
  EmojiHappyIcon,
  LocationMarkerIcon,
  PhotographIcon,
  XIcon,
} from "@heroicons/react/outline";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/router";
import Image from "next/image";
const CommentModal = () => {
  const isOpen = useSelector((state) => state.modals.commentModalOpen);
  const user = useSelector((state) => state.user);

  const comentTweetDetails = useSelector(
    (state) => state.modals.commentTweetDetails
  );

  const { id, name, photoUrl, tweet, username } = comentTweetDetails;

  const dispatch = useDispatch();

  const [text, setText] = useState("");

  const router = useRouter();

  async function sendComment() {
    const docRef = doc(db, "posts", id);
    const commentDetails = {
      username: user.username,
      name: user.name,
      userId: user.uid,
      photoUrl: user.photoUrl,
      comment: text,
    };
    await updateDoc(docRef, {
      comment: arrayUnion(commentDetails),
    });
    dispatch(closeCommentModal());
    // router.push("/" + id);
    setText("");
  }

  return (
    <Modal
      open={isOpen}
      onClose={() => dispatch(closeCommentModal())}
      className="flex justify-center items-center"
    >
      <div
        className="
   w-full h-full
    sm:w-[600px] sm:h-[386px]
     bg-black text-white border-gray-700 border sm:rounded-lg
  sm:p-10 p-4 relative"
      >
        <div
          className="absolute w-[2px] h-[77px] bg-gray-500 
        left-[40px] top-[92px]
        sm:left-[64px] sm:top-[116px]
        "
        ></div>
        <div
          className="absolute  top-4 cursor-pointer"
          onClick={() => {
            setText("");
            dispatch(closeCommentModal());
          }}
        >
          <XIcon className="w-6" />
        </div>
        <div className="mt-8">
          <div className="flex space-x-3">
            <Image
             width={44}
             height={44}
              className="w-11 h-11 rounded-full object-cover"
              src={`${photoUrl || "/assets/avatar-placeholder.png/"}`}
              alt=""
            />
            {/* className="w-11 h-11 rounded-full object-cover"
              src={`${photoUrl || "/assets/avatar-placeholder.png/"}`}
              alt=""
            /> */}
            <div>
              <div className="flex space-x-1">
                <h1 className="font-bold">{name}</h1>
                <h1 className="text-gray-500">@{username}</h1>
              </div>
              <p className="mt-2">{tweet}</p>

              <h1 className="text-gray-500 text-[15px] mt-2">
                Replying to <span className="text-[#1b9bf0] ">@{username}</span>
              </h1>
            </div>
          </div>
        </div>
        <div className="mt-11">
          <div className="flex space-x-3">
            <Image
             width={44}
             height={44}
              className="w-11 h-11 rounded-full object-cover"
       alt=""
            />
            <div className="w-full">
              <textarea
                onChange={(e) => setText(e.target.value)}
                value={text}
                className="w-full bg-transparent resize-none text-lg outline-none"
                placeholder="Tweet your reply"
              />
              <div className="flex justify-between border-t border-gray-700 pt-4">
                <div className="flex space-x-0">
                  <TweetInputIcons Icon={PhotographIcon} />

                  <TweetInputIcons Icon={ChartBarIcon} />
                  <TweetInputIcons Icon={EmojiHappyIcon} />
                  <TweetInputIcons Icon={CalendarIcon} />
                  <TweetInputIcons Icon={LocationMarkerIcon} />
                </div>
                <div>
                  <button
                    disabled={!text}
                    onClick={sendComment}
                    className={` bg-[#1d9bf0] rounded-full  px-4 py-1.5 
                disabled:opacity-50 disabled:cursor-not-allowed
                `}
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CommentModal;
