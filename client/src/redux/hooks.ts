import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import { useNavigate } from "react-router-dom";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useSafeNavigate = () => {
  const navigate = useNavigate();
  return (path: string) => {
    // Пример: логика перед навигацией
    // clearErrors();
    navigate(path);
  };
};
