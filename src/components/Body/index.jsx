import React, { useContext, useEffect, useState } from "react";
import ChatbotMessage from "../Message";
import { App } from "../Container";
import { getTime } from "../Container";
import { getResponse } from "../apis/apis";
import ChatbotForm from "../Form";

export default function ChatbotBody({
  message = { type: "to", text: "", time, className: "" },
}) {
  const context = useContext(App);
  const [messages, setMessages] = useState(context.messages || []);

  useEffect(() => {
    if (!messages.length) {
      const time = getTime();
      setMessages((prev) => [
        ...prev,
        {
          type: "from",
          text: `Hi this is ${
            context.botData?.name || "Ryan"
          }! How can I help you?`,
          time: time,
        },
      ]);
    }
  }, []);

  useEffect(() => {
    console.log(messages);
    const arr = [...messages];
    context.setMessages(arr);
  }, [messages]);

  useEffect(() => {
    if (message) {
      setMessages((prev) => [
        ...prev,
        { ...message, className: "chatbox-slide" },
      ]);
      // remove animation class
      setTimeout(() => {
        setMessages((prev) =>
          [...prev].filter((msg) => {
            if (msg.type === "to") {
              msg.className = "";
            }
            return msg;
          })
        );
      }, 200);
      sendMessagetoApi();
    }
    context.setMessage(null);
  }, [message]);

  const sendMessagetoApi = async () => {
    if (message.type === "to" && message.text?.trim()) {
      try {
        context.setLoading(true);
        const msg = { type: "from", text: "", loading: true };
        setMessages((prev) => [...prev, msg]);
        const payload = {
          user_question: message.text.trim().replace(/ +/g, " "),
        };
        const res = await getResponse(payload);
        if (
          res.data &&
          res.data.success &&
          res.data.data &&
          res.data.data.message
        ) {
          const time = getTime();
          const response = {
            type: "from",
            text: res.data.data.message.replace("\n\nHumaChat:", "").trim(),
            time: time,
            className: "chatbox-fade",
          };
          setTimeout(() => {
            setMessages((prev) => {
              let arr = [...prev];
              arr = arr.filter((el) => !el.loading);
              arr.push(response);
              return arr;
            });
            context.setLoading(false);
            // remove animation class
            setTimeout(() => {
              setMessages((prev) =>
                [...prev].filter((msg) => {
                  if (msg.type === "from") {
                    msg.className = "";
                  }
                  return msg;
                })
              );
            }, 200);
          }, 800);
          return;
        }
        throw new Error("error response");
      } catch (err) {
        console.log(err);
        setTimeout(() => {
          setMessages((prev) => {
            let arr = [...prev];
            arr.filter((el) => !el.loading);
            return arr;
          });
          context.setLoading(false);
        }, 800);
      }
    }
  };

  return (
    <div className="chatbox-body">
      <div className="chatbox-body-inner">
        {messages.length > 0 &&
          messages.map((msg) => <ChatbotMessage message={msg} />)}
      </div>
      {!context.form && (
        <button
          className="open-form-btn"
          onClick={() => {
            context.setForm(true);
          }}
        >
          Share your Contact details
        </button>
      )}
      {context.form && <ChatbotForm />}
    </div>
  );
}
