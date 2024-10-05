import { db } from "@/firebase";
import {
  closeEditProfileModal,
  openEditProfileModal,
} from "@/redux/modalSlice";
import { updateUser } from "@/redux/userSlice";
import Modal from "@mui/material/Modal";
import { doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const EditProfileModal = () => {
  const isOpen = useSelector((state) => state.modals.editProfileModalOpen);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  console.log(user);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    link: "",
    newPassword: "",
    currentPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        link: user.link,
        newPassword: "",
        currentPassword: "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateUserData = async (userId, userData) => {
    console.log(userData);
    try {
      const userRef = doc(db, "users", userId); // Reference to the user document in Firestore

      // Update user data in Firestore
      await updateDoc(userRef, userData);

      // Dispatch the updateUser action to update the Redux store
      dispatch(updateUser(userData));
      dispatch(closeEditProfileModal());
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };
  return (
    <>
      <button
        className="btn btn-outline rounded-full btn-sm"
        onClick={() => dispatch(openEditProfileModal())}
      >
        Edit profile
      </button>
      <Modal
        open={isOpen}
        onClose={() => dispatch(closeEditProfileModal())}
        className="flex justify-center items-center"
      >
        <div
          className=" w-full h-full
    sm:w-[600px] sm:h-[386px]
     bg-black text-white border-gray-700 border sm:rounded-lg
  sm:p-10 p-4 "
        >
          <h3 className="font-bold text-lg my-3">Update Profile</h3>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              updateUserData(user.uid, formData);
            }}
          >
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="Full Name"
                className="flex-1 input border border-gray-700 rounded p-2 input-md  bg-transparent"
                value={formData.name}
                name="name"
                onChange={handleInputChange}
              />
              <input
                type="text"
                disabled
                placeholder="Username"
                className="flex-1 input disabled:text-[#d6d6d666] border disabled:border-gray-700 rounded p-2 input-md  disabled:bg-black"
                value={user.username}
                name="username"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 input border border-gray-700 rounded p-2 input-md  bg-transparent"
                value={formData.email}
                name="email"
                onChange={handleInputChange}
              />
              <textarea
                placeholder="Bio"
                className="flex-1 input border border-gray-700 rounded p-2 input-md  bg-transparent"
                value={formData.bio}
                name="bio"
                onChange={handleInputChange}
              />
            </div>
            {/* <div className="flex flex-wrap gap-2">
              <input
                type="password"
                placeholder="Current Password"
                className="flex-1 input border border-gray-700 rounded p-2 input-md  bg-transparent"
                value={formData.currentPassword}
                name="currentPassword"
                onChange={handleInputChange}
              />
              <input
                type="password"
                placeholder="New Password"
                className="flex-1 input border border-gray-700 rounded p-2 input-md  bg-transparent"
                value={formData.newPassword}
                name="newPassword"
                onChange={handleInputChange}
              />
            </div> */}
            <input
              type="text"
              placeholder="Link"
              className="flex-1 input border border-gray-700 rounded p-2 input-md  bg-transparent"
              value={formData.link}
              name="link"
              onChange={handleInputChange}
            />
            <button className="btn btn-primary rounded-full btn-sm text-white">
              {isUpdatingProfile ? "" : "Update"}
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default EditProfileModal;
