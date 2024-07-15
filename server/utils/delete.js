import fetch from "node-fetch";

const deleteMethod = async (url, body, token = "") => {
  const response = await fetch(`${process.env.API_URL}/api/${url}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body,
  });
  return await response.json();
};

export default deleteMethod;
