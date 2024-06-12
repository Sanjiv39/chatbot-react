import axios from "axios";

const baseUrl = "https://devapi.humalogy.ai";
const websiteUrl = window.location.origin;
console.log(websiteUrl);
const contentTypes = {
  json: "application/json",
};

const ASKQUERY = axios.create({
  baseURL: baseUrl + "/huma-chat/ask-query/",
  method: "post",
  headers: {
    "Content-Type": contentTypes.json,
  },
});

const humaJwt = import.meta.env.VITE_HUMA_JWT;
const humaUuid = import.meta.env.VITE_HUMA_UUID;
// console.log(humaJwt);
const CAMPAIGN = axios.create({
  baseURL: baseUrl + "/campaign",
  method: "post",
  headers: {
    "Content-Type": contentTypes.json,
    Authorization: humaUuid,
  },
});

export const getResponse = async (
  payload,
  website_url = "https://excellobpo.com/"
) => {
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
  website_url = "https://excellobpo.com/"
) => {
  try {
    if (!uuid.trim()) {
      throw new Error("uuid was not passed");
    }
    let res = CAMPAIGN.request({
      url: "/ingest-chat-history/",
      data: {
        chat_source: website_url,
        chat_id: uuid,
        chat_history: history,
      },
    });
    return res;
  } catch (err) {
    throw new Error(err);
  }
};
