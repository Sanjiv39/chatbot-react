import React from "react";

export default function ChatbotFooter() {
  return (
    <a
      className="chatbox-footer"
      href="https://humalogy.ai"
      target="_blank"
      rel="noreferrer"
    >
      Powered by{" "}
      <span>
        <img
          src="https://humachat.s3.amazonaws.com/huma-chat-assets/icons/logo.svg"
          alt="Logo"
        />
      </span>{" "}
      Humalogy.ai
    </a>
  );
}
