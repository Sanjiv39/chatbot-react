import React, { useContext } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { App } from "../Container";

export default function ChatbotHeader() {
  const context = useContext(App);
  return (
    <div className="chatbox-header">
      <div className="chatbox-logo">
        <img
          src={
            context.botData.avatar ||
            "https://humachat.s3.amazonaws.com/huma-chat-assets/avatars/avatar-3.png"
          }
          alt={context.botData.name || "avatar"}
        />
      </div>
      <div className="chatbox-header-text">
        <h2>{`Hi this is ${context.botData.name || "Huma"}!`}</h2>
        <p>How can I help you?</p>
      </div>
      <button
        className="chatbox-close-btn"
        onClick={() => {
          context.setActive(false);
        }}
      >
        <IoCloseOutline />
      </button>
    </div>
  );
}
