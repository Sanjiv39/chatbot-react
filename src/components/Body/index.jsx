import React, { useContext, useEffect, useState } from "react";
import ChatbotMessage from "../Message";
import { App } from "../Container";
import { getTime } from "../Container";
import { getResponse } from "../apis/apis";

export default function ChatbotBody({
  message = { type: "to", text: "", time },
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
  }, [messages]);

  useEffect(() => {
    message && setMessages((prev) => [...prev, { ...message }]);
    message && sendMessagetoApi();
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
          };
          setTimeout(() => {
            setMessages((prev) => {
              let arr = [...prev];
              arr = arr.filter((el) => !el.loading);
              arr.push(response);
              return arr;
            });
            context.setLoading(false);
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
      <button
        className="open-form-btn"
        onClick={() => {
          context.setForm(true);
        }}
      >
        Share your Contact details
      </button>
    </div>
  );
}
