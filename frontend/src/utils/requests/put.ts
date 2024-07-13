export const put = async (url: string, body: any, token: string = "") => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/${url}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body,
  });
  return await response.json();
};
