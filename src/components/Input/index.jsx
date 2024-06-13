import React, { useContext, useRef, useState } from "react";
import { BsSend } from "react-icons/bs";
import { App } from "../Container";
import { getTime } from "../Container";

export default function ChatbotInput() {
  const context = useContext(App);
  const sendButton = useRef();
  const [message, setMessage] = useState("");

  const suggestions = [
    {
      text: "Contact me",
      action: () => {
        context.setFormClosed(false);
        context.setForm(true);
      },
      disabled: context.userData,
    },
    {
      text: `About Me`,
      action: () => {
        const msg = {
          type: "to",
          text: `What is ${context.botData?.company || "Humalogy"}?`,
          time: getTime(),
        };
        context.setMessage(msg);
      },
    },
  ];

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
      <div
        className="suggestions"
        style={context.loading ? { display: "none" } : {}}
      >
        {suggestions.map((suggestion, i) => (
          <button
            key={`suggestion-${i}`}
            disabled={context.loading}
            className="suggestion"
            style={suggestion.disabled ? { display: "none" } : {}}
            onClick={suggestion.action}
          >
            {suggestion.text}
          </button>
        ))}
      </div>
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
