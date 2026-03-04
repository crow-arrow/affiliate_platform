import { useEffect, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  suffix?: string;
  decimals?: number;
  formatValue?: (value: number) => string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 1000,
  suffix = "",
  decimals = 0,
  formatValue,
}) => {
  const [displayedValue, setDisplayedValue] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = progress * value;
      setDisplayedValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  const formatted = formatValue
    ? formatValue(Number(displayedValue.toFixed(decimals)))
    : displayedValue.toFixed(decimals);

  return (
    <span>
      {formatted}
      {suffix}
    </span>
  );
};
