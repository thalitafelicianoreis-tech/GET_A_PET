import api from "../utils/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFlashMessage from "./useFlashMessage";

export default function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const { setFlashMessage } = useFlashMessage();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // Padronizado com .common['Authorization']
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setAuthenticated(true);
    }
  }, []);

  async function register(user) {
    let msgText = "Cadastro realizado com sucesso!";
    let msgType = "success";

    try {
      const data = await api.post("/users/register", user).then((response) => {
        return response.data;
      });

      await authUser(data);
    } catch (error) {
      msgText = error.response.data.message || "Erro ao realizar cadastro.";
      msgType = "error";
    }

    setFlashMessage(msgText, msgType);
  }

  async function authUser(data) {
    setAuthenticated(true);
    localStorage.setItem("token", data.token);

    api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

    navigate("/");
  }

  async function login(user) {
    let msgText = "Login realizado com sucesso!";
    let msgType = "success";

    try {
      const data = await api.post("/users/login", user).then((response) => {
        return response.data;
      });

      await authUser(data);
    } catch (error) {
      console.log(error.response?.data);
      msgText = error.response.data.message || "Erro ao realizar login.";
      msgType = "error";
    }

    setFlashMessage(msgText, msgType);
  }

  async function logout() {
    const msgText = "Logout realizado com sucesso!";
    const msgType = "success";

    setAuthenticated(false);
    localStorage.removeItem("token");

    // Remove o cabeçalho de forma limpa e segura
    delete api.defaults.headers.common["Authorization"];

    navigate("/");
    setFlashMessage(msgText, msgType);
  }

  return {
    authenticated,
    register,
    logout,
    login,
  };
}
