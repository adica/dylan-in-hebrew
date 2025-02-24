"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const PageTransition = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const [displayChildren, setDisplayChildren] = useState(children);

    useEffect(() => {
        // Only run in browser environment
        if (typeof window === 'undefined') return;

        // Check if View Transitions API is available
        // @ts-ignore - TypeScript doesn't recognize View Transitions API property
        if (!document.startViewTransition) {
            // Fallback for browsers without the API
            setDisplayChildren(children);
            return;
        }

        try {
            // Define CSS for the transition in a style tag
            const styleElement = document.createElement('style');
            styleElement.textContent = `
                ::view-transition-old(root),
                ::view-transition-new(root) {
                    animation-duration: 300ms;
                }
            `;
            document.head.appendChild(styleElement);

            // Run the transition
            // @ts-ignore - TypeScript doesn't recognize View Transitions API
            document.startViewTransition(() => {
                // Remove the temporary style
                styleElement.remove();
                
                // Update the state inside the transition
                setDisplayChildren(children);
                
                // Return a promise that resolves when React has updated the DOM
                return new Promise(resolve => setTimeout(resolve, 10));
            });
        } catch (error) {
            // Fallback in case of any errors
            console.error("View transition error:", error);
            setDisplayChildren(children);
        }
    }, [pathname, children]);

    return (
        <div className="page-content">
            {displayChildren}
        </div>
    );
};

export default PageTransition;