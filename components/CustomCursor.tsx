
import React, { useEffect, useRef, useState } from 'react';

const CustomCursor: React.FC = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const cursor = cursorRef.current;
        if (!cursor) return;

        const moveCursor = (e: MouseEvent) => {
            // Manipulación DIRECTA del DOM para latencia cero
            cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseEnter = () => setIsVisible(true);
        const handleMouseLeave = () => setIsVisible(false);

        const handleMouseDown = () => setIsActive(true);
        const handleMouseUp = () => setIsActive(false);

        const handleHoverStart = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isInteractive = target.closest('button, a, input, select, textarea, [role="button"], .group, [onclick]');
            if (isInteractive) {
                setIsHovering(true);
            }
        };

        const handleHoverEnd = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isInteractive = target.closest('button, a, input, select, textarea, [role="button"], .group, [onclick]');
            if (isInteractive) {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', moveCursor);
        document.addEventListener('mouseenter', handleMouseEnter);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);

        // Use event delegation for hover states
        document.addEventListener('mouseover', handleHoverStart);
        document.addEventListener('mouseout', handleHoverEnd);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            document.removeEventListener('mouseenter', handleMouseEnter);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mouseover', handleHoverStart);
            document.removeEventListener('mouseout', handleHoverEnd);
        };
    }, [isVisible]);

    return (
        <div
            className={`fixed inset-0 pointer-events-none z-[99999] hidden md:block transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
            <div
                ref={cursorRef}
                className="absolute top-0 left-0 will-change-transform"
                style={{
                    // Usamos translate3d para aceleración por hardware (GPU)
                    transform: 'translate3d(-100px, -100px, 0)',
                }}
            >
                <div className={`relative flex items-center justify-center transition-transform duration-150 ${isActive ? 'scale-75' : 'scale-100'}`}>
                    {/* Outer Frame (Diamond) */}
                    <div className={`
                        absolute w-5 h-5 border-[1.5px] transition-all duration-300 ease-out
                        ${isHovering
                            ? 'border-primary-500 scale-125 rotate-[135deg] opacity-100 shadow-[0_0_15px_rgba(14,165,233,0.5)]'
                            : 'border-neutral-800 dark:border-white opacity-40 rotate-45'}
                    `} />

                    {/* Inner Core (Locked) */}
                    <div className={`
                        w-1 h-1 transition-all duration-200 ease-out
                        ${isHovering
                            ? 'bg-primary-500 scale-0'
                            : 'bg-neutral-900 dark:bg-white scale-100 rotate-45'}
                    `} />

                    {/* Crosshair indicator */}
                    <div className={`
                        absolute transition-all duration-500
                        ${isHovering ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
                    `}>
                        <div className="absolute w-[1px] h-3 bg-primary-500 -top-5 left-0" />
                        <div className="absolute w-[1px] h-3 bg-primary-500 top-2 left-0" />
                        <div className="absolute h-[1px] w-3 bg-primary-500 -left-5 top-0" />
                        <div className="absolute h-[1px] w-3 bg-primary-500 left-2 top-0" />
                    </div>
                </div>
            </div>

            <style>{`
                @media (min-width: 768px) {
                    html, body, *, button, a {
                        cursor: none !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default CustomCursor;
