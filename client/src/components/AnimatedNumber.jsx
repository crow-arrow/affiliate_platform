import { useEffect, useState } from 'react';

export const AnimatedNumber = ({ value, duration = 1000, suffix = '', decimals = 0 }) => {
    const [displayedValue, setDisplayedValue] = useState(0);

    useEffect(() => {
        let start = 0;
        const startTime = performance.now();

        const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = start + progress * (value - start);
        setDisplayedValue(current);

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
        };

        requestAnimationFrame(animate);
    }, [value, duration]);

    return (
        <span>
        {displayedValue.toFixed(decimals)}{suffix}
        </span>
    );
};