import {
  query,
  collection,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { useState, useContext } from "react";
import { db } from "../firebase";
import { AuthContext } from "../context/authContext";
import { ChatContext } from "../context/chatContext";

const Search = () => {
  const [username, setUsername] = useState("");
  const [notfound, setNotfound] = useState(false);
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState(false);

  const { currUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setNotfound(true);
      } else {
        const usersSnapshot = [];
        querySnapshot.forEach((doc) => usersSnapshot.push(doc.data()));
        setUsers(usersSnapshot);
      }
    } catch (error) {
      setErr(true);
      console.error(error);
    }
  };

  const handleKey = (e) => {
    setNotfound(false);
    setErr(false);
    setUsers([]);
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async (user) => {
    dispatch({ type: "CHANGE_USER", payload: user });

    const combinedId =
      currUser.uid > user.uid
        ? currUser.uid + user.uid
        : user.uid + currUser.uid;
    try {
      // check whether the group(chats in firestore) exist, if not create one
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        // create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
        // create user chats
        await updateDoc(doc(db, "userChats", currUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currUser.uid,
            displayName: currUser.displayName,
            photoURL: currUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error(error);
    }
    setErr(false);
    setUsers([]);
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a user"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {err && <span>Something wrong</span>}
      {notfound && <span className="notfound">user not found!</span>}
      {users.length > 0 &&
        users.map((user, index) => (
          <div
            key={`search_${index}`}
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
