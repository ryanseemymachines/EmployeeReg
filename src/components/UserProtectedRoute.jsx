import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../auth";

const UserProtectedRoute = ({ children }) => {

  if (isLoggedIn()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default UserProtectedRoute;