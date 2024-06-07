import React, { createContext, useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import { RiChat1Line } from "react-icons/ri";
import { getResponse } from "../apis/apis";
import ChatbotHeader from "../Header";
import ChatbotBody from "../Body";
import ChatbotFooter from "../Footer";
import ChatbotInput from "../Input";
import ChatbotForm from "../Form";

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

export default function ChatbotContainer() {
  const [userData, setUserData] = useState(
    secureLocalStorage.getItem("__us_uD__")
  );
  const [botData, setBotData] = useState({
    name: "Quill",
    avatar:
      "https://humachat.s3.amazonaws.com/huma-chat-assets/avatars/avatar-3.png",
  });
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState(null);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(false);

  const toggleActive = () => {
    setActive((prev) => !prev);
  };

  useEffect(() => {
    // if (!userData) {
    secureLocalStorage.setItem("__us_uD__", {
      email: "user@gmail.com",
      "phone-no": "+916678989789",
    });
    // }
    window.addEventListener("storage", () => {
      const data = secureLocalStorage.getItem("__us_uD__");
      console.log(data);
      setUserData(data);
    });
    let root = document.querySelector("#huma-chat-container");
    console.log(root.getAttribute("style"));
    root.setAttribute("style", "--theme-color : green;");
  }, []);

  useEffect(() => {
    console.log(userData);
  }, [userData]);
  return (
    <App.Provider
      value={{
        userData,
        setUserData,
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
      }}
    >
      <div className="chat-container">
        <div className={`chatbox ${active ? "active" : ""}`}>
          <ChatbotHeader />
          {!form && <ChatbotBody message={message} />}
          {!form && <ChatbotInput />}
          {form && <ChatbotForm />}
          <ChatbotFooter />
        </div>
        <button className="open-chat-btn" onClick={toggleActive}>
          <RiChat1Line />
        </button>
      </div>
    </App.Provider>
  );
}
