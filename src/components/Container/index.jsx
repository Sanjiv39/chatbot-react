import React, { createContext, useEffect, useState } from "react";
import { v6 as uuidv7 } from "uuid";
import secureLocalStorage from "react-secure-storage";
import { ColorData } from "../Color/Color";
import ChatbotHeader from "../Header";
import ChatbotBody from "../Body";
import ChatbotFooter from "../Footer";
import ChatbotInput from "../Input";

export const App = createContext();

const assetsBaseUrl = "https://humachat.s3.amazonaws.com/huma-chat-assets";

export const getTime = (date = new Date()) => {
  let mer = Number.parseInt(date.getHours() / 12) === 0 ? "AM" : "PM";
  let hrs =
    Number.parseInt(date.getHours() % 12) === 0 &&
    Number.parseInt(date.getHours() / 12) === 1
      ? 12
      : Number.parseInt(date.getHours() % 12);
  hrs = hrs <= 9 ? `0${hrs}` : `${hrs}`;
  let min = date.getMinutes();
  min = min <= 9 ? `0${min}` : `${min}`;
  let str = `${hrs}:${min} ${mer}`;
  return str;
};

const getDataFromChannel = (msg) => {
  try {
    if (msg.source === "huma-chatbot-parent" && msg.data.type === "update") {
      const data = msg.data.data;
      const obj = {
        type: msg.data.type,
        data: {
          theme: data.theme || "",
          avatar: data.avatar || "",
          name: data.name || "",
          websiteUrl: data.websiteUrl || "",
          userId: data.userId,
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
        const colorData = ColorData(botData.theme);
        if (!colorData) {
          throw new Error("color error");
        }
        // console.log(theme);
        let style = `--theme-color: ${colorData.color}; --font-color: ${
          colorData.isLight ? "black" : "white"
        }; --secondary-color: ${
          colorData.isLight ? colorData.darker : colorData.lighter
        }; --secondary-font-color: ${
          colorData.isLight ? "white" : "black"
        }; --alpha-color: ${colorData.alpha};`;
        root.setAttribute("style", style.trim());
        return true;
      }
      return false;
    }
  } catch (err) {
    return false;
  }
};

export default function ChatbotContainer() {
  const [userData, setUserData] = useState(
    secureLocalStorage.getItem("__uD__")
  );
  const [uuid, setuuid] = useState(secureLocalStorage.getItem("__uID__"));
  const [botData, setBotData] = useState({
    name: "Huma Chat",
    avatar:
      "https://humachat.s3.amazonaws.com/huma-chat-assets/avatars/avatar-3.png",
    company: "Excello",
    websiteUrl: null,
    userId: null,
  });
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState(null);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(undefined);
  const [formClosed, setFormClosed] = useState(false);

  const [parent, setParent] = useState(null);
  const [origin, setOrigin] = useState("");

  const toggleActive = () => {
    setActive((prev) => !prev);
  };

  const acknowledgeParent = () => {
    if (parent && origin) {
      const message = {
        source: "huma-chatbot-child",
        data: {
          type: "acknowledgement",
          message: "Hi from chatbot",
        },
      };
      parent.postMessage(message, origin);
    }
  };

  const updateData = (data) => {
    try {
      // console.log(data);
      const newData = {
        name: data.name?.trim() || botData.name,
        avatar:
          data.avatar
            ?.trim()
            .match(
              /^http[s]{0,1}[:]\/\/.+[.](png|svg|jpg|jpeg|webp)\/*$/
            )?.[0] || botData.avatar,
        websiteUrl: data.websiteUrl || null,
        userId: data.userId || null,
      };
      // console.log(newData);
      setBotData((prev) => ({ ...prev, ...newData }));
      return true;
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    if (!uuid) {
      const uuid = uuidv7();
      // console.log(uuid);
      secureLocalStorage.setItem("__uID__", uuid);
      setuuid(uuid);
    }

    // Update colors and bot data
    window.addEventListener("message", (e) => {
      try {
        if (
          e.origin.trim() &&
          e.source &&
          e.data.source === "huma-chatbot-parent"
        ) {
          // console.log(e.origin);
          // console.log("got msg by parent");
          setParent(e.source);
          setOrigin(e.origin.trim());
          // console.log("source updated");
        }
        const msg = e.data;
        // console.log(msg);
        const data = getDataFromChannel(msg);
        // console.log(data);
        const updated = updateColor(data);
        updateData(data.data);
        // console.log(`Color was ${!updated ? "not" : ""} updated`);
        // console.log(Boolean(updated && data));
      } catch (err) {
        // console.log("error message");
      }
    });
  }, []);

  useEffect(() => {
    userData && setFormClosed(true);
  }, [userData]);

  useEffect(() => {
    // console.log(parent, origin);
    acknowledgeParent();
  }, [origin, parent]);

  useEffect(() => {
    if (
      !formClosed &&
      form === undefined &&
      messages.filter((msg) => msg.type === "from" && !msg.loading).length > 4
    ) {
      setForm(false);
    }
  }, [messages]);

  return (
    <App.Provider
      value={{
        userData,
        setUserData,
        uuid,
        setuuid,
        setActive,
        botData,
        assetsBaseUrl,
        messages,
        setMessages,
        message,
        setMessage,
        loading,
        setLoading,
        form,
        setForm,
        formClosed,
        setFormClosed,
      }}
    >
      <div className="chat-container">
        <div className={`chatbox active`}>
          <ChatbotHeader
            onClose={() => {
              const message = {
                source: "huma-chatbot-child",
                data: {
                  type: "toggle",
                  value: false,
                },
              };
              parent && origin && parent.postMessage(message, origin);
              // console.log("chatbot closed by chatbot");
            }}
          />
          <ChatbotBody message={message} />
          <ChatbotInput />
          <ChatbotFooter />
        </div>
        {/* <button className="open-chat-btn" onClick={toggleActive}>
          <RiChat1Line />
        </button> */}
      </div>
    </App.Provider>
  );
}
