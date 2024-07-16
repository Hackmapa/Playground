import fetch from "node-fetch";

const put = async (url, body, token = "") => {
  const response = await fetch(`${process.env.API_URL}/api/${url}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body,
  });
  return await response.json();
};

export default put;
