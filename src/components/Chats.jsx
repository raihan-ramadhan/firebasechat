import { onSnapshot, doc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { AuthContext } from "../context/authContext";
import { ChatContext } from "../context/chatContext";

const Chats = () => {
  const [chats, setChats] = useState([]);
  const { currUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currUser.uid), (doc) => {
        setChats(doc.data());
        setLoading(false);
      });
      return () => unsub();
    };

    if (currUser.uid) getChats();
  }, [currUser.uid]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  return (
    <div className="chats">
      {loading && <span className="loadingText">loading</span>}
      {!loading && Object.entries(chats).length == 0 && (
        <span className="notfound">you not have chats</span>
      )}
      {!loading &&
        Object.entries(chats).length > 0 &&
        Object.entries(chats)
          .sort((a, b) => b[1].date - a[1].date)
          .map((chat) => {
            return (
              <div
                key={chat[0]}
                className="userChat"
                onClick={() => {
                  handleSelect(chat[1].userInfo);
                }}
              >
                <img
                  src={chat[1].userInfo.photoURL}
                  alt={`${chat[1].userInfo.displayName} avatar`}
                />
                <div className="userChatInfo">
                  <span>{chat[1].userInfo.displayName}</span>
                  <p>{chat[1].lastMessage?.text}</p>
                </div>
              </div>
            );
          })}
    </div>
  );
};

export default Chats;
