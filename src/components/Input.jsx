import React, { useContext, useState } from "react";
import Img from "../img/img.png";
import Attach from "../img/attach.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  doc,
  serverTimestamp,
  setDoc,
  collection,
  writeBatch,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    try {
      const docRef = doc(collection(db, `chats/${data.chatId}/messages`));

      if (img) {
        setUploading(true);
        const storageRef = ref(storage, uuid());
        const uploadTask = uploadBytesResumable(storageRef, img);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            setUploading(false);
            console.error("Error uploading image:", error);
          },
          async () => {
            setUploading(false);
            setUploadProgress(0);

            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            const message = {
              _id: uuid(),
              sentBy: currentUser.uid,
              sentTo: data.user.uid,
              createdAt: serverTimestamp(),
              img: downloadURL,
              text,
            };

            await setDoc(docRef, message);
          }
        );
      } else {
        const message = {
          _id: uuid(),
          sentBy: currentUser.uid,
          sentTo: data.user.uid,
          createdAt: serverTimestamp(),
          text,
        };

        await setDoc(docRef, message);
      }

      const batch = writeBatch(db);
      const userChatsRef1 = doc(db, "userChats", currentUser.uid);
      const userChatsRef2 = doc(db, "userChats", data.user.uid);
      batch.update(userChatsRef1, {
        [data.chatId + ".lastMessage"]: { text },
        [data.chatId + ".date"]: serverTimestamp(),
      });
      batch.update(userChatsRef2, {
        [data.chatId + ".lastMessage"]: { text },
        [data.chatId + ".date"]: serverTimestamp(),
      });
      await batch.commit();

      setText("");
      setImg(null);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
      {uploading && <div>{uploadProgress.toFixed(1)}% uploaded</div>}
    </div>
  );
};

export default Input;
