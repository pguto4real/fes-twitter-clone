import { auth, db } from "@/firebase";
import { closeSignUpModal } from "@/redux/modalSlice";
import { setUser } from "@/redux/userSlice";
import Modal from "@mui/material/Modal";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function SignUpModal() {
  const isOpen = useSelector((state) => state.modals.signUpModalOpen);
  const dispatch = useDispatch();
  const router = useRouter();

  const [email, SetEmail] = useState("");
  const [name, SetName] = useState("");
  const [userName, SetUserName] = useState("");
  const [password, SetPassword] = useState("");

  async function handleSignUp() {
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      'a@a.com',
      '123456789'
    );
    if (userCredentials) {
      const userDocRef = doc(db, "users", userCredentials.user.uid);
      await setDoc(userDocRef, {
        uid: userCredentials.user.uid,
        email: userCredentials.user.email,
        name: 'a a',
        username: 'a',
        coverImage: "",
        profileImage: "",
        bio: "",
        link: "",
        followers: [],
        following: [],
        photoURL: `/assets/avatars/boy1.png/`,
        timestamp: serverTimestamp(),
      });
    }
    await updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: `/assets/avatars/boy1.png/`,
    });
    router.reload();
  }
  async function handleGuestSignIn() {
    const userCredentials = await signInWithEmailAndPassword(
      auth,
      "guest18342681@gmail.com",
      "12345678"
    );
  }
  
  useEffect(() => {

    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) return;
      const fetchUserData = async () => {
        let userData = null;
        try {
          const userRef = doc(db, "users", currentUser.uid); // Reference to the user document in Firestore
          const docSnap = await getDoc(userRef);
  
          if (docSnap.exists()) {
            userData = docSnap.data();
  
            dispatch(
              setUser({
                uid: userData.uid,
                email: userData.email,
                name: userData.name,
                link: userData.link,
                username: userData.username,
                coverImage: userData.coverImage,
                bio: userData.bio,
                followers: userData.followers,
                following: userData.following,
                photoUrl: userData.photoURL,
              })
            );
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUserData();
      //handle redux actions
    });
    return unSubscribe;
  }, []);
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
              onClick={()=>handleGuestSignIn()}
            >
              Sign In as Guest
            </button>
            <h1 className="text-center  font-bold text-lg mt-4">or</h1>
            <h1 className=" font-bold text-4xl mt-4">Create your account</h1>
            <div className="flex flex-col space-y-7">
              <input
                type="text"
                placeholder="Username"
                className="placeholder:text-gray-400 bg-transparent rounded-md 
                border-gray-700 border  h-[40px] p-6 mt-8"
                onChange={(e) => SetUserName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Full Name"
                className="placeholder:text-gray-400 bg-transparent rounded-md 
                border-gray-700 border  h-[40px] p-6 mt-8"
                onChange={(e) => SetName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                className="placeholder:text-gray-400 bg-transparent rounded-md 
                border-gray-700 border  h-[40px]  p-6"
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
            text-lg p-2 mt-8 mb-8 rounded-md"
              onClick={handleSignUp}
            >
              Create Account
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
