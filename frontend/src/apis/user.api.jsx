import api from "./api";

const apiuser = {
  login: async ({ id, password }) => {
    //  POST /login
    const res = await api.post("/users/login", { id, password });

    // Extract token and isAdmin from response
    const { token, isAdmin } = res.data;

    // saving token and isAdmin in localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("isAdmin", isAdmin);

    return res.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    window.location.href = "/login";
  },
};

export default apiuser;
