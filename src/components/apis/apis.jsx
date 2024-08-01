/* eslint-disable react-refresh/only-export-components */
import axios from "axios";

// const baseUrl = "https://api.humalogy.ai";
const baseUrl = "https://devapi.humalogy.ai";

// const websiteUrl = window.location.origin;
// console.log(websiteUrl);

// const humaJwt = import.meta.env.VITE_HUMA_JWT;
const humaUuid = import.meta.env.VITE_HUMA_UUID;

const contentTypes = {
  json: "application/json",
};

const ASKQUERY = axios.create({
  baseURL: baseUrl + "/huma-chat/ask-query/",
  method: "post",
  headers: {
    "Content-Type": contentTypes.json,
    Authorization: humaUuid,
  },
});

// console.log(humaJwt);
const CAMPAIGN = axios.create({
  baseURL: baseUrl + "/campaign",
  method: "post",
  headers: {
    "Content-Type": contentTypes.json,
    Authorization: humaUuid,
  },
});

export const getResponse = async (payload, website_url = null) => {
  if (!website_url) {
    throw new Error("Webite url not found");
  }
  try {
    let res = ASKQUERY.request({
      data: { ...payload, website_url: website_url },
    });
    return res;
  } catch (err) {
    throw new Error(err);
  }
};

export const ingestChatHistory = async (
  history = [],
  uuid = "",
  website_url = "https://excellobpo.com/",
  email_body = null
) => {
  try {
    if (!uuid.trim()) {
      throw new Error("uuid was not passed");
    }
    let res = await CAMPAIGN.request({
      url: "/ingest-chat-history/",
      data: {
        chat_link: website_url,
        chat_id: uuid,
        chat_history: history,
        is_huma_chat_campaign: true,
        email_body: email_body,
      },
    });
    return res;
  } catch (err) {
    throw new Error(err);
  }
};
