import React, { useContext, useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const Search = () => {
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      handleSearch();
    }, 250); // Set a delay before initiating the search to avoid too many API calls

    return () => clearTimeout(timer);
  }, [username]);

  const handleSearch = async () => {
    if (username.trim() === "") {
      setUsers([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "users"),
      where("displayName", ">=", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      const usersData = querySnapshot.docs.map((doc) => doc.data());
      setUsers(usersData);
      setErr(false);
    } catch (err) {
      setUsers([]);
      setErr(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.code === "Enter") {
      handleSearch();
    }
  };

  const handleSelect = async () => {
} const combinedId =
   currentUser.uid > users.uid
     ? currentUser.uid +users.uid
     : users.uid + currentUser.uid;
   try {
    
   } catch (error) {
    
    try {
      const res = await doc(db, "chats", combinedId).get();

      if (!res.exists()) {
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: selectedUser.uid,
            displayName: selectedUser.displayName,
            photoURL: selectedUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", selectedUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {}

    setUsers(null);
    setUsername("");
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a user"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {loading && <span>Loading...</span>}
      {err && !loading && <span>User not found!</span>}
      {users.length > 0 &&
        !loading &&
        users.map((user) => (
          <div
            key={user.uid}
            className="userChat"
            onClick={() => handleSelect(user)}
          >
            <img src={user.photoURL} alt="" />
            <div className="userChatInfo">
              <span>{user.displayName}</span>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Search;
