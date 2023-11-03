import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../service/api";

const AuthContext = createContext();
// eslint-disable-next-line react/prop-types
function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const login = async (data) => {
    try {
      const response = await api.post("auth/login", data);
      const responseData = response.data;

      localStorage.setItem("token", responseData.token);
      setUser(responseData.user);

      navigate("/dashboard-pqrsf");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return false;
      }
    }
  };

  const logout = () => {
    setUser(null);
    navigate("/");
  };

  const auth = { user, login, logout };

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export { AuthProvider, AuthContext };
