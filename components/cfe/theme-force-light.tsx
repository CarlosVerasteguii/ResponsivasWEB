"use client"

import { useTheme } from 'next-themes';
import { useEffect } from 'react';

function ThemeForceLight() {
    const { setTheme } = useTheme();

    useEffect(() => {
        setTheme('light');
    }, [setTheme]);

    return null;
}

export default ThemeForceLight; 