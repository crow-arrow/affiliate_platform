"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { AnimatedNumber } from "./utils/AnimatedNumber";
import { ArrowRight, User } from "lucide-react";
import { fetchLevelSettings } from "@/redux/features/admin/adminSettingsSlice";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getMe } from "@/redux/features/auth/authSlice";
import { selectTripsStatus } from "@/redux/features/users/userSelectors";
import { getLevelCardClasses } from "@/theme";

export const ProgressBar = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);
  const numberOfTravellers = currentUser?.current_year_travellers || 0;
  const userLevel = currentUser?.level;
  console.log("User level:", userLevel);
  console.log("Number of travellers:", numberOfTravellers);
  console.log("Current user:", currentUser);

  const { levelSettings, appSettings } = useAppSelector((state) => state.adminSettings);
  const tripsStatus = useAppSelector(selectTripsStatus);

  // Загружаем настройки уровней
  useEffect(() => {
    if (!currentUser?.id) return;

    dispatch(getMe());
    dispatch(fetchLevelSettings());
  }, [dispatch, currentUser?.id]);

  // Обновляем данные пользователя после получения туров
  useEffect(() => {
    if (tripsStatus === "succeeded") {
      dispatch(getMe());
    }
  }, [tripsStatus, dispatch]);

  const getNextLevel = (level?: string): string => {
    switch (level) {
      case "BRONZE":
        return "SILVER";
      case "SILVER":
        return "GOLD";
      case "GOLD":
        return "PLATINUM";
      default:
        return "-";
    }
  };

  const getLevelName = (level?: string): string => {
    // Если это строка в верхнем регистре (из базы данных)
    if (typeof level === "string") {
      switch (level.toUpperCase()) {
        case "BRONZE":
          return "BRONZE";
        case "SILVER":
          return "SILVER";
        case "GOLD":
          return "GOLD";
        case "PLATINUM":
          return "PLATINUM";
        default:
          return "BRONZE";
      }
    }

    return "BRONZE";
  };

  const getLevelCardStyle = (level?: string) => {
    const levelLower = level?.toLowerCase() as keyof typeof getLevelCardClasses;

    if (levelLower && ["bronze", "silver", "gold", "platinum"].includes(levelLower)) {
      const classes = getLevelCardClasses(levelLower);
      return {
        className: `relative overflow-hidden ${classes.card}`,
        iconColor: classes.icon,
        titleColor: classes.title,
        descriptionColor: classes.description,
        accentColor: classes.accent,
      };
    }

    // Default fallback
    return {
      className:
        "relative overflow-hidden bg-gradient-to-br from-muted to-card dark:from-background dark:to-card border-border dark:border-border",
      iconColor: "text-muted-foreground dark:text-muted-foreground",
      titleColor: "text-foreground dark:text-foreground",
      descriptionColor: "text-muted-foreground dark:text-muted-foreground",
      accentColor: "bg-muted dark:bg-secondary",
    };
  };

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
        nextLevel: "",
        steps: sortedLevels.map((level) => level.requiredAmount),
        color: "#374151",
      };
    }

    const currentLevel = sortedLevels[currentLevelIndex];
    const nextLevel = sortedLevels[currentLevelIndex + 1];

    return {
      current: numberOfTravellers || 0,
      max: nextLevel?.requiredAmount || 100,
      nextLevel: nextLevel?.levelName || "",
      steps: sortedLevels.map((level) => level.requiredAmount),
      color: "#374151",
    };
  };

  const levelData = getCurrentLevelData();

  return (
    <Card className={getLevelCardStyle(getLevelName(userLevel)).className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle
            className={`flex items-center gap-2 ${getLevelCardStyle(getLevelName(userLevel)).titleColor}`}
          >
            <Badge
              variant="outline"
              className={`px-3 py-1 gap-2 text-lg font-bold ${getLevelCardStyle(getLevelName(userLevel)).descriptionColor}`}
            >
              {getLevelName(userLevel)}
            </Badge>
          </CardTitle>
          <CardDescription
            className={`p-2 ${getLevelCardStyle(getLevelName(userLevel)).descriptionColor}`}
          >
            <User className={`h-5 w-5 ${getLevelCardStyle(getLevelName(userLevel)).iconColor}`} />
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center w-full space-y-2 px-6 gap-6">
          {/* Центральное число */}
          <div className="text-center">
            <div className="text-5xl font-bold text-foreground dark:text-foreground">
              <AnimatedNumber value={levelData.current || 0} />
            </div>
            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground dark:text-muted-foreground mt-2">
              <span>{appSettings?.levelAmountDescription || "Travellers This Year"}</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Горизонтальный прогресс-бар с кружочками */}
          <div className="relative w-full max-w-[400px]">
            {/* Контейнер прогресс-бара */}
            <div className="relative flex items-center justify-between w-full">
              {/* Фоновая линия */}
              <div className="absolute top-1/2 left-0 right-0 h-3 bg-muted dark:bg-muted rounded-full transform -translate-y-1/2"></div>

              {/* Прогресс линия */}
              <div
                className="absolute top-1/2 left-0 h-3 bg-primary dark:bg-primary rounded-full transform -translate-y-1/2 transition-all duration-1000"
                style={{
                  width: `${levelData.max > 0 ? Math.min((levelData.current / levelData.max) * 100, 100) : 0}%`,
                }}
              ></div>

              {/* Кружочки как часть линии */}
              {levelData.steps.map((step, index) => {
                const isCompleted = levelData.current >= step;
                const position = levelData.max > 0 ? (step / levelData.max) * 100 : 0;

                return (
                  <div key={step} className="relative z-10 flex flex-col items-center">
                    {/* Кружочек с цифрой */}
                    <div
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                        isCompleted
                          ? "bg-primary dark:bg-primary border-primary dark:border-primary text-primary-foreground"
                          : "bg-background dark:bg-secondary border-border dark:border-border text-muted-foreground dark:text-muted-foreground"
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
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground dark:text-muted-foreground">
              Next level: {levelData.nextLevel}
            </div>
          </div>
          <div className="text-center">
            <Badge variant="outline" className="px-3 py-1">
              Next level: {getNextLevel(getLevelName(userLevel))}
            </Badge>
          </div>
        </div>
      </CardContent>
      <div
        className={`absolute -top-4 -right-4 w-24 h-24 ${getLevelCardStyle(getLevelName(userLevel)).accentColor} rounded-full opacity-20`}
      ></div>
    </Card>
  );
};
