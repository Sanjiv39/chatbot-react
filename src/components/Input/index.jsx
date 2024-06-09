import React, { useContext, useRef, useState } from "react";
import { BsSend } from "react-icons/bs";
import { App } from "../Container";
import { getTime } from "../Container";

export default function ChatbotInput() {
  const context = useContext(App);
  const sendButton = useRef();
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      const time = getTime();
      const msg = { type: "to", text: message.trim(), time: time };
      context.setMessage(msg);
      setMessage("");
    }
  };

  return (
    <div className="chatbox-input-container">
      <input
        inputmode="text"
        type="text"
        name="chatbox-input"
        autocomplete="off"
        placeholder="Type something..."
        className="chatbox-input"
        value={message}
        onInput={(e) => {
          setMessage(e.currentTarget.value);
        }}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            sendButton.current?.click();
          }
        }}
      />
      <button
        ref={sendButton}
        className="chatbox-send-btn"
        disabled={context.loading || !message.trim()}
        onClick={
          !context.loading && handleSendMessage ? handleSendMessage : undefined
        }
      >
        <BsSend color="black" style={{ transform: "rotate(45deg)" }} />
      </button>
    </div>
  );
}
