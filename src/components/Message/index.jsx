import { useContext, useEffect, useRef } from "react";
import React from "react";
import { Typewriter } from "react-simple-typewriter";
import { App } from "../Container";

export default function ChatbotMessage({
  message = {
    type: "from",
    text: "Hi",
    loading: false,
    className: "",
    typer: false,
  },
}) {
  const context = useContext(App);
  const messageRef = useRef();

  useEffect(() => {
    // console.log(message);
    if (messageRef.current) {
      if (message.type === "to") {
        setTimeout(() => {
          messageRef.current.classList.remove("chatbox-slide");
        }, 2000);
      } else if (message.type === "from") {
        setTimeout(() => {
          messageRef.current.classList.remove("chatbox-fade");
        }, 2000);
      }
    }
    messageRef.current?.scrollIntoView();
  }, [message, messageRef]);

  return (
    <div
      ref={messageRef}
      className={`chatbox-message ${message.type || ""} ${
        message.className || ""
      }`}
    >
      {message.type === "from" && (
        <div>
          <div className="chatbox-logo">
            <img
              src={
                context.botData.avatar ||
                "https://humachat.s3.amazonaws.com/huma-chat-assets/avatars/avatar-3.png"
              }
              alt={context.botData.name || "avatar"}
            />
          </div>
          {!message.loading && message.text?.trim() && (
            <div className="message">
              {message.typer ? (
                <Typewriter
                  words={[message.text]}
                  typeSpeed={50}
                  onType={() => {
                    messageRef.current?.scrollIntoView();
                  }}
                />
              ) : (
                message.text
              )}
            </div>
          )}
          {message.loading && (
            <div className="message">
              <span class="dots-cont">
                {" "}
                <span class="dot dot-1"></span> <span class="dot dot-2"></span>{" "}
                <span class="dot dot-3"></span>{" "}
              </span>
            </div>
          )}
        </div>
      )}
      {message.type === "to" && <div className="message">{message.text}</div>}
      {message.time?.trim() && (
        <div className="chatbox-time">{message.time}</div>
      )}
    </div>
  );
}
