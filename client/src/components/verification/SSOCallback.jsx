import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const SSOCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.info("Redirecting to complete sign-in...");
    navigate("/sign-in/oauth-done");
  }, [navigate]);

  return <AuthenticateWithRedirectCallback />;
};
