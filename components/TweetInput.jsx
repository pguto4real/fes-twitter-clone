import {
  CalendarIcon,
  ChartBarIcon,
  EmojiHappyIcon,
  LocationMarkerIcon,
  PhotographIcon,
  XIcon,
} from "@heroicons/react/outline";
import React, { useRef, useState } from "react";
import TweetInputIcons from "./TweetInputIcons";
import { useDispatch, useSelector } from "react-redux";
import { serverTimestamp } from "firebase/firestore";
import { useCreateTweetMutation } from "@/redux/postsApi";
import Image from "next/image";
import { openLogInModal } from "@/redux/modalSlice";

const TweetInput = () => {
  const user = useSelector((state) => state.user);

  const filePickerRef = useRef(null);

  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [createTweet, { isLoading }] = useCreateTweetMutation();
  const dispatch = useDispatch();

  const handleSendTweet = async () => {
    if (!user.username) {
      dispatch(openLogInModal());
      return;
    }
    const userData = {
      username: user.username,
      name: user.name,
      email: user.email,
      uid: user.uid,
      photoUrl: user.photoUrl,
      timestamp: serverTimestamp(),
      tweet: text,
      likes: [],
    };
    await createTweet({ userData, text, image });
    setText("");
    setImage(null);
  };

  function addImageToTweet(e) {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.addEventListener("load", (e) => {
      setImage(e.target.result);
    });
  }

  return (
    <div className="flex space-x-3 p-3 border-b border-gray-700">
      <Image
      alt=""
        width={44}
        height={44}
        className="w-11 h-11 rounded-full object-cover"
        src={`${user.photoUrl || "/assets/avatar-placeholder.png/"}`}
      />
      {/* <img
        className="w-11 h-11 rounded-full object-cover"
        src={`${user.photoUrl || "/assets/avatar-placeholder.png/"}`}
        alt=""
      /> */}

      {!isLoading ? (
        <div className="w-full">
          <textarea
            name=""
            id=""
            className="bg-transparent resize-none outline-none w-full minh-[50px] text-lg"
            placeholder="What's on you mind?"
            onChange={(e) => setText(e.target.value)}
            value={text}
          />
          {image && (
            <div className="relative mb-4">
              <div
                className="absolute top-1 left-1 bg-[#272c26] rounded-full w-8 h-8 flex justify-center items-center cursor-pointer hover:bg-white hover:opacity-10 "
                onClick={() => setImage(null)}
              >
                <XIcon className="h-5" />
              </div>
              <Image
                src={image}
                alt=""
                className="rounded-2xl max-h-80 object-contain"
                width={320} // Adjust width according to your design
                height={320} // Adjust height according to your design
              />
            </div>
          )}

          {/*  */}
          <div className="flex justify-between border-t border-gray-700 pt-4">
            <div className="flex space-x-0">
              <div onClick={() => filePickerRef.current.click()}>
                <TweetInputIcons Icon={PhotographIcon} />
                <input
                  type="file"
                  className="hidden"
                  ref={filePickerRef}
                  onChange={addImageToTweet}
                />
              </div>

              <TweetInputIcons Icon={ChartBarIcon} />
              <TweetInputIcons Icon={EmojiHappyIcon} />
              <TweetInputIcons Icon={CalendarIcon} />
              <TweetInputIcons Icon={LocationMarkerIcon} />
            </div>
            <div>
              <button
                disabled={!text && !image}
                onClick={handleSendTweet}
                className={` bg-[#1d9bf0] rounded-full  px-4 py-1.5 
                disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                Tweet
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full flex justify-center items-center">
          <span className="loading loading-infinity w-[10.5rem] "></span>
        </div>
      )}
    </div>
  );
};

export default TweetInput;
