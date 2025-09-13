// import { useSignIn } from "@clerk/clerk-react";
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// export const SSOCallback = () => {
//   const navigate = useNavigate();
//   const { isLoaded, signIn, setActive } = useSignIn();

//   useEffect(() => {
//     if (!isLoaded) return; // <-- ключевой момент

//     (async () => {
//       try {
//         console.log("➡️ SSOCallback mounted");
//         const result = await signIn.handleRedirectCallback();
//         console.log("➡️ handleRedirectCallback result:", result);

//         if (result?.createdSessionId) {
//           await setActive({ session: result.createdSessionId });
//           console.log("➡️ Clerk session set:", result.createdSessionId);
//           navigate("/my-account", { replace: true });
//         } else if (window.Clerk?.session) {
//           // сессия уже активна
//           navigate("/my-account", { replace: true });
//         } else {
//           // не получилось — на signin
//           navigate("/sign-in", { replace: true });
//         }
//       } catch (err) {
//         console.error("OAuth callback error:", err);
//         navigate("/sign-in", { replace: true });
//       }
//     })();
//   }, [isLoaded, signIn, setActive, navigate]);

//   return <div>Finishing login...</div>;
// };
