/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useRef, useState } from "react";
import ChatbotMessage from "../Message";
import { App } from "../Container";
import { getTime } from "../Container";
import { getResponse, ingestChatHistory } from "../apis/apis";
import ChatbotForm from "../Form";

export default function ChatbotBody({
  message = { type: "to", text: "", time: "", className: "" },
}) {
  const context = useContext(App);
  const lastElRef = useRef();
  const [messages, setMessages] = useState(context.messages || []);

  useEffect(() => {
    if (!messages.length) {
      const time = getTime();
      setMessages((prev) => [
        ...prev,
        {
          type: "from",
          autonomous: true,
          text: `Hey there! How can I help you today?`,
          time: time,
        },
      ]);
    }
  }, []);

  useEffect(() => {
    // console.log(messages);
    const arr = [...messages];
    context.setMessages(arr);
  }, [messages]);

  useEffect(() => {
    context.botData?.name &&
      setMessages((prev) => {
        let arr = [...prev];
        if (arr[0] && arr[0].type && arr[0].type === "from") {
          arr[0] = {
            ...arr[0],
            text: `Hey there! How can I help you today?`,
          };
        }
        return arr;
      });
  }, [context.botData]);

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

  useEffect(() => {
    lastElRef.current && lastElRef.current?.scrollIntoView();
  }, [lastElRef]);

  const sendFormSubmissionMessageFromBot = () => {
    const time = getTime();
    const msg = {
      type: "from",
      autonomous: true,
      text: "Thanks for sharing your details. We will reach out to you shortly.",
      time: time,
      className: "chatbox-fade",
    };
    setMessages((prev) => [...prev, msg]);
  };

  const sendMessagetoApi = async () => {
    if (message.type === "to" && message.text?.trim()) {
      try {
        if (!context.botData.websiteUrl) {
          throw new Error("Website url not found");
        }
        if (!context.botData.userId) {
          throw new Error("Id not found");
        }
        context.setLoading(true);
        const msg = { type: "from", text: "", loading: true };
        setMessages((prev) => [...prev, msg]);
        let chat_history = messages
          .map((msg, i) => {
            if (i === 0 && msg.type === "from") {
              return null;
            }
            const data = {
              role: msg.type === "from" ? "assistant" : "user",
              content: msg.text,
            };
            return data;
          })
          .filter((el) => Boolean(el));
        chat_history.push({
          role: "user",
          content: message.text.trim(),
        });

        const payload = {
          user_question: message.text.trim().replace(/ +/g, " "),
          chat_history: chat_history,
          user_id: context.botData?.userId || null,
          chatbot_name: context.botData?.name || "Chatbot",
        };
        let res = await getResponse(payload, context.botData.websiteUrl);
        if (
          res.data &&
          res.data.success &&
          res.data.data &&
          res.data.data.message
        ) {
          const time = getTime();
          const response = {
            type: "from",
            text: res.data.data.message
              .replace("HumaChat:", "")
              // .replace(/\n/g, "")
              .replace("HumaChat", context.botData?.name || "HumaChat")
              .trim(),
            time: time,
            className: "chatbox-fade",
            typer: true,
          };
          const history = [
            {
              role: "user",
              content: payload.user_question,
              response: {
                role: "assistant",
                content: response.text,
              },
            },
          ];
          res = await ingestChatHistory(
            history,
            context.uuid,
            context.botData.websiteUrl
          );
          // console.log(res);
          if (!(res.data && res.data.success)) {
            throw new Error("ingest response error");
          }
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
        // console.log(err);
        setTimeout(() => {
          setMessages((prev) => {
            let arr = [...prev];
            arr = arr.filter((el) => !el.loading);
            return arr;
          });
          context.setLoading(false);
        }, 800);
      }
    }
  };

  return (
    <div className="chatbox-body">
      <div
        className="chatbox-body-inner"
        style={
          context.form === undefined || context.formClosed
            ? { marginBottom: 45 }
            : {}
        }
      >
        {messages.length > 0 &&
          messages.map((msg, i) => <ChatbotMessage message={msg} key={i} />)}
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

      {context.form === true && !context.loading && !context.formClosed && (
        <ChatbotForm
          handleFormSubmissionMessage={sendFormSubmissionMessageFromBot}
        />
      )}

      {context.form === false && !context.loading && !context.formClosed && (
        <div className="open-form-card">
          <p>To personalise your experience, please enter your information</p>
          <button
            ref={lastElRef}
            className="open-form-btn"
            onClick={() => context.setForm(true)}
          >
            Enter Contact Info
          </button>
        </div>
      )}
    </div>
  );
}
