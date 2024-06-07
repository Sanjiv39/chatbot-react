import React, { useEffect } from "react";
import lightOrdarkColor from "@check-light-or-dark/color";
import { RiChat1Line } from "react-icons/ri";

const getDataFromChannel = (msg) => {
  if (typeof msg === "object" && msg) {
    if (msg.source && msg.source === "huma-chatbot-parent" && msg.data) {
      const data = msg.data;
      const obj = {
        type: "update",
        data: {
          theme: data.theme || "",
          avatar: data.avatar || "",
          name: data.name || "",
        },
      };
      for (const key in obj) {
        const val = Boolean(obj[key].trim());
        if (!val) {
          delete obj[key];
        }
      }
      return obj;
    }
  }
  return null;
};

export default function ChatbotContainer() {
  const channel = new BroadcastChannel("huma-chatbot");

  useEffect(() => {
    channel.addEventListener("message", (e) => {
      const data = getDataFromChannel(msg);
      if (data) {
        let botData = data.data;
        let root = document.querySelector(":root");
        if (root && botData.theme) {
          const theme = lightOrdarkColor(botData.theme);
          let style = `--theme-color: ${botData.theme}; --font-color: ${
            theme === "light" ? "black" : "white"
          } ;`;
          root.setAttribute("style", style.trim());
        }
      }
    });
  }, []);

  return (
    <button
      className="open-chat-btn"
      onClick={() => {
        const message = {
          source: "huma-chatbot-child",
          data: {
            type: "toggle",
            value: true,
          },
        };
        channel.postMessage(message);
      }}
    >
      <RiChat1Line />
    </button>
  );
}
