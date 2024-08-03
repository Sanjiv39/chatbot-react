import React, { useEffect, useState } from "react";
import { getChatbotDetails } from "../api/details";

const sources = [
  // chatbox
  // "https://chatbot-cdn-chatbot.vercel.app",
  // "http://localhost:3000",
  // "https://humachat.s3.amazonaws.com/chatbot/dist/index.html",
  "https://d2qnaus9rmh238.cloudfront.net/chatbot/dist/index.html",

  // button
  // "https://chatbot-cdn-button.vercel.app",
  // "http://localhost:3001",
  // "https://humachat.s3.amazonaws.com/button/dist/index.html",
  "https://d2qnaus9rmh238.cloudfront.net/button/dist/index.html",
];

const sendBotData = (frame, data) => {
  const msg = {
    source: "huma-chatbot-parent",
    data: {
      type: "update",
      data: { ...data },
    },
  };
  // console.log(frame.src.match(/^http(s|)[:]\/\/[^\/?#]+/)?.[0]);
  frame.contentWindow.postMessage(
    msg,
    frame.src.match(/^http(s|)[:]\/\/[^\/?#]+/)?.[0]
  );
};

export default function ChatbotContainer() {
  const [loadedFrames, setLoadedFrames] = useState([]);
  const [botData, setBotData] = useState(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const root = document.querySelector("#huma-chat-container");
    const website =
      root &&
      root
        .getAttribute("data-website-url")
        ?.trim()
        .match(/^http(s|)[:]\/\/.+[.].+/)
        ? root.getAttribute("data-website-url").trim()
        : null;
    let user_id =
      root &&
      root
        .getAttribute("data-id")
        ?.trim()
        .match(/^[0-9]+$/)
        ? root.getAttribute("data-id").trim()
        : null;

    // verify channel message
    const verifyChannelMessage = (msg) => {
      try {
        if (msg.source === "huma-chatbot-child") {
          const data = msg.data;
          if (data.type === "toggle" && typeof data.value === "boolean") {
            const toggle = data.value;
            const obj = {
              value: Boolean(toggle),
            };
            return obj;
          }
        }
        return null;
      } catch (err) {
        return null;
      }
    };
    // verify acknowledgement
    const verifyAcknowledgement = (msg) => {
      try {
        if (msg.source === "huma-chatbot-child") {
          const data = msg.data;
          // console.log(msg.data);
          if (data.type === "acknowledgement") {
            const message = data.message;
            const obj = {
              message: message,
            };
            return obj;
          }
        }
        return null;
      } catch (err) {
        // console.log(err);
        return null;
      }
    };

    window.addEventListener("message", (e) => {
      let data = verifyChannelMessage(e.data);
      let acknowledge = verifyAcknowledgement(e.data);
      if (data) {
        data.value ? setActive(true) : setActive(false);
      } else if (acknowledge) {
        [...sources].forEach((src) => {
          let origin = e.origin.match(/^http(s|)[:]\/\/[^\/?#]+/)?.[0];
          // console.log(origin, e.origin);
          if (src.startsWith(origin)) {
            setLoadedFrames((prev) => {
              let arr = [...prev];
              arr.push(src);
              let set = new Set(arr);
              let final = [...set];
              return final;
            });
          }
        });
      }
    });

    // get bot details
    const updateBotDetails = async () => {
      try {
        if (!website) {
          throw new Error("Unable to get website url");
        }
        // console.log(website);
        let res = await getChatbotDetails(website);
        if (
          res.data &&
          Array.isArray(res.data) &&
          res.data.length > 0 &&
          res.data[0] &&
          typeof res.data[0] === "object"
        ) {
          const data = res.data[0];
          if (
            !data.processing_status ||
            data.processing_status?.toLowerCase().trim() !== "done"
          ) {
            throw new Error("not-ready");
          }
          let avatar = data.avatar_url?.trim().match(/^http(s|)[:]\/\/.+/)
            ? data.avatar_url.trim()
            : data.avatar_url?.trim().toLowerCase().startsWith("avatar-")
            ? `https://humachat.s3.amazonaws.com/huma-chat-assets/avatars/${data.avatar_url
                .trim()
                .toLowerCase()}.png`
            : "https://humachat.s3.amazonaws.com/huma-chat-assets/avatars/avatar-3.png";
          const obj = {
            name: data.chatbot_name || "Huma Chat",
            avatar: avatar,
            theme: data.theme || "#13294b",
            websiteUrl: website,
            userId: Number.parseInt(user_id),
            botId: data.campaign,
          };
          // console.log(obj);
          setBotData(obj);
          return;
        }
        throw new Error("Website not registered");
      } catch (err) {
        // console.log(err.message);
        if (err?.message === "not-ready") {
          console.log("Your chatbot is not yet ready!");
          return;
        }
        console.log(
          "Unable to embedd chatbot. Maybe you haven't registered your site with us"
        );
      }
    };
    updateBotDetails();
  }, []);

  useEffect(() => {
    let frames = document.querySelectorAll(".huma-chat-iframe");
    let timers = [];

    // console.log(loadedFrames, botData);

    // Check if all frames and document is properly loaded
    Boolean(frames.length) &&
      Boolean(botData) &&
      frames.forEach((frame, i) => {
        let src = frame.src;
        // console.log(src);
        if (!loadedFrames.includes(src)) {
          const repeat = setInterval(() => {
            sendBotData(frame, botData);
          }, 1000);
          timers.push(repeat);
        } else {
          // console.log("frame", i + 1, "loaded");
        }
      });
    return () => {
      Boolean(timers.length) &&
        timers.forEach((timer) => {
          clearInterval(timer);
        });
    };
  }, [loadedFrames, botData]);

  return (
    <>
      <iframe
        className={`huma-chat-iframe huma-chatbot-iframe ${
          active ? "active" : ""
        }`}
        style={botData ? {} : { display: "none" }}
        src={sources[0]}
      ></iframe>
      <iframe
        style={
          loadedFrames.includes(sources[1]) &&
          loadedFrames.length === 2 &&
          botData
            ? { display: "block" }
            : { display: "none" }
        }
        className="huma-chat-iframe huma-chat-btn-iframe"
        src={sources[1]}
      ></iframe>
    </>
  );
}
