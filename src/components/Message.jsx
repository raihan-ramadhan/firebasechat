import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/authContext";
import { ChatContext } from "../context/chatContext";

const Message = ({ message }) => {
  const { currUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef(undefined);

  useEffect(() => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, []);

  const timestamp = new Date(
    message.date.seconds * 1000 + message.date.nanoseconds / 1000000
  );
  const options = { hour: "numeric", minute: "numeric", hour12: true };
  const date = timestamp.toLocaleTimeString([], options);

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderId === currUser.uid
              ? currUser.photoURL
              : data.user.photoURL
          }
          alt="message user avatar"
        />
      </div>

      <div className="messageContent">
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt="message image" />}
        <span>{date}</span>
      </div>
    </div>
  );
};

export default Message;
