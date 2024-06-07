import axios from "axios";

const baseUrl = "https://devapi.humalogy.ai/huma-chat";
const websiteUrl = window.location.origin;
console.log(websiteUrl);
const contentTypes = {
  json: "application/json",
};

const ASKQUERY = axios.create({
  baseURL: baseUrl + "/ask-query/",
  method: "post",
  headers: {
    "Content-Type": contentTypes.json,
  },
});

export const getResponse = async (payload) => {
  try {
    let res = ASKQUERY.request({
      data: { ...payload, website_url: "https://excellobpo.com/" },
    });
    return res;
  } catch (err) {
    return err;
  }
};
