import { closeLogInModal, closeSignUpModal } from "@/redux/modalSlice";
import Modal from "@mui/material/Modal";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export default function LogInModal() {
  const isOpen = useSelector((state) => state.modals.logInModalOpen);
  const dispatch = useDispatch();

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
            
            <h1 className=" font-bold text-4xl mt-4">Sign in to your account</h1>
            <div className="flex flex-col space-y-7">
              
              <input
                type="email"
                placeholder="Email"
                className="placeholder:text-gray-400 bg-transparent rounded-md 
                border-gray-700 border  h-[40px] p-6 mt-8"
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
            text-lg p-2 mt-8 rounded-md" >
              Sign In
            </button>
            <h1 className="text-center  font-bold text-lg mt-8">or</h1>
            <button
              className="bg-white text-black w-full font-bold rounded-md
            text-lg p-2 mb-8 mt-8"
            >
              Sign In as Guest
            </button>
         
          </div>
        </div>
      </Modal>
    </>
  );
}
