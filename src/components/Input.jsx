import { useContext, useState } from "react";
import Attach from "../img/attach.png";
import Img from "../img/img.png";
import { ChatContext } from "../context/chatContext";
import { AuthContext } from "../context/authContext";
import { v4 as uuid } from "uuid";
import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { data } = useContext(ChatContext);
  const { currUser } = useContext(AuthContext);

  const handelSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          console.error(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
    } else if (text.length > 0) {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currUser.uid,
          date: Timestamp.now(),
        }),
      });

      await updateDoc(doc(db, "userChats", currUser.uid), {
        [data.chatId + ".lastMessage"]: { text },
        [data.chatId + ".date"]: serverTimestamp(),
      });

      await updateDoc(doc(db, "userChats", data.user.uid), {
        [data.chatId + ".lastMessage"]: { text },
        [data.chatId + ".date"]: serverTimestamp(),
      });
    }

    setText("");
    setImg(null);
  };

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="send">
        <img src={Attach} alt="attach icon" />
        <input
          type="file"
          style={{ display: "none" }}
          id="fileInput"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="fileInput">
          <img src={Img} alt="img icon" />
        </label>
        <button type="button" onClick={handelSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Input;
