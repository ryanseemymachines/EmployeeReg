const BASE_URL = "http://localhost:8000/api";

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    const message = data.message || "Something went wrong";
    throw new Error(message);
  }
  return data;
};

export const getEmployeeApi = async () => {
  return fetch(`${BASE_URL}/employee/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }).then(handleResponse);
};

export const registerEmployeeApi = async (employeeData) => {
  return fetch(`${BASE_URL}/employee/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(employeeData),
  }).then(handleResponse);
};

export const deleteEmployeeApi = async (employeeId) => {
  return fetch(`${BASE_URL}/employee/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({employeeId}),
  }).then(handleResponse);
};