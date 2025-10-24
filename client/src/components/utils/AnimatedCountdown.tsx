import { useSprings, animated } from "@react-spring/web";
import PropTypes from "prop-types";
import { useEffect, useRef } from "react";

// Format seconds as mm:ss
const formatTime = (sec) => {
  const minutes = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (sec % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export const AnimatedCountdown = ({ countdown }) => {
  // Инициализируем previous.current один раз с начальным значением
  const previous = useRef(formatTime(countdown));
  const current = formatTime(countdown);
  const chars = current.split("");

  const [springs, api] = useSprings(chars.length, () => ({
    transform: "translateY(0%)",
    opacity: 1,
  }));

  useEffect(() => {
    const prevChars = previous.current.split(""); // Получаем предыдущие символы
    api.start((index) => {
      const changed = chars[index] !== prevChars[index]; // Сравниваем текущий символ с предыдущим
      return changed
        ? {
            from: { transform: "translateY(-100%)", opacity: 0 },
            to: { transform: "translateY(0%)", opacity: 1 },
            config: { tension: 200, friction: 12 },
          }
        : {
            to: { transform: "translateY(0%)", opacity: 1 },
            immediate: true, // Не анимировать, если символ не изменился
          };
    });
    previous.current = current; // Обновляем предыдущее значение для следующего рендера
  }, [countdown, api, chars, current]); // Зависимости useEffect

  return (
    <span
      style={{
        display: "flex",
        gap: "2px",
        alignSelf: "center",
        justifyContent: "center",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {springs.map((style, idx) => (
        <animated.span key={idx} style={style}>
          {chars[idx]}
        </animated.span>
      ))}
    </span>
  );
};

AnimatedCountdown.propTypes = {
  countdown: PropTypes.number.isRequired,
};
