import { useContext, useEffect, useState, useRef } from "react";
import Message from "./Message";
import { ChatContext } from "../context/chatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const Messages = () => {
  const { data } = useContext(ChatContext);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unSub = () => {
      if (data.chatId) {
        onSnapshot(doc(db, "chats", data.chatId), (doc) => {
          doc.exists() && setMessages(doc.data().messages);
        });
      }
    };
    unSub();
    return () => {
      unSub();
    };
  }, [data.chatId]);

  return (
    <div className="messages">
      {messages.length > 0 &&
        messages.map((m) => <Message key={m.id} message={m} />)}
    </div>
  );
};

export default Messages;
