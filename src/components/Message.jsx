import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { formatDistanceToNow } from "date-fns"; // Import date-fns function

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const getFormattedDateTime = (timestamp) => {
    if (!timestamp) {
      return 'just now'; // Return an empty string or a default value if timestamp is null
    }
    return formatDistanceToNow(timestamp.toDate(), { addSuffix: true });
  };

  return (
    <div
      ref={ref}
      className={`message ${message.sentBy === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <img
          src={
            message.sentBy === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
      </div>
      <div className="messageContent">
        {!message.img && <p>{message.text}</p>}
        {message.img && <img src={message.img} alt="" />}
        <span
          style={{
            fontSize: "12px", // Adjust the font size as needed
            fontWeight: 400, // Adjust the font weight as needed
            color: "#666", // Adjust the color as needed
            marginTop: "1px", // Add some margin to separate the time from the message content
          }}
        >
          {getFormattedDateTime(message.createdAt)}
        </span>
      </div>
    </div>
  );
};

export default Message;
