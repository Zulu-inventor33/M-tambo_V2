import { useEffect, useState } from 'react';

const useThemeMode = () => {
    // the default theme is light
    const [themeMode, setThemeMode] = useState(() => {
        // Default to light if no theme is set on the body
        return document.body.getAttribute('data-bs-theme') || 'light';
    });

    useEffect(() => {
        const handleThemeChange = () => {
            const newTheme = document.body.getAttribute('data-bs-theme');
            setThemeMode(newTheme);
        };

        // Using MutationObserver to watch for changes to the body's data-bs-theme attribute
        const observer = new MutationObserver(handleThemeChange);
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['data-bs-theme'],
        });

        // Cleanup observer when the component is unmounted
        return () => observer.disconnect();
    }, []);

    return themeMode;
};

export default useThemeMode;