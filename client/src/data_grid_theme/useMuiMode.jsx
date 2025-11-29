import { useEffect, useState } from "react";

export const useMuiMode = () => {
    const getMode = () =>
        document.documentElement.classList.contains("dark") ? "dark" : "light";

    const [mode, setMode] = useState(getMode());

    useEffect(() => {
        const observer = new MutationObserver(() => {
            const newMode = getMode();
            setMode((prevMode) => (prevMode !== newMode ? newMode : prevMode));
        });

        observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    return String(mode);
};