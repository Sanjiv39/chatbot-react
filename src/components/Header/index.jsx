import React, { useContext } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { App } from "../Container";

export default function ChatbotHeader({ onClose = () => {} }) {
  const context = useContext(App);
  return (
    <div className="chatbox-header">
      <div className="chatbox-logo">
        <img
          src={
            context.botData.avatar ||
            "https://humachat.s3.amazonaws.com/huma-chat-assets/avatars/avatar-3.png"
          }
          alt={context.botData?.name?.toLowerCase() || "avatar"}
        />
      </div>
      <div className="chatbox-header-text">
        <h2>{context.botData?.name || "Chatbot"}</h2>
        <p>Hey there! How can I help you today?</p>
      </div>
      <button
        className="chatbox-close-btn"
        onClick={() => {
          context.setActive(false);
          onClose();
        }}
      >
        <IoCloseOutline />
      </button>
    </div>
  );
}
