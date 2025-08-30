const baseURL = "http://localhost:8000";
const apiuser = {
  login: async ({ id, password }) => {
    const payload = {  id, password };
    const res = await fetch(baseURL + "/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return res.json();
  },


};

export default apiuser;