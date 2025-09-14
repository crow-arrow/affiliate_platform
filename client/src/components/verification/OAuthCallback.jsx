export const OAuthCallback = () => {
  const { isSignedIn, user: clerkUser } = useUser();
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth = useSelector(checkIsAuth);

  const calledRef = useRef(false);

  useEffect(() => {
    console.log("=== OAuthCallback effect ===");
    console.log("isSignedIn:", isSignedIn);
    console.log("clerkUser:", clerkUser);
    console.log("isAuth:", isAuth);

    const run = async () => {
      if (calledRef.current) return;
      if (isSignedIn && clerkUser && !isAuth) {
        calledRef.current = true;
        try {
          const token = await getToken();
          console.log("Token:", token?.substring(0, 20), "...");
          await dispatch(loginWithOAuth({ token })).unwrap();
          console.log("✅ loginWithOAuth вызван");
          toast.success("Успешный вход через OAuth");
          navigate("/my-account");
        } catch (e) {
          console.error("❌ Ошибка:", e);
          toast.error("Ошибка при входе через OAuth");
          navigate("/sign-in");
        }
      }
    };

    run();
  }, [isSignedIn, clerkUser, isAuth, getToken, dispatch, navigate]);

  return <AuthenticateWithRedirectCallback />;
};
