import { getDocs, collection, query, orderBy, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import Message from "./Message";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const chatId = data.chatId;

    console.log("this is data.chatId",chatId)
    const q =  query(collection(db, `chats/${chatId}/messages`),orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageData = snapshot.docs.map((doc) => doc.data());
      // Set the state with the new array of document data
      setMessages(messageData);
    });

    // Return the unsubscribe function to stop listening when the component unmounts
    return () => unsubscribe();
  }, [data.chatId]);

  console.log("this is for messages", messages);

  return (
    <div className="messages">
      {messages.map((m) => (
        <Message message={m} key={m._id} />
      ))}
    </div>
  );
};

export default Messages;
