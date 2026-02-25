import { useEffect } from 'react';
import gsap from 'gsap';

/**
 * useMagnetic Hook
 * Creates a haptic, magnetic interaction where elements follow the cursor within a radius.
 * Powered by gsap.quickSetter for un-throttled, 60fps hardware-accelerated transforms.
 * 
 * Target elements using `data-magnetic` (parent) and `data-magnetic-text` (child for layered depth).
 */
export const useMagnetic = () => {
    useEffect(() => {
        const cleanups = [];
        // Collect all interactive elements
        const magneticElements = document.querySelectorAll('[data-magnetic]');

        // Setup GSAP context to ensure React 19 safety and prevent memory leaks
        const ctx = gsap.context(() => {
            magneticElements.forEach((element) => {
                // Find inner text element for depth parallax (optional)
                const textElement = element.querySelector('[data-magnetic-text]');

                // Initialize highly optimized gsap setters (avoids creating new tween objects every frame)
                const xTo = gsap.quickTo(element, "x", { duration: 1, ease: "elastic.out(1, 0.3)", force3D: true });
                const yTo = gsap.quickTo(element, "y", { duration: 1, ease: "elastic.out(1, 0.3)", force3D: true });

                let textXTo, textYTo;
                if (textElement) {
                    textXTo = gsap.quickTo(textElement, "x", { duration: 1, ease: "elastic.out(1, 0.3)", force3D: true });
                    textYTo = gsap.quickTo(textElement, "y", { duration: 1, ease: "elastic.out(1, 0.3)", force3D: true });
                }

                const handleMouseMove = (e) => {
                    const { clientX, clientY } = e;
                    const { height, width, left, top } = element.getBoundingClientRect();

                    const centerX = left + width / 2;
                    const centerY = top + height / 2;

                    // Interaction radius: ~100px engagement zone around center
                    const distanceX = clientX - centerX;
                    const distanceY = clientY - centerY;

                    // If cursor is within range, pull element
                    // Max pull distance is restricted to keep it clean (e.g., width * 0.3)
                    if (Math.abs(distanceX) < width + 100 && Math.abs(distanceY) < height + 100) {
                        // calculate pull strength based on distance, easing out slightly
                        const x = distanceX * 0.3;
                        const y = distanceY * 0.3;

                        xTo(x);
                        yTo(y);

                        // Text moves at 50% speed exactly for parallax layering depth
                        if (textElement) {
                            textXTo(x * 0.5);
                            textYTo(y * 0.5);
                        }
                    } else {
                        // Spring back to center instantly if cursor moves far away suddenly
                        xTo(0);
                        yTo(0);
                        if (textElement) {
                            textXTo(0);
                            textYTo(0);
                        }
                    }
                };

                const handleMouseLeave = () => {
                    // Instantly snap back to 0 on explicit leave
                    xTo(0);
                    yTo(0);
                    if (textElement) {
                        textXTo(0);
                        textYTo(0);
                    }
                };

                // Attach pure DOM events for maximum calculation priority
                // The parent layout container (not the button itself) should usually trigger this
                // but for direct element tracking, window is better for smooth tracking outside element bounds.
                // However, attaching to the element is safer for large pages to avoid running 100 distance checks on every pixel move.
                element.addEventListener('mousemove', handleMouseMove);
                element.addEventListener('mouseleave', handleMouseLeave);

                // Cleanup listener assignment
                cleanups.push(() => {
                    element.removeEventListener('mousemove', handleMouseMove);
                    element.removeEventListener('mouseleave', handleMouseLeave);
                });
            });
        });

        return () => {
            ctx.revert(); // Clean up all GSAP instances tightly
            cleanups.forEach(cleanup => cleanup());
        };
    }, []);
};
