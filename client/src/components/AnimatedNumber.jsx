import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export const AnimatedNumber = ({ value, duration = 1000, suffix = '', decimals = 0 }) => {
    const [displayedValue, setDisplayedValue] = useState(0);

    useEffect(() => {
        let animationFrameId;
        const startTime = performance.now();

        const animate = (currentTime) => {
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

    return (
        <span>
        {displayedValue.toFixed(decimals)}{suffix}
        </span>
    );
};

AnimatedNumber.propTypes = {
    value: PropTypes.number.isRequired,
    duration: PropTypes.number,
    suffix: PropTypes.string,
    decimals: PropTypes.number,
};