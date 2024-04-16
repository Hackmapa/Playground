export const get = async (url: string, token: string = "") => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/${url}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
};
