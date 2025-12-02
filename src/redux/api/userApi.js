const BASE_URL = "http://localhost:8000/api";

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    const message = data.message || "Something went wrong";
    throw new Error(message);
  }
  return data;
};

export const registerApi = async (form) => {
  return fetch(`${BASE_URL}/users/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: form.email,
      password: form.password,
    }),
  }).then(handleResponse);
};

export const loginApi = async (form) => {
  return fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: form.email,
      password: form.password,
    }),
  }).then(handleResponse);
};
