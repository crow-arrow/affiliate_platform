"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { AnimatedNumber } from "./utils/AnimatedNumber";
import { ArrowRight } from "lucide-react";
import { fetchLevelSettings } from "@/redux/features/admin/adminSettingsSlice";

export const ProgressBar = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);
  const numberOfTravellers = currentUser?.current_year_travellers || 0;
  const userLevel = currentUser?.level;

  const { levelSettings, appSettings } = useAppSelector((state) => state.adminSettings);

  // Загружаем настройки уровней
  useEffect(() => {
    dispatch(fetchLevelSettings());
  }, [dispatch]);

  // Определяем текущий уровень и данные на основе динамических настроек
  const getCurrentLevelData = () => {
    // Fallback данные если настройки не загружены
    const fallbackLevels = [
      { id: 1, levelName: "BRONZE", levelOrder: 1, requiredAmount: 0, isActive: true },
      { id: 2, levelName: "SILVER", levelOrder: 2, requiredAmount: 10, isActive: true },
      { id: 3, levelName: "GOLD", levelOrder: 3, requiredAmount: 25, isActive: true },
      { id: 4, levelName: "PLATINUM", levelOrder: 4, requiredAmount: 50, isActive: true },
    ];

    const sortedLevels = (levelSettings.length > 0 ? levelSettings : fallbackLevels)
      .filter((level) => level.isActive)
      .sort((a, b) => a.levelOrder - b.levelOrder);

    // Находим текущий уровень пользователя
    const currentLevelIndex = sortedLevels.findIndex(
      (level) => level.levelName.toUpperCase() === userLevel?.toUpperCase()
    );

    if (currentLevelIndex === -1 || currentLevelIndex === sortedLevels.length - 1) {
      // Если уровень не найден или это последний уровень
      const lastLevel = sortedLevels[sortedLevels.length - 1];
      return {
        current: numberOfTravellers,
        max: lastLevel?.requiredAmount || 100,
        nextLevel: "MAX",
        steps: sortedLevels.map((level) => level.requiredAmount),
        color: "#374151",
      };
    }

    const currentLevel = sortedLevels[currentLevelIndex];
    const nextLevel = sortedLevels[currentLevelIndex + 1];

    return {
      current: numberOfTravellers,
      max: nextLevel.requiredAmount,
      nextLevel: nextLevel.levelName,
      steps: sortedLevels.map((level) => level.requiredAmount),
      color: "#374151",
    };
  };

  const levelData = getCurrentLevelData();
  const remainingTravellers = levelData.max - levelData.current;

  return (
    <div className="flex flex-col items-center justify-center w-full space-y-6 p-6 gap-6">
      {/* Центральное число */}
      <div className="text-center">
        <div className="text-5xl font-bold text-gray-800 dark:text-foreground">
          <AnimatedNumber value={levelData.current || 0} />
        </div>
        <div className="flex items-center justify-center gap-1 text-sm text-gray-600 dark:text-muted-foreground mt-2">
          <span>{appSettings?.levelAmountDescription || "Travellers This Year"}</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>

      {/* Горизонтальный прогресс-бар с кружочками */}
      <div className="relative w-full max-w-[400px]">
        {/* Контейнер прогресс-бара */}
        <div className="relative flex items-center justify-between w-full">
          {/* Фоновая линия */}
          <div className="absolute top-1/2 left-0 right-0 h-3 bg-gray-200 dark:bg-gray-700 rounded-full transform -translate-y-1/2"></div>

          {/* Прогресс линия */}
          <div
            className="absolute top-1/2 left-0 h-3 bg-gray-600 dark:bg-gray-500 rounded-full transform -translate-y-1/2 transition-all duration-1000"
            style={{
              width: `${Math.min((levelData.current / levelData.max) * 100, 100)}%`,
            }}
          ></div>

          {/* Кружочки как часть линии */}
          {levelData.steps.map((step, index) => {
            const isCompleted = levelData.current >= step;
            const position = (step / levelData.max) * 100;

            return (
              <div key={step} className="relative z-10 flex flex-col items-center">
                {/* Кружочек с цифрой */}
                <div
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                    isCompleted
                      ? "bg-gray-600 dark:bg-gray-500 border-gray-600 dark:border-gray-500 text-white"
                      : "bg-white dark:bg-secondary border-gray-300 dark:border-border text-gray-600 dark:text-muted-foreground"
                  }`}
                  style={{
                    position: "absolute",
                    left: `${position}%`,
                    transform: "translateX(-50%) translateY(-50%)",
                    top: "50%",
                  }}
                >
                  <span className="text-xs font-bold">{step}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Информация о следующем уровне */}
      <div className="text-center space-y-1">
        <div className="text-sm text-gray-500 dark:text-muted-foreground">
          Next level: {levelData.nextLevel}
        </div>
        <div className="text-xs text-gray-400 dark:text-muted-foreground/80">
          {Math.max(0, remainingTravellers)} more to the next level: {levelData.nextLevel}
        </div>
      </div>
    </div>
  );
};
