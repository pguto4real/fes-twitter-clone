import { auth } from "@/firebase";
import { closeLogInModal, closeSignUpModal } from "@/redux/modalSlice";
import Modal from "@mui/material/Modal";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function LogInModal() {
  const isOpen = useSelector((state) => state.modals.logInModalOpen);
  const dispatch = useDispatch();
  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");
  async function handleSignIn() {
    const userCredentials = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
  }
  async function handleGuestSignIn() {
    const userCredentials = await signInWithEmailAndPassword(
      auth,
      "guest18342681@gmail.com",
      "12345678"
    );
  }
  return (
    <>
      {/* <Button >Open modal</Button> */}
      <Modal
        open={isOpen}
        onClose={() => dispatch(closeLogInModal())}
        className="flex justify-center items-center"
      >
        <div
          className="
        w-[90%] h-fit
        md:w-[560px] md:h-[600px]
         bg-black text-white border-gray-700 border rounded-lg
         flex justify-center"
        >
          <div className="w-[90%] mt-8">
            <h1 className=" font-bold text-4xl mt-4">
              Sign in to your account
            </h1>
            <div className="flex flex-col space-y-7">
              <input
                type="email"
                placeholder="Email"
                className="placeholder:text-gray-400 bg-transparent rounded-md 
                border-gray-700 border  h-[40px] p-6 mt-8"
                onChange={(e) => SetEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="placeholder:text-gray-400 bg-transparent rounded-md 
                border-gray-700 border  h-[40px]  p-6"
                onChange={(e) => SetPassword(e.target.value)}
              />
            </div>
            <button
              className="bg-white text-black w-full font-bold
            text-lg p-2 mt-8 rounded-md"
            onClick={handleSignIn}
            >
              Sign In
            </button>
            <h1 className="text-center  font-bold text-lg mt-8">or</h1>
            <button
              className="bg-white text-black w-full font-bold rounded-md
            text-lg p-2 mb-8 mt-8"
            onClick={handleGuestSignIn}
            >
              Sign In as Guest
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
