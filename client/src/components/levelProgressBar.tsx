"use client"

import { useAppSelector } from "@/redux/hooks";
import { AnimatedNumber } from "./utils/AnimatedNumber";
import { ArrowRight } from "lucide-react";

export const ProgressBar = () => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const numberOfTravellers = currentUser?.current_year_travellers || 0;
  const userLevel = currentUser?.level;

  // Определяем максимальные значения для каждого уровня
  const getLevelData = () => {
    switch (userLevel) {
      case "BRONZE":
        return {
          max: 10,
          current: numberOfTravellers,
          nextLevel: "SILVER",
          color: "#374151",
          steps: [0, 10], // Только начало и конец
        };
      case "SILVER":
        return {
          max: 25,
          current: 15,
          nextLevel: "GOLD",
          color: "#374151",
          steps: [0, 10, 25], // Начало, середина, конец
        };
      case "GOLD":
        return {
          max: 50,
          current: numberOfTravellers,
          nextLevel: "PLATINUM",
          color: "#374151",
          steps: [0, 25, 50], // Начало, середина, конец
        };
      case "PLATINUM":
        return {
          max: 100,
          current: numberOfTravellers,
          nextLevel: "MAX",
          color: "#374151",
          steps: [0, 50, 100], // Начало, середина, конец
        };
      default:
        return {
          max: 10,
          current: numberOfTravellers,
          nextLevel: "SILVER",
          color: "#374151",
          steps: [0, 10],
        };
    }
  };

  const levelData = getLevelData();

  const remainingTravellers = levelData.max - levelData.current;

  return (
    <div className="flex flex-col items-center justify-center w-full space-y-6 p-6 gap-6">
      {/* Центральное число */}
      <div className="text-center">
        <div className="text-5xl font-bold text-gray-800">
          <AnimatedNumber value={levelData.current || 0} />
        </div>
        <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mt-2">
          <span>Travellers This Year</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>
      {/* Горизонтальный прогресс-бар с кружочками */}
      <div className="relative w-full max-w-[400px]">
        {/* Контейнер прогресс-бара */}
        <div className="relative flex items-center justify-between w-full">
          {/* Фоновая линия */}
          <div className="absolute top-1/2 left-0 right-0 h-3 bg-gray-200 rounded-full transform -translate-y-1/2"></div>
          
          {/* Прогресс линия */}
          <div 
            className="absolute top-1/2 left-0 h-3 bg-gray-600 rounded-full transform -translate-y-1/2 transition-all duration-1000"
            style={{ 
              width: `${Math.min((levelData.current / levelData.max) * 100, 100)}%` 
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
                      ? 'bg-gray-600 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-600'
                  }`}
                  style={{
                    position: 'absolute',
                    left: `${position}%`,
                    transform: 'translateX(-50%) translateY(-50%)',
                    top: '50%'
                  }}
                >
                  <span className="text-xs font-bold">
                    {step}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Информация о следующем уровне */}
      <div className="text-center space-y-1">
        <div className="text-sm text-gray-500">
        {Math.max(0, remainingTravellers)} more to the next level: {levelData.nextLevel}
        </div>
      </div>
    </div>
  );
};