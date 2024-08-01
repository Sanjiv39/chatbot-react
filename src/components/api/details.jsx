import axios from "axios";

const humaUuid = import.meta.env.VITE_HUMA_UUID;
// console.log(humaUuid);
const contentTypes = {
  json: "application/json",
};

const HUMACHAT = axios.create({
  // baseURL: "https://api.humalogy.ai/huma-chat",
  baseURL: "https://devapi.humalogy.ai/huma-chat",
  method: "post",
  headers: {
    "Content-Type": contentTypes.json,
    Authorization: humaUuid,
  },
});

export const getChatbotDetails = async (website_url = "") => {
  try {
    if (!website_url.match(/^http(s|)[:]\/\/.+$/)) {
      throw new Error("Invalid website url");
    }
    let res = await HUMACHAT.request({
      url: "/humachat-get-chatbot-details/",
      data: {
        website_url: website_url,
      },
    });
    return res;
  } catch (err) {
    throw new Error(err);
  }
};
