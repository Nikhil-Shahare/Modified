import React, { useContext, useState } from "react";
import { Firestore, getFirestore } from "firebase/firestore";
import Img from "../img/img.png";
import Attach from "../img/attach.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
  setDoc,
  getDoc,
  collection,
  addDoc
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  
  const handleSend = async () => {
    const docRef = await collection(db, `chats/${data.chatId}/messages`)
    if (img) {
      const storageRef = ref(storage, uuid());
      setText("you recieved an image")
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          //TODO:Handle Error
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await setDoc(doc(docRef), {

                id: uuid(),
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
                text,
            
            });
          });
        }
      );
    } else {
      try {
        
        await setDoc(doc(docRef), {       
            id: uuid(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
        });

      //  getFirestore().collection('chats').doc(data.chatId).collection('messages').add(
      //     { id: uuid(),
      //           text,
      //           senderId: currentUser.uid,
      //           date: Timestamp.now(),}
      //     );




      // const collectionRef = await collection(db,`chats/${data.chatid}/messages`)
      // await collectionRef.add( {       
      //       id: uuid(),
      //       text,
      //       senderId: currentUser.uid,
      //       date: Timestamp.now(),
      //   })      


      } catch (error) {
        console.log("this is input error",error)
      }
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
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
        <img src={Attach} alt="" />
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
    </div>
  );
};

export default Input;
