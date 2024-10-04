import { closeSignUpModal } from "@/redux/modalSlice";
import Modal from "@mui/material/Modal";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export default function SignUpModal() {
  const isOpen = useSelector((state) => state.modals.signUpModalOpen);
  const dispatch = useDispatch();

  return (
    <>
      {/* <Button >Open modal</Button> */}
      <Modal
        open={isOpen}
        onClose={() => dispatch(closeSignUpModal())}
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
            <button
              className="bg-white text-black w-full font-bold rounded-md
            text-lg p-2 "
            >
              Sign In as Guest
            </button>
            <h1 className="text-center  font-bold text-lg mt-4">or</h1>
            <h1 className=" font-bold text-4xl mt-4">Create your account</h1>
            <div className="flex flex-col space-y-7">
              <input
                type="text"
                placeholder="Full Name"
                className="placeholder:text-gray-400 bg-transparent rounded-md 
                border-gray-700 border  h-[40px] p-6 mt-8"
              />
              <input
                type="email"
                placeholder="Email"
                className="placeholder:text-gray-400 bg-transparent rounded-md 
                border-gray-700 border  h-[40px]  p-6"
              />
              <input
                type="password"
                placeholder="Password"
                className="placeholder:text-gray-400 bg-transparent rounded-md 
                border-gray-700 border  h-[40px]  p-6"
              />
            </div>
            <button
              className="bg-white text-black w-full font-bold
            text-lg p-2 mt-8 mb-8 rounded-md" >
              Create Account
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
