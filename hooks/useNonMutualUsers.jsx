import { useState, useEffect } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/firebase"; // Adjust the path as necessary
import { doc, getDoc } from "firebase/firestore";

const useNonMutualUsers = (currentUserId) => {
  const [nonMutualUsers, setNonMutualUsers] = useState([]);
  const [isLoadings, setIsLoadings] = useState(true);

  useEffect(() => {
    if (!currentUserId) return;

    const fetchNonMutualUsers = async () => {
      try {
        // Step 1: Get the following and followers lists of the current user
        const currentUserRef = doc(db, "users", currentUserId);
        const currentUserDoc = await getDoc(currentUserRef);
        const { following = [], followers = [] } = currentUserDoc.exists()
          ? currentUserDoc.data()
          : {};

        // Step 2: Query all users except the current user
        const usersRef = collection(db, "users");
        const usersQuery = query(usersRef, where("uid", "!=", currentUserId));

        // Step 3: Use onSnapshot to listen for real-time updates
        const unsubscribe = onSnapshot(usersQuery, (querySnapshot) => {
          const filteredUsers = [];
          querySnapshot.forEach((doc) => {
            const userData = { id: doc.id, ...doc.data() };
            const userId = userData.uid;

            // Check if the user is not mutually following
            const isNotMutuallyFollowing = !following.includes(userId) && !followers.includes(userId);

            if (isNotMutuallyFollowing) {
              filteredUsers.push(userData);
            }
          });

          setNonMutualUsers(filteredUsers);
          setIsLoadings(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error fetching users:", error);
        setIsLoadings(false);
      }
    };

    fetchNonMutualUsers();
  }, [currentUserId]);

  return { nonMutualUsers, isLoadings };
};

export default useNonMutualUsers;
