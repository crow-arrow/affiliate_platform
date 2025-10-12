import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { checkIsAuth } from "../../redux/features/auth/authSlice";
import PropTypes from "prop-types";

const AdminProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);
  const isAuth = useSelector(checkIsAuth);

  if (!isAuth) {
    return <Navigate to="/sign-in" replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/404-not-found" replace />;
  }

  return children;
};

AdminProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default AdminProtectedRoute;
