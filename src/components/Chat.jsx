import { useContext } from "react";
import Add from "../img/add.png";
import Cam from "../img/cam.png";
import More from "../img/more.png";
import Input from "./Input";
import Messages from "./Messages";
import { ChatContext } from "../context/chatContext";

const Chat = () => {
  const { data } = useContext(ChatContext);

  return (
    <div className="chat">
      <div className="chatInfo">
        <span>{data.user?.displayName}</span>
        <div className="chatIcons">
          <img src={Cam} alt="cam icon" />
          <img src={Add} alt="add icon" />
          <img src={More} alt="more icon" />
        </div>
      </div>

      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
