import React, { useEffect, useState } from "react";
import lightOrdarkColor from "@check-light-or-dark/color";
import { RiChat1Line } from "react-icons/ri";

const getDataFromChannel = (msg) => {
  try {
    if (msg.source === "huma-chatbot-parent" && msg.data.type === "update") {
      const data = msg.data.data;
      const obj = {
        type: msg.data.type,
        data: {
          theme: data.theme,
          avatar: data.avatar,
          name: data.name,
        },
      };
      for (const key in obj.data) {
        const val = Boolean(obj.data[key].trim());
        if (!val) {
          delete obj[key];
        }
      }
      return obj;
    }
    return null;
  } catch (err) {
    // console.log(err);
    return null;
  }
};

const updateColor = (data) => {
  try {
    if (data) {
      let botData = data.data;
      let root = document.querySelector(":root");
      if (root && botData.theme) {
        const theme = lightOrdarkColor(botData.theme);
        // console.log(theme);
        let style = `--theme-color: ${botData.theme}; --font-color: ${
          theme === "light" ? "black" : "white"
        } ;`;
        theme && root.setAttribute("style", style.trim());
        return true;
      }
      return false;
    }
  } catch (err) {
    return false;
  }
};

export default function ChatbotContainer() {
  const [parent, setParent] = useState(null);
  const [origin, setOrigin] = useState("");

  const acknowledgeParent = () => {
    if (parent && origin) {
      const message = {
        source: "huma-chatbot-child",
        data: {
          type: "acknowledgement",
          message: "Hi from button",
        },
      };
      parent.postMessage(message, origin);
      console.log("click closed by chatbot");
    }
  };

  useEffect(() => {
    window.addEventListener("message", (e) => {
      try {
        if (
          e.origin.trim() &&
          e.source &&
          e.data.source === "huma-chatbot-parent"
        ) {
          // console.log(e.origin);
          setParent(e.source);
          setOrigin(e.origin.trim());
          // console.log("source updated");
        }
        const msg = e.data;
        // console.log(msg);
        const data = getDataFromChannel(msg);
        // console.log(data);
        const updated = updateColor(data);
        // console.log(`Color was ${!updated ? "not" : ""} updated`);
      } catch (err) {
        // console.log("error message");
      }
    });
  }, []);

  useEffect(() => {
    console.log(parent, origin);
    if (origin && parent) {
      acknowledgeParent();
    }
  }, [origin, parent]);

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
        parent && origin && parent.postMessage(message, origin);
        console.log("chatbot open by button");
      }}
    >
      <RiChat1Line />
    </button>
  );
}
