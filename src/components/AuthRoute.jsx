import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// eslint-disable-next-line react/prop-types
function AuthRoute({ children }) {
  const auth = useAuth();

  if (!auth.user) {
    return <Navigate to="/login" />;
  }

  return children;
}

export { AuthRoute };
