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

  const suggestions = [
    {
      text: "Contact me",
      action: () => {
        const msg = {
          type: "to",
          text: `I want to contact you`,
          time: getTime(),
        };
        context.setMessage(msg);
      },
    },
    {
      text: `What is ${context.botData?.company || "Humalogy"}`,
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

  useEffect(() => {
    if (!messages.length) {
      const time = getTime();
      setMessages((prev) => [
        ...prev,
        {
          type: "from",
          text: `Hi this is ${
            context.botData?.name || "Quill"
          }! Please tell me how can I help you?`,
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
            typer: true,
          };
          const charLen = response.text.length;
          setTimeout(() => {
            setMessages((prev) => {
              let arr = [...prev];
              arr = arr.filter((el) => !el.loading);
              arr.push(response);
              return arr;
            });
            // remove animation class
            setTimeout(() => {
              setMessages((prev) =>
                [...prev].filter((msg) => {
                  if (msg.type === "from") {
                    msg.className = "";
                    msg.typer = false;
                  }
                  return msg;
                })
              );
              context.setLoading(false);
            }, charLen * 50 + 500);
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
      {/* {!context.form && (
        <button
          className="open-form-btn"
          onClick={() => {
            context.setForm(true);
          }}
        >
          Share your Contact details
        </button>
      )} */}
      {/* {context.form && !context.formClosed && <ChatbotForm />} */}
      {context.form && <ChatbotForm />}
      {!context.form && (
        <div className="open-form-card">
          <p>To personalise your experience, please enter your information</p>
          <button
            className="open-form-btn"
            onClick={() => context.setForm(true)}
          >
            Enter Contact Info
          </button>
        </div>
      )}
      <div className="suggestions">
        {suggestions.map((suggestion, i) => (
          <button
            key={`suggestion-${i}`}
            disabled={context.loading}
            className="suggestion"
            onClick={suggestion.action}
          >
            {suggestion.text}
          </button>
        ))}
      </div>
    </div>
  );
}
