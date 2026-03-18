"use strict";
"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export const CustomCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    const springConfig = { damping: 20, stiffness: 250 };
    const cursorX = useSpring(0, springConfig);
    const cursorY = useSpring(0, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            setPosition({ x: e.clientX, y: e.clientY });
        };

        const handleHover = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.tagName === "BUTTON" ||
                target.tagName === "A" ||
                target.closest("button") ||
                target.closest("a")
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("mouseover", handleHover);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mouseover", handleHover);
        };
    }, [cursorX, cursorY]);

    return (
        <>
            {/* Small dot cursor */}
            <motion.div
                className="fixed top-0 left-0 w-2 h-2 bg-[var(--color-primary)] rounded-full pointer-events-none z-[9999] mix-blend-difference"
                style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
            />

            {/* Crosshair ring */}
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 border border-[var(--color-primary)] rounded-full pointer-events-none z-[9999] opacity-50"
                animate={{
                    scale: isHovering ? 1.5 : 1,
                    rotate: isHovering ? 90 : 0,
                }}
                style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
            />

            {/* Crosshair lines */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9998]"
                style={{ x: cursorX, y: cursorY }}
            >
                <div className="absolute top-[-20px] left-0 w-[1px] h-[10px] bg-[var(--color-primary)]" />
                <div className="absolute bottom-[-20px] left-0 w-[1px] h-[10px] bg-[var(--color-primary)]" />
                <div className="absolute left-[-20px] top-0 w-[10px] h-[1px] bg-[var(--color-primary)]" />
                <div className="absolute right-[-20px] top-0 w-[10px] h-[1px] bg-[var(--color-primary)]" />
            </motion.div>
        </>
    );
};
