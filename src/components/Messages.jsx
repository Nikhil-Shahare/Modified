import { getDocs, collection } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import Message from "./Message";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const getChats = async () => {
      const querySnapshot = await getDocs(collection(db, `chats/${data.chatId}/messages`));
      console.log( `chats/${data.chatId}/messages`)
      const messageData = querySnapshot.docs.map((doc) => doc.data());
      setMessages(messageData);
    };

    getChats(); // Call the function to fetch and set the chat data.
  }, [data.chatId]);

  console.log("this is for messages",messages);

  return (
    <div className="messages">
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
};

export default Messages;
