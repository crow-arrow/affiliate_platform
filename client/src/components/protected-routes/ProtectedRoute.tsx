import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { checkIsAuth } from "../../redux/features/auth/authSlice";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const isAuth = useAppSelector(checkIsAuth);

  if (!isAuth) {
    return <Navigate to="/sign-in" replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/404-not-found" replace />;
  }

  return <>{children}</>;
};
