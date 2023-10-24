import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../service/api";

const AuthContext = createContext();
// eslint-disable-next-line react/prop-types
function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const login = async (data) => {
    const response = await api
      .post("auth/login", data)
      .then((response) => response.data);

    localStorage.setItem("token", response.token);
    setUser(response.user);

    navigate("/dashboard-pqrsf");
  };

  const logout = () => {
    setUser(null);
    navigate("/");
  };

  const auth = { user, login, logout };

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export { AuthProvider, AuthContext };
